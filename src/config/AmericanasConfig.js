import config from './config';
import validateConfig from '../util/configUtils';

const configCopy = { ...config };

const buildUrl = (searchString, separator, keywords, itemsPerPage, offset) => {
  const keywordParam = keywords.reduce((accumulator, keyword) => (
    `${accumulator}${separator}${keyword}`
  ));
  return searchString
    .replace('<keyword>', keywordParam)
    .replace('<itemsPerPage>', itemsPerPage)
    .replace('<offset>', offset);
};

const ITEMS_PER_PAGE = 24;
const pagesToFetch = [1, 2, 3, 4, 5];

export default class AmericanasConfig {
  static getConfig(keywords) {
    if (!keywords || !keywords.length) {
      throw new Error('AmericanasConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator } = configCopy.americanas;

    configCopy.americanas.urls = pagesToFetch.map((pageNumber, index) => (
      buildUrl(searchString, searchStringKeywordSeparator,
        keywords, ITEMS_PER_PAGE, ITEMS_PER_PAGE * index)
    ));

    validateConfig(configCopy.americanas);
    return configCopy.americanas;
  }

  static eshopType() {
    return config.americanas.eshopType;
  }
}
