import config from './config.json';
import validateConfig from '../../util/configUtils';
import { Config } from './config.interface.js';

const configCopy: Config = { ...config };

const buildUrl = (searchString: string, separator: string, keywords: string[], page: number) => {
  const keywordParam = keywords.reduce((accumulator, keyword) => (
    `${accumulator}${separator}${keyword}`
  ));
  return searchString
    .replace('<keyword>', keywordParam)
    .replace('<page>', page + '');
};

const pagesToFetch = [1, 2, 3, 4, 5];

export default class AmazonConfig {
  static getConfig(keywords: string[]) {
    if (!keywords || !keywords.length) {
      throw new Error('AmazonConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator, eshopType } = configCopy.amazon;

    configCopy.amazon.data = pagesToFetch.map(pageNumber => {
      const url = buildUrl(searchString, searchStringKeywordSeparator, keywords, pageNumber);
      return { url, eshop: eshopType }
    });

    validateConfig(configCopy.amazon);
    return configCopy.amazon;
  }

  static eshopType() {
    return config.amazon.eshopType;
  }
}
