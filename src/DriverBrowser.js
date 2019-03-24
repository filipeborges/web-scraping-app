import { Builder, Browser } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/firefox';
// import Logger from './log/Logger';
import { getRandomNumber } from './util/NumberUtils';

export default class DriverBrowser {
  constructor() {
    process.env.PATH = `${process.env.PATH}:${process.env.BROWSER_DRIVER_PATH}`;

    const firefoxOptions = new Options();
    firefoxOptions
      .setBinary(process.env.BROWSER_BIN_PATH)
      .headless();

    this.driver = new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(firefoxOptions)
      .build();
  }

  $getHtmlViaGetRequest(url) {
    return this.driver.get(url)
      .then(() => (
        this.driver.getPageSource()
          .catch((err) => {
            // Logger.logError(err);
            console.log(err);
            throw err;
          })
      ))
      .catch((err) => {
        // Logger.logError(err);
        console.log(err);
        throw err;
      });
  }

  retriveHtmlWithDelay(url) {
    return (
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, getRandomNumber(0, 7000));
      })
    ).then(() => this.$getHtmlViaGetRequest(url));
  }

  quit() {
    this.driver.quit();
  }
}
