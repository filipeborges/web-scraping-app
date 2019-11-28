import logger from '../../log/logger';
import { removeWhitespaceNewLine } from '../../util/StringUtil';

export default class MagazineProcessor {
  static extractElemPrice(elem: CheerioElement) {
    try {
      let p1 = elem && elem.children[0] && elem.children[0].data;
      let p2 = elem && elem.children[1] && elem.children[1].children[0] && elem.children[1].children[0].data;

      p1 = removeWhitespaceNewLine(p1);
      p2 = removeWhitespaceNewLine(p2);

      return p1 || p2;
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
