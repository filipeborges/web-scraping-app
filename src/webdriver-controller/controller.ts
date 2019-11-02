import {
  Browser,
  Builder,
  ThenableWebDriver,
  WebDriver
} from 'selenium-webdriver';
// tslint:disable-next-line:no-submodule-imports
import { Options } from 'selenium-webdriver/firefox';

export interface FetchData {
  pageSrc: string;
  eshop: string;
}

class Controller {
  public buildHeadlessFirefox(): Promise<WebDriver[] | Error> {
    const instances: ThenableWebDriver[] = [];
    const options = new Options()
      .setBinary(process.env.BROWSER_BIN_PATH)
      .headless();

    const numInstances = Number(process.env.DRIVER_INSTANCES);

    try {
      for (let i = 0; i < numInstances; i++) {
        instances.push(
          new Builder()
            .forBrowser(Browser.FIREFOX)
            .setFirefoxOptions(options)
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