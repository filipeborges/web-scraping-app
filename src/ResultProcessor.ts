import { normalizeNumberString } from './util/NumberUtils';

export default class ResultProcessor {

  private targetPrice: number;

  constructor(targetPrice: string) {
    this.targetPrice = Number(normalizeNumberString(targetPrice));
  }

  isDesiredProductPrice(productPrice: string) {
    return productPrice
      && Number(normalizeNumberString(productPrice)) <= this.targetPrice;
  }
}
