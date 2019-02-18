import cheerio from 'cheerio';
import HtmlProcessorUtils from './util/HtmlProcessorUtils';
import WallmartConfig from './config/WallmartConfig';
import WallmartProcessor from './eshop/WallmartProcessor';
// import Logger from './log/Logger';

// const isValidSearchString = searchString => (
//   searchString && !searchString.match('<|>')
// );

const isValidConfig = config => (
  config
  && config.productSelector
  && config.productLinkSelector
  && config.productPriceSelector
  && config.productNameSelector
  && config.validLinkPatterns
);

export default class HtmlProcessor {
  constructor(html, config, eshopType) {
    if (!isValidConfig(config)) {
      throw new Error('HtmlProcessor.constructor: Missing config info');
    }

    this.config = config;
    this.eshopType = eshopType;
    this.$ = cheerio.load(html);
    this.productsCheerio = this.$(this.config.productSelector);
  }

  numberOfProductMatches() {
    return this.$(this.config.productSelector).length;
  }

  getProductPrices() {
    const prices = [];
    const productPrices = this.productsCheerio.find(this.config.productPriceSelector);
    productPrices.each((i, elem) => {
      if (this.eshopType === WallmartConfig.eshopType()) {
        prices.push(WallmartProcessor.extractElemPrice(elem));
      }
    });
    return prices;
  }

  getProductNames() {
    const names = [];
    const productNames = this.productsCheerio.find(this.config.productNameSelector);
    productNames.each((i, elem) => {
      if (this.eshopType === WallmartConfig.eshopType()) {
        names.push(WallmartProcessor.extractElemProductName(elem));
      }
    });
    return names;
  }

  getProductDetailLinks() {
    const urls = [];
    let linkStr;

    this.productsCheerio
      .find(this.config.productLinkSelector)
      .each((i, elem) => {
        if (this.eshopType === WallmartConfig.eshopType()) {
          linkStr = WallmartProcessor.extractElemLinkDetail(elem);
        }
        const linkAlreadyExists = urls.some(url => url === linkStr);
        if (!linkAlreadyExists
          && HtmlProcessorUtils.isValidLink(linkStr, this.config.validLinkPatterns)) {
          urls.push(linkStr);
        }
      });
    return HtmlProcessorUtils.normalizeProductDetailLinks(urls, this.config.normalizeLinkKeywords);
  }
}
