import { normalizeNumberString } from './util/NumberUtils';

const isValidParameters = (productNames, productPrices, productDetailLinks) => (
  productNames && productPrices && productDetailLinks
);

const isInfoSameLength = (productNames, productPrices, prodDetailLinks) => (
  productNames.length
    && (
      (productNames.length === productPrices.length)
      && (productNames.length === prodDetailLinks.length)
    )
);

const extractPricesIndexes = (targetPrice, productPrices) => {
  const priceIndexes = [];
  const numberTargetPrice = Number(normalizeNumberString(targetPrice));

  productPrices.forEach((price, index) => {
    if (Number(normalizeNumberString(price)) <= numberTargetPrice) {
      priceIndexes.push(index);
    }
  });
  return priceIndexes;
};

const buildResult = (prodNames, prodPrices, prodDetailLinks, matchedIndexes) => (
  matchedIndexes.map(matchedIndex => (
    {
      name: prodNames[matchedIndex],
      price: prodPrices[matchedIndex],
      detailLink: prodDetailLinks[matchedIndex],
    }
  ))
);

export default class ResultProcessor {
  constructor(productNames, productPrices, productDetailLinks) {
    if (!isValidParameters(productNames, productPrices, productDetailLinks)) {
      throw new Error('ResultProcessor.constructor: Missing parameter info');
    }
    if (!isInfoSameLength(productNames, productPrices, productDetailLinks)) {
      throw new Error('ResultProcessor.constructor: Info with invalid length');
    }
    this.prodNames = productNames;
    this.prodPrices = productPrices;
    this.prodDetailLinks = productDetailLinks;
  }

  findResultsByPrice(targetPrice) {
    const matchedIndexes = extractPricesIndexes(targetPrice, this.prodPrices);
    return buildResult(this.prodNames, this.prodPrices,
      this.prodDetailLinks, matchedIndexes);
  }
}
