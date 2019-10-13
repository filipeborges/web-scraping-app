import DriverBrowser from './DriverBrowser';
import HtmlProcessor from './HtmlProcessor';
import ResultProcessor from './ResultProcessor';
// import AmericanasConfig from './src/config/AmericanasConfig';
import SubmarinoConfig from './config/SubmarinoConfig';
import logger from './log/logger';

const keywords = ['ps4'];
const maxPriceValue = '3000';

try {
  // const config = AmericanasConfig.getConfig(keywords);
  const config = SubmarinoConfig.getConfig(keywords);
  const resultProc = new ResultProcessor(maxPriceValue);
  const driverBrowser = new DriverBrowser();

  driverBrowser.retriveHtmlWithDelay(config.urls)
    .then((pagesHtml) => {
      const result = [];

      pagesHtml.forEach((html) => {
        const htmlProc = new HtmlProcessor(html, config);
        result.push(...htmlProc.buildResultCollection(resultProc));
      });

      logger.info(result);

      driverBrowser.quit();
    })
    .catch((err) => {
      logger.error(err);
      driverBrowser.quit();
    });
} catch (err) {
  logger.error(err);
}
