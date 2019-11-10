import argv from './config/CmdLineConfig';
import { controller } from './webdriver-controller';
import HtmlProcessor, { ResultCollection } from './HtmlProcessor';
import resultProcessor from './ResultProcessor';
import logger from './log/logger';
import { WebDriver } from 'selenium-webdriver';
import { sortResultCollection } from './util/ArrayUtil';
import { buildEshopData } from './eshop/eshopData';

const keywords = argv.keywords as string[];
const maxPriceValue = argv.maxprice;

try {

  const eshopData = buildEshopData(keywords);

  let instances: WebDriver[];

  controller.buildHeadlessFirefox()
    .then(webdriverList => {
      instances = webdriverList as WebDriver[];
      return controller.fetch(eshopData.dataList, instances)
    })
    .finally(
      () => Promise.all(controller.shutdown(instances))
    )
    .then(fetchDataList => {
      const result: ResultCollection = [];

      fetchDataList.forEach(fetchData => {
        const htmlProc = new HtmlProcessor(fetchData, eshopData.configList);
        result.push(
          ...htmlProc.buildResultCollection(
            resultProcessor.buildIsDesiredProductPrice(maxPriceValue)
          )
        );
      });

      return result;
    })
    .then(result => {
      sortResultCollection(result);
      logger.info(result);
    })
    .catch(err => logger.error(err));

} catch (err) {
  logger.error(err);
}
