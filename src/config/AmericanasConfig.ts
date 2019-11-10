import config from './config.json';
import validateConfig from '../util/configUtils';
import { Config } from './config.interface.js';

const configCopy: Config = { ...config };

const buildUrl = (searchString: string, separator: string, keywords: string[], itemsPerPage: number, offset: number) => {
  const keywordParam = keywords.reduce((accumulator, keyword) => (
    `${accumulator}${separator}${keyword}`
  ));
  return searchString
    .replace('<keyword>', keywordParam)
    .replace('<itemsPerPage>', itemsPerPage + '')
    .replace('<offset>', offset + '');
};

const ITEMS_PER_PAGE = 24;
const pagesToFetch = [1, 2, 3, 4, 5];

export default class AmericanasConfig {
  static getConfig(keywords) {
    if (!keywords || !keywords.length) {
      throw new Error('AmericanasConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator, eshopType } = configCopy.americanas;

    configCopy.americanas.data = pagesToFetch.map((pageNumber, index) => {
      const url = buildUrl(searchString, searchStringKeywordSeparator,
        keywords, ITEMS_PER_PAGE, ITEMS_PER_PAGE * index);
      return { url, eshop: eshopType }
    });

    validateConfig(configCopy.americanas);
    return configCopy.americanas;
  }

  static eshopType() {
    return config.americanas.eshopType;
  }
}
