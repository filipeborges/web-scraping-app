export default class AmericanasProcessor {
  static extractElemPrice(elem) {
    try {
      return elem.children[2].data;
    } catch (err) {
      console.log('extractElemPrice() fail');
      return undefined;
    }
  }

  static extractElemProductName(elem) {
    try {
      return elem.children[0].data;
    } catch (err) {
      console.log('extractElemProductName() fail');
      return undefined;
    }
  }

  static extractElemLinkDetail(elem) {
    try {
      return `www.americanas.com.br${elem.attribs.href}`;
    } catch (err) {
      console.log('extractElemLinkDetail() fail');
      return undefined;
    }
  }
}
