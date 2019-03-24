import config from './config';
import buildUrl from '../util/StringUtils';
import validateConfig from '../util/configUtils';

const configCopy = { ...config };

const MAX_SEARCH_QUANTITY = 40;
const pagesToFetch = [1, 2, 3, 4, 5];

export default class WallmartConfig {
  static getConfig(keywords) {
    if (!keywords || !keywords.length) {
      throw new Error('WallmartConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator } = configCopy.wallmart;

    configCopy.wallmart.urls = pagesToFetch.map(pageNumber => (
      buildUrl(searchString, searchStringKeywordSeparator,
        keywords, MAX_SEARCH_QUANTITY, pageNumber)));

    validateConfig(configCopy.wallmart);
    return configCopy.wallmart;
  }

  static eshopType() {
    return config.wallmart.eshopType;
  }
}
