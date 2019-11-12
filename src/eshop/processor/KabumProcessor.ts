import logger from '../../log/logger';

export default class KabumProcessor {
  static extractElemPrice(elem: CheerioElement) {
    try {
      return elem.children[0].data;
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
      return elem.attribs.href;
    } catch (err) {
      logger.warn('extractElemLinkDetail() fail');
      return undefined;
    }
  }
}
