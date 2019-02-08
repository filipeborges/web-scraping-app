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
}
