import cheerio from 'cheerio';
import HtmlProcessorUtils from './util/HtmlProcessorUtils';
import AmericanasConfig from './eshop/config/AmericanasConfig';
import AmericanasProcessor from './eshop/processor/AmericanasProcessor';
import SubmarinoConfig from './eshop/config/SubmarinoConfig';
import SubmarinoProcessor from './eshop/processor/SubmarinoProcessor';
import AmazonConfig from './eshop/config/AmazonConfig';
import AmazonProcessor from './eshop/processor/AmazonProcessor';
import KabumProcessor from './eshop/processor/KabumProcessor';
import logger from './log/logger';
import { EshopConfig } from './eshop/config/config.interface';
import { FetchData } from './webdriver-controller/controller'; // TODO: Review this interface import
import KabumConfig from './eshop/config/KabumConfig';
import { CmdLineParams } from './config/CmdLineConfig';
import HtmlProcessorUtil from './util/HtmlProcessorUtils';
import MagazineConfig from './eshop/config/MagazineConfig';
import MagazineProcessor from './eshop/processor/MagazineProcessor';

type ResultCollectionElement = {
  name: string;
  price: string;
  detailLink: string;
}

export type ResultCollection = ResultCollectionElement[];

export default class HtmlProcessor {

  private config: EshopConfig;
  private $: CheerioStatic;
  private productsCheerio: Cheerio;

  constructor(fetchData: FetchData, configList: EshopConfig[]) {
    this.config = configList.find(config => config.eshopType === fetchData.eshop);
    this.$ = cheerio.load(fetchData.pageSrc);
    this.productsCheerio = this.$(this.config.productSelector);
  }

  buildResultCollection(
    isDesiredProductPrice: (productPrice: string) => boolean,
    cmdLineParams: CmdLineParams
  ) {
    const result: ResultCollection = [];

    this.productsCheerio.each((i, elem) => {
      let productPrice = this.getProductPrice(elem);
      productPrice = isDesiredProductPrice(productPrice) ? productPrice : undefined;
      const productDetailLink = productPrice && this.getProductDetailLink(elem);
      const productName = productDetailLink && this.getProductName(elem);

      if (productName) {
        HtmlProcessorUtil.insertResultCollectionElement(
          result, productName, productPrice, productDetailLink, cmdLineParams
        );
      }
    });
    return result;
  }

  private getProductPrice(productCheerio: CheerioElement) {
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
    if (this.config.eshopType === KabumConfig.eshopType()) {
      return KabumProcessor.extractElemPrice(productPrice);
    }
    if (this.config.eshopType === MagazineConfig.eshopType()) {
      return MagazineProcessor.extractElemPrice(productPrice);
    }

    logger.warn('getProductPrice() fail');
    return undefined;
  }

  private getProductName(productCheerio: CheerioElement) {
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
    if (this.config.eshopType === KabumConfig.eshopType()) {
      return KabumProcessor.extractElemProductName(productName);
    }
    if (this.config.eshopType === MagazineConfig.eshopType()) {
      return MagazineProcessor.extractElemProductName(productName);
    }

    logger.warn('getProductName() fail');
    return undefined;
  }

  private getProductDetailLink(productCheerio: CheerioElement) {
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
    if (this.config.eshopType === KabumConfig.eshopType()) {
      return KabumProcessor.extractElemLinkDetail(productDetailLink);
    }
    if (this.config.eshopType === MagazineConfig.eshopType()) {
      return MagazineProcessor.extractElemLinkDetail(productDetailLink);
    }

    if (HtmlProcessorUtils.isValidLink(linkStr, this.config.validLinkPatterns)) {
      return HtmlProcessorUtils
        .normalizeProductDetailLink(linkStr, this.config.normalizeLinkKeywords);
    }
    logger.warn('getProductDetailLink() fail');
    return undefined;
  }
}
