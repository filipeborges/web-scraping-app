import DriverBrowser from './src/DriverBrowser';
import WallmartConfig from './src/config/WallmartConfig';
import HtmlProcessor from './src/HtmlProcessor';
import ResultProcessor from './src/ResultProcessor';

const keywords = ['console', 'ps4'];
const maxPriceValue = '1700';

// TODO: Define maxNumber of products to fetch;
const config = WallmartConfig.getConfig(keywords, 100);

DriverBrowser.retriveHtmlWithDelay(config.url)
  .then((html) => {
    const htmlProc = new HtmlProcessor(html, config);
    const productNames = htmlProc.getProductNames();
    const productPrices = htmlProc.getProductPrices();
    const produtDetailLinks = htmlProc.getProductDetailLinks();
    const resultProc = new ResultProcessor(productNames, productPrices, produtDetailLinks);

    const result = resultProc.findResultsByPrice(maxPriceValue);
    console.log(result);
    console.log(result.length);
    DriverBrowser.quit();
  })
  .catch((err) => {
    console.log(err);
    DriverBrowser.quit();
  });
