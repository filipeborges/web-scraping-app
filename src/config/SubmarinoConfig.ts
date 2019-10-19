import config from './config.json';
import validateConfig from '../util/configUtils';

const configCopy = { ...config };

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

export default class SubmarinoConfig {
  static getConfig(keywords) {
    if (!keywords || !keywords.length) {
      throw new Error('SubmarinoConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator } = configCopy.submarino;

    configCopy.submarino.urls = pagesToFetch.map((pageNumber, index) => (
      buildUrl(searchString, searchStringKeywordSeparator,
        keywords, ITEMS_PER_PAGE, ITEMS_PER_PAGE * index)
    ));

    validateConfig(configCopy.submarino);
    return configCopy.submarino;
  }

  static eshopType() {
    return config.submarino.eshopType;
  }
}
