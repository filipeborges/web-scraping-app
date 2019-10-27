// import DriverBrowser from './DriverBrowser';
import { controller } from './webdriver-controller';
import HtmlProcessor from './HtmlProcessor';
import ResultProcessor from './ResultProcessor';
// import AmericanasConfig from './config/AmericanasConfig';
import SubmarinoConfig from './config/SubmarinoConfig';
// import AmazonConfig from './config/AmazonConfig';
import logger from './log/logger';
import { WebDriver } from 'selenium-webdriver';

const keywords = ['ps4'];
const maxPriceValue = '3000';

try {
  // const config = AmericanasConfig.getConfig(keywords);
  const config = SubmarinoConfig.getConfig(keywords);
  // const config = AmazonConfig.getConfig(keywords);
  const resultProc = new ResultProcessor(maxPriceValue);

  let instances: WebDriver[];
  let result = []; // TODO: Type this var

  controller.buildHeadlessFirefox(2) // TODO: Move to instances value to .env
    .then(webdriverList => {
      instances = webdriverList as WebDriver[];
      return controller.fetch(config.urls, instances)
    })
    .then(pagesSrc => {
      pagesSrc.forEach(pageSrc => {
        const htmlProc = new HtmlProcessor(pageSrc, config);
        result.push(...htmlProc.buildResultCollection(resultProc));
      });
      logger.info(result);
    })
    .finally(() => {
      controller.shutdown(instances);
    });

} catch (err) {
  logger.error(err);
}
