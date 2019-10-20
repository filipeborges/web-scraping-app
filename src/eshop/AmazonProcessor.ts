import logger from '../log/logger';

const extractPriceFraction = (elemPriceFraction: CheerioElement) => {
  const containsPriceFraction = elemPriceFraction
    && elemPriceFraction.children
    && elemPriceFraction.children[0]
    && elemPriceFraction.children[0].data;

  return containsPriceFraction
    ? `,${elemPriceFraction.children[0].data}` : '';
};

export default class AmazonProcessor {
  static extractElemPrice(elemPrice: CheerioElement, elemPriceFraction: CheerioElement) {
    try {
      return `${elemPrice.children[0].data}${extractPriceFraction(elemPriceFraction)}`;
    } catch (err) {
      logger.warn('extractElemPrice() fail');
      return undefined;
    }
  }

  static extractElemProductName(elem: CheerioElement) {
    try {
      return elem.children[0].data;
    } catch (err) {
      logger.warn('extractElemProductName() fail');
      return undefined;
    }
  }

  static extractElemLinkDetail(elem: CheerioElement) {
    try {
      return `www.amazon.com.br${elem.attribs.href}`;
    } catch (err) {
      logger.warn('extractElemLinkDetail() fail');
      return undefined;
    }
  }
}
