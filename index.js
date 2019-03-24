import DriverBrowser from './src/DriverBrowser';
import WallmartConfig from './src/config/WallmartConfig';
import HtmlProcessor from './src/HtmlProcessor';
import ResultProcessor from './src/ResultProcessor';

const keywords = ['console', 'ps4'];
const maxPriceValue = '100';

try {
  const config = WallmartConfig.getConfig(keywords);
  const resultProc = new ResultProcessor(maxPriceValue);
  const driverBrowser = new DriverBrowser();

  driverBrowser.retriveHtmlWithDelay(config.urls)
    .then((pagesHtml) => {
      const result = [];

      pagesHtml.forEach((html) => {
        const htmlProc = new HtmlProcessor(html, config);
        result.push(...htmlProc.buildResultCollection(resultProc));
      });

      console.log(result);
      console.log(result.length);

      driverBrowser.quit();
    })
    .catch((err) => {
      console.log(err);
      driverBrowser.quit();
    });
} catch (err) {
  console.log(err);
}
