import logger from '../../log/logger';

export default class AmericanasProcessor {
  static extractElemPrice(elem: CheerioElement) {
    try {
      return elem.children[2].data;
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
      return `www.americanas.com.br${elem.attribs.href}`;
    } catch (err) {
      logger.warn('extractElemLinkDetail() fail');
      return undefined;
    }
  }
}
