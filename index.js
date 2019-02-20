import DriverBrowser from './src/DriverBrowser';
import WallmartConfig from './src/config/WallmartConfig';
import HtmlProcessor from './src/HtmlProcessor';
import ResultProcessor from './src/ResultProcessor';

const keyword = 'ps4';
const maxPriceValue = '1800';

// TODO: Define maxNumber of products to fetch;

WallmartConfig.setUrl(keyword, 100);
const config = WallmartConfig.getConfig();

DriverBrowser.retriveHtmlWithDelay(config.url)
  .then((html) => {
    const htmlProc = new HtmlProcessor(html, config, WallmartConfig.eshopType());
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
