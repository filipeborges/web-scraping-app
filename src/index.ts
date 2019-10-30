import { controller } from './webdriver-controller';
import HtmlProcessor, { ResultCollection } from './HtmlProcessor';
import ResultProcessor from './ResultProcessor';
import AmericanasConfig from './config/AmericanasConfig';
import SubmarinoConfig from './config/SubmarinoConfig';
import AmazonConfig from './config/AmazonConfig';
import logger from './log/logger';
import { WebDriver } from 'selenium-webdriver';

const keywords = ['controle','ps4']; // TODO: Convert to CMD line args
const maxPriceValue = '100';

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
      const resultProc = new ResultProcessor(maxPriceValue); // TODO: Make singleton
      const result: ResultCollection = [];

      fetchDataList.forEach(fetchData => {
        const htmlProc = new HtmlProcessor(fetchData, configList); // TODO: Make singleton
        result.push(...htmlProc.buildResultCollection(resultProc));
      });

      return result;
    })
    .then(result => logger.info(result))
    .catch(err => logger.error(err));

} catch (err) {
  logger.error(err);
}
