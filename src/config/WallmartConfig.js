import config from './config';

const configCopy = { ...config };

export default class WallmartConfig {
  static setUrl(keyword, pageResultQuantity) {
    const url = configCopy.wallmart.searchString
      .replace('<keyword>', keyword)
      .replace('<quantity>', pageResultQuantity);

    configCopy.wallmart.url = url;
  }

  static getConfig() {
    return configCopy.wallmart;
  }

  static eshopType() {
    return 'wallmart';
  }
}
