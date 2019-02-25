import config from './config';
import buildUrl from '../util/StringUtils';

const configCopy = { ...config };

export default class WallmartConfig {
  static getConfig(keywords, pageResultQuantity) {
    if (!keywords || !keywords.length || !pageResultQuantity) {
      throw new Error('WallmartConfig.getConfig: Missing parameter info');
    }

    const { searchString, searchStringKeywordSeparator } = configCopy.wallmart;

    const url = buildUrl(searchString, searchStringKeywordSeparator,
      keywords, pageResultQuantity);

    configCopy.wallmart.url = url;
    return configCopy.wallmart;
  }

  static eshopType() {
    return config.wallmart.eshopType;
  }
}
