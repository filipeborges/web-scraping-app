import config from './config';
import validateConfig from '../util/configUtils';

const configCopy = { ...config };

const buildUrl = (searchString, separator, keywords, page) => {
  const keywordParam = keywords.reduce((accumulator, keyword) => (
    `${accumulator}${separator}${keyword}`
  ));
  return searchString
    .replace('<keyword>', keywordParam)
    .replace('<page>', page);
};

const pagesToFetch = [1, 2, 3, 4, 5];

export default class AmazonConfig {
  static getConfig(keywords) {
    if (!keywords || !keywords.length) {
      throw new Error('AmazonConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator } = configCopy.amazon;

    configCopy.amazon.urls = pagesToFetch.map(pageNumber => (
      buildUrl(searchString, searchStringKeywordSeparator, keywords, pageNumber)
    ));

    validateConfig(configCopy.amazon);
    return configCopy.amazon;
  }

  static eshopType() {
    return config.amazon.eshopType;
  }
}
