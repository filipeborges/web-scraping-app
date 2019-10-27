import cheerio from 'cheerio';
import HtmlProcessorUtils from './util/HtmlProcessorUtils';
import AmericanasConfig from './config/AmericanasConfig';
import AmericanasProcessor from './eshop/AmericanasProcessor';
import SubmarinoConfig from './config/SubmarinoConfig';
import SubmarinoProcessor from './eshop/SubmarinoProcessor';
import AmazonConfig from './config/AmazonConfig';
import AmazonProcessor from './eshop/AmazonProcessor';
import logger from './log/logger';
import { EshopConfig } from './config/config.interface';
import ResultProcessor from './ResultProcessor';

export type ResultCollection = {
  name: string;
  price: string;
  detailLink: string;
}[];

export default class HtmlProcessor {

  private config: EshopConfig;
  private $: CheerioStatic;
  private productsCheerio: Cheerio;

  constructor(html: string, config: EshopConfig) {
    this.config = config;
    this.$ = cheerio.load(html);
    this.productsCheerio = this.$(this.config.productSelector);
  }

  buildResultCollection(resultProcessor: ResultProcessor) {
    const result: ResultCollection = [];

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

  getProductPrice(productCheerio: CheerioElement) {
    const productPrice = cheerio(productCheerio)
      .find(this.config.productPriceSelector)[0];

    if (this.config.eshopType === AmericanasConfig.eshopType()) {
      return AmericanasProcessor.extractElemPrice(productPrice);
    }
    if (this.config.eshopType === SubmarinoConfig.eshopType()) {
      return SubmarinoProcessor.extractElemPrice(productPrice);
    }
    if (
      this.config.eshopType === AmazonConfig.eshopType()
      && 'productPriceFractionSelector' in this.config
    ) {
      const productPriceFraction = cheerio(productCheerio)
        .find(this.config.productPriceFractionSelector)[0];
      return AmazonProcessor.extractElemPrice(productPrice, productPriceFraction);
    }

    logger.warn('getProductPrice() fail');
    return undefined;
  }

  getProductName(productCheerio: CheerioElement) {
    const productName = cheerio(productCheerio)
      .find((this.config.productNameSelector))[0];

    if (this.config.eshopType === AmericanasConfig.eshopType()) {
      return AmericanasProcessor.extractElemProductName(productName);
    }
    if (this.config.eshopType === SubmarinoConfig.eshopType()) {
      return SubmarinoProcessor.extractElemProductName(productName);
    }
    if (this.config.eshopType === AmazonConfig.eshopType()) {
      return AmazonProcessor.extractElemProductName(productName);
    }

    logger.warn('getProductName() fail');
    return undefined;
  }

  getProductDetailLink(productCheerio: CheerioElement) {
    const productDetailLink = cheerio(productCheerio)
      .find((this.config.productLinkSelector))[0];
    let linkStr: string;

    if (this.config.eshopType === AmericanasConfig.eshopType()) {
      linkStr = AmericanasProcessor.extractElemLinkDetail(productDetailLink);
    }
    if (this.config.eshopType === SubmarinoConfig.eshopType()) {
      return SubmarinoProcessor.extractElemLinkDetail(productDetailLink);
    }
    if (this.config.eshopType === AmazonConfig.eshopType()) {
      linkStr = AmazonProcessor.extractElemLinkDetail(productDetailLink);
    }


    if (HtmlProcessorUtils.isValidLink(linkStr, this.config.validLinkPatterns)) {
      return HtmlProcessorUtils
        .normalizeProductDetailLink(linkStr, this.config.normalizeLinkKeywords);
    }
    logger.warn('getProductDetailLink() fail');
    return undefined;
  }
}
