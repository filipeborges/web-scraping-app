import { Builder, Browser } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/firefox';
import logger from './log/logger';
import { getRandomNumber } from './util/NumberUtils';

export default class DriverBrowser {
  constructor() {
    process.env.PATH = `${process.env.PATH}:${process.env.BROWSER_DRIVER_PATH}`;

    const firefoxOptions = new Options();
    firefoxOptions
      .setBinary(process.env.BROWSER_BIN_PATH)
      .headless();

    this.pagesHtml = [];
    this.driver = new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(firefoxOptions)
      .build();
  }

  $getHtmlViaGetRequest(urls) {
    const currentUrl = urls.pop();

    return this.driver.get(currentUrl)
      .then(() => (
        this.driver.getPageSource()
          .then((html) => {
            this.pagesHtml.push(html);

            if (urls.length === 0) {
              return this.pagesHtml;
            }

            return this.$getHtmlViaGetRequest(urls);
          })
          .catch((err) => {
            logger.error(err);
            throw err;
          })
      ));
  }

  retriveHtmlWithDelay(urls) {
    urls.reverse();
    return (
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, getRandomNumber(0, 7000));
      })
    ).then(() => this.$getHtmlViaGetRequest(urls));
  }

  quit() {
    this.driver.quit();
  }
}
