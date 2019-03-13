import cheerio from 'cheerio';
import HtmlProcessorUtils from './util/HtmlProcessorUtils';
import WallmartConfig from './config/WallmartConfig';
import WallmartProcessor from './eshop/WallmartProcessor';
// import Logger from './log/Logger';

export default class HtmlProcessor {
  constructor(html, config) {
    this.config = config;
    this.$ = cheerio.load(html);
    this.productsCheerio = this.$(this.config.productSelector);
  }

  buildResultCollection(resultProcessor) {
    const result = [];

    this.productsCheerio.each((i, elem) => {
      let productPrice = this.getProductPrice(elem);
      productPrice = resultProcessor.isDesiredProductPrice(productPrice)
        ? productPrice : undefined;

      const productDetailLink = productPrice && this.getProductDetailLink(elem);
      const productName = productDetailLink && this.getProductName(elem);

      if (productName) {
        result.push({
          name: productName,
          price: productPrice,
          detailLink: productDetailLink,
        });
      }
    });
    return result;
  }

  getProductPrice(productCheerio) {
    const productPrice = cheerio(productCheerio)
      .find((this.config.productPriceSelector))[0];

    if (this.config.eshopType === WallmartConfig.eshopType()) {
      return WallmartProcessor.extractElemPrice(productPrice);
    }
    return undefined;
  }

  getProductName(productCheerio) {
    const productPrice = cheerio(productCheerio)
      .find((this.config.productNameSelector))[0];

    if (this.config.eshopType === WallmartConfig.eshopType()) {
      return WallmartProcessor.extractElemProductName(productPrice);
    }
    return undefined;
  }

  getProductDetailLink(productCheerio) {
    const productPrice = cheerio(productCheerio)
      .find((this.config.productLinkSelector))[0];
    let linkStr;

    if (this.config.eshopType === WallmartConfig.eshopType()) {
      linkStr = WallmartProcessor.extractElemLinkDetail(productPrice);
    }

    if (HtmlProcessorUtils.isValidLink(linkStr, this.config.validLinkPatterns)) {
      return HtmlProcessorUtils
        .normalizeProductDetailLink(linkStr, this.config.normalizeLinkKeywords);
    }
    return undefined;
  }
}
