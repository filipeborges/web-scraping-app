import config from './config.json';
import validateConfig from '../../util/configUtils';
import { Config, EshopConfig } from './config.interface';

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

export default class MagazineConfig {
  static getConfig(keywords): EshopConfig {
    if (!keywords || !keywords.length) {
      throw new Error('MagazineConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator, eshopType } = configCopy.magazine;

    configCopy.magazine.data = pagesToFetch.map(pageNumber => {
      const url = buildUrl(searchString, searchStringKeywordSeparator,
        keywords, pageNumber);
      return { url, eshop: eshopType }
    });

    validateConfig(configCopy.magazine);
    return configCopy.magazine;
  }

  static eshopType() {
    return config.magazine.eshopType;
  }
}
