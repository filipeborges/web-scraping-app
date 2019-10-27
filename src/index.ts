import { controller } from './webdriver-controller';
import HtmlProcessor, { ResultCollection } from './HtmlProcessor';
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
  let result: ResultCollection = [];

  controller.buildHeadlessFirefox()
    .then(webdriverList => {
      instances = webdriverList as WebDriver[];
      return controller.fetch(config.urls, instances) // TODO: Need to return {pageSrc, eshopType}[];
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
