import DriverBrowser from './src/DriverBrowser';
import WallmartConfig from './src/config/WallmartConfig';
import HtmlProcessor from './src/HtmlProcessor';
// import config from './src/config/config';

// const url = config.wallmart.searchString.replace('<keyword>', 'ps4').replace('<quantity>', '30');

WallmartConfig.setUrl('ps4', 20);
const config = WallmartConfig.getConfig();

DriverBrowser.retriveHtmlWithDelay(config.searchString)
  .then((html) => {
    const htmlProc = new HtmlProcessor(html, config);
    console.log(htmlProc.numberOfProductMatches());
    DriverBrowser.quit();
  })
  .catch((err) => {
    console.log(err);
    DriverBrowser.quit();
  });
