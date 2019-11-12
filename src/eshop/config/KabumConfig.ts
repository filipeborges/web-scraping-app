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

export default class KabumConfig {
  static getConfig(keywords): EshopConfig {
    if (!keywords || !keywords.length) {
      throw new Error('KabumConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator, eshopType } = configCopy.kabum;

    configCopy.kabum.data = pagesToFetch.map(pageNumber => {
      const url = buildUrl(
        searchString, searchStringKeywordSeparator, keywords, pageNumber
      );
      return { url, eshop: eshopType }
    });

    validateConfig(configCopy.kabum);
    return configCopy.kabum;
  }

  static eshopType() {
    return config.kabum.eshopType;
  }
}
