import DriverBrowser from './src/DriverBrowser';
import WallmartConfig from './src/config/WallmartConfig';
import HtmlProcessor from './src/HtmlProcessor';
import ResultProcessor from './src/ResultProcessor';

const keywords = ['console', 'ps4'];
const maxPriceValue = '100';

const drivers = [];

try {
  const config = WallmartConfig.getConfig(keywords);
  const resultProc = new ResultProcessor(maxPriceValue);

  const fetchPromises = config.urls.map((url) => {
    const driverBrowser = new DriverBrowser();
    drivers.push(driverBrowser);
    return driverBrowser.retriveHtmlWithDelay(url);
  });

  Promise.all(fetchPromises)
    .then((pagesHtml) => {
      const result = [];

      pagesHtml.forEach((html) => {
        const htmlProc = new HtmlProcessor(html, config);
        result.push(...htmlProc.buildResultCollection(resultProc));
      });

      console.log(result);
      console.log(result.length);
      drivers.forEach(driver => driver.quit());
    })
    .catch((err) => {
      console.log(err);
      drivers.forEach(driver => driver.quit());
    });
} catch (err) {
  console.log(err);
  drivers.forEach(driver => driver.quit());
}
