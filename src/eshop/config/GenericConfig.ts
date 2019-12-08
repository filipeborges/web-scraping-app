import { EshopConfig } from "./config.interface";
import config from '../config/config.json'
import validateConfig from '../../util/configUtils';

export interface PagesToFetchMap {
  (pageNumber: number, index: number): {
    url: string;
    eshop: string;
  };
}

export default abstract class GenericConfig {
  private config: EshopConfig;
  private configKey: string;

  private static pagesToFetch = [1, 2, 3, 4, 5];

  constructor(configKey: string) {
    this.configKey = configKey;
    this.config = { ...config[configKey] };
  }

  abstract pagesToFetchMapBuilder(
    keywords: string[],
    searchString: string,
    searchStringKeywordSeparator: string,
    eshopType: string
  ): PagesToFetchMap;

  getConfig(keywords: string[]) {
    if (!keywords || !keywords.length) {
      throw new Error(`${this.configKey} - GenericConfig.getConfig: Missing parameter info`);
    }

    const { searchString, searchStringKeywordSeparator, eshopType } = this.config;
    const pagesToFetchMap = this.pagesToFetchMapBuilder(
      keywords, searchString, searchStringKeywordSeparator, eshopType
    );
    this.config.data = GenericConfig.pagesToFetch.map(pagesToFetchMap);

    validateConfig(this.config);
    return this.config;
  }

  eshopType() {
    return this.config.eshopType;
  }
}