import argv from './config/CmdLineConfig';
import { controller } from './webdriver-controller';
import HtmlProcessor, { ResultCollection } from './HtmlProcessor';
import resultProcessor from './ResultProcessor';
import AmericanasConfig from './eshop/config/AmericanasConfig';
import SubmarinoConfig from './eshop/config/SubmarinoConfig';
import AmazonConfig from './eshop/config/AmazonConfig';
import logger from './log/logger';
import { WebDriver } from 'selenium-webdriver';
import { sortResultCollection } from './util/ArrayUtil';

const keywords = argv.keywords as string[];
const maxPriceValue = argv.maxprice;

try {
  const configList = []; // TODO: Type Array
  configList.push(SubmarinoConfig.getConfig(keywords));
  configList.push(AmericanasConfig.getConfig(keywords));
  configList.push(AmazonConfig.getConfig(keywords));

  const dataList = [ // TODO: Improve
    ...configList[0].data,
    ...configList[1].data,
    ...configList[2].data,
  ];

  let instances: WebDriver[];

  controller.buildHeadlessFirefox()
    .then(webdriverList => {
      instances = webdriverList as WebDriver[];
      return controller.fetch(dataList, instances)
    })
    .finally(
      () => Promise.all(controller.shutdown(instances))
    )
    .then(fetchDataList => {
      const result: ResultCollection = [];

      fetchDataList.forEach(fetchData => {
        const htmlProc = new HtmlProcessor(fetchData, configList);
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
