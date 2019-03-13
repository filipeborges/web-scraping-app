import DriverBrowser from './src/DriverBrowser';
import WallmartConfig from './src/config/WallmartConfig';
import HtmlProcessor from './src/HtmlProcessor';
import ResultProcessor from './src/ResultProcessor';

const keywords = ['console', 'ps4'];
const maxPriceValue = '2000';

try {
  const config = WallmartConfig.getConfig(keywords);

  DriverBrowser.retriveHtmlWithDelay(config.url)
    .then((html) => {
      const resultProc = new ResultProcessor(maxPriceValue);
      const htmlProc = new HtmlProcessor(html, config);
      const result = htmlProc.buildResultCollection(resultProc);

      console.log(result);
      console.log(result.length);
      DriverBrowser.quit();
    })
    .catch((err) => {
      console.log(err);
      DriverBrowser.quit();
    });
} catch (err) {
  console.log(err);
  DriverBrowser.quit();
}
