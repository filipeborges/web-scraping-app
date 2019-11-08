import {
  Browser,
  Builder,
  ThenableWebDriver,
  WebDriver,
  Capabilities
} from 'selenium-webdriver';
// tslint:disable-next-line:no-submodule-imports
import { Options } from 'selenium-webdriver/firefox';
// tslint:disable-next-line:no-submodule-imports
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities';

export interface FetchData {
  pageSrc: string;
  eshop: string;
}

class Controller {
  private capabilities: Capabilities;

  constructor() {
    this.capabilities = this.buildCapabilities();
  }

  public buildHeadlessFirefox(): Promise<WebDriver[] | Error> {
    const instances: ThenableWebDriver[] = [];
    const options = new Options()
      .setBinary(process.env.BROWSER_BIN_PATH)
      .setProfile(process.env.PROFILE_TEMPLATE_FF)
      .headless();

    const numInstances = Number(process.env.DRIVER_INSTANCES);

    try {
      for (let i = 0; i < numInstances; i++) {
        instances.push(
          new Builder()
            .forBrowser(Browser.FIREFOX)
            .setFirefoxOptions(options)
            .withCapabilities(this.capabilities)
            .build()
        );
      }
    } catch (err) {
      return this.handleWebDriverCreationError(err, instances);
    }

    return Promise.all(instances).catch(err =>
      this.handleWebDriverCreationError(err, instances)
    );
  }

  private buildCapabilities(): Capabilities {
    const capabilities = Capabilities.firefox();
    (capabilities as any).setPageLoadStrategy(
      PageLoadStrategy.EAGER
    );
    return capabilities;
  }

  public shutdown(instances: WebDriver[]): Array<Promise<void>> {
    const promises = instances.map(instance => {
      return instance.quit();
    });
    return promises;
  }

  public fetch(data: { url: string, eshop: string }[], webdriverList: WebDriver[]): Promise<FetchData[]> {
    const webdriverWorkerList = this.buildWebDriverWorker(webdriverList);

    const promisesFetch = data.map(dataItem => {
      return new Promise((resolve, reject) => {
        this.fetchUrl(dataItem.url, webdriverWorkerList)
          .then(
            pageSrc => resolve({ pageSrc, eshop: dataItem.eshop })
          )
          .catch(err => reject(err));
      }) as Promise<FetchData>;
    });
    return Promise.all(promisesFetch);
  }

  private handleWebDriverCreationError(
    err: Error,
    instances: ThenableWebDriver[]
  ): Promise<Error> {
    return Promise.all(this.shutdown(instances))
      .then(() => Promise.reject(err))
      .catch(() => Promise.reject(err));
  }

  private fetchUrl(
    url: string,
    webdriverWorkerList: WebDriverWorker[]
  ): Promise<string> {
    return new Promise((resolve, reject) =>
      this.fetchUrlWork(url, webdriverWorkerList, resolve, reject)
    );
  }

  private fetchUrlWork(
    url: string,
    webdriverWorkerList: WebDriverWorker[],
    resolve: any,
    reject: any
  ): void {
    const freeWebdriverWorker = webdriverWorkerList.find(
      webdriverWorker => webdriverWorker.isFree
    );

    if (freeWebdriverWorker) {
      freeWebdriverWorker.isFree = false;
      this.retrievePage(url, freeWebdriverWorker.webdriver)
        .then(pageSrc => resolve(pageSrc))
        .catch(err => reject(err))
        .finally(() => (freeWebdriverWorker.isFree = true));
    } else {
      setTimeout(
        () => this.fetchUrlWork(url, webdriverWorkerList, resolve, reject),
        20
      );
    }
  }

  private retrievePage(
    url: string,
    webdriver: WebDriver
  ): Promise<string | Error> {
    return webdriver
      .get(url)
      .then(() => webdriver.getPageSource())
      .catch(err => Promise.resolve(err));
  }

  private buildWebDriverWorker(webdriverList: WebDriver[]): WebDriverWorker[] {
    return webdriverList.map(webdriver => ({ isFree: true, webdriver }));
  }
}

interface WebDriverWorker {
  isFree: boolean;
  webdriver: WebDriver;
}

export default new Controller();
