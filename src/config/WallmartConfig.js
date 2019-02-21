import config from './config';

const configCopy = { ...config };

export default class WallmartConfig {
  static getConfig(keyword, pageResultQuantity) {
    if (!keyword || !pageResultQuantity) {
      throw new Error('WallmartConfig.getConfig: Missing parameter info');
    }
    const url = configCopy.wallmart.searchString
      .replace('<keyword>', keyword)
      .replace('<quantity>', pageResultQuantity);

    configCopy.wallmart.url = url;
    return configCopy.wallmart;
  }

  static eshopType() {
    return config.wallmart.eshopType;
  }
}
