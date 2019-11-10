import { normalizeNumberString } from './util/NumberUtils';

class ResultProcessor {

  buildIsDesiredProductPrice(desiredPrice: string) {
    const targetPrice = Number(normalizeNumberString(desiredPrice));
    return (productPrice: string) => productPrice
      && Number(normalizeNumberString(productPrice)) <= targetPrice;
  }

}

export default new ResultProcessor();