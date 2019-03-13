import config from './config';
import buildUrl from '../util/StringUtils';
import validateConfig from '../util/configUtils';

const configCopy = { ...config };

const MAX_SEARCH_QUANTITY = 100;

export default class WallmartConfig {
  static getConfig(keywords) {
    if (!keywords || !keywords.length) {
      throw new Error('WallmartConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator } = configCopy.wallmart;

    const url = buildUrl(searchString, searchStringKeywordSeparator,
      keywords, MAX_SEARCH_QUANTITY);

    configCopy.wallmart.url = url;
    validateConfig(configCopy.wallmart);
    return configCopy.wallmart;
  }

  static eshopType() {
    return config.wallmart.eshopType;
  }
}
