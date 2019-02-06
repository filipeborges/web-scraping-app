import config from './config';

export default class WallmartConfig {
  static url(keyword, pageResultQuantity) {
    return config.wallmart.searchString
      .replace('<keyword>', keyword)
      .replace('<quantity>', pageResultQuantity);
  }
}
