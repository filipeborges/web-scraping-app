import { normalizeNumberString } from './util/NumberUtils';

export default class ResultProcessor {
  constructor(targetPrice) {
    this.targetPrice = Number(normalizeNumberString(targetPrice));
  }

  isDesiredProductPrice(productPrice) {
    return productPrice
      && Number(normalizeNumberString(productPrice)) <= this.targetPrice;
  }
}
