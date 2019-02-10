export default class WallmartProcessor {
  static extractElemPrice(elem) {
    if (elem) {
      let price = '';
      elem.children.forEach((child) => {
        price += child.children[0].data;
      });
      return price;
    }
    return undefined;
  }

  static extractElemProductName(elem) {
    if (elem) {
      return elem.children[0].data;
    }
    return undefined;
  }

  static extractElemLinkDetail(elem) {
    if (elem && elem.attribs && elem.attribs.href) {
      return elem.attribs.href;
    }
    return undefined;
  }
}
