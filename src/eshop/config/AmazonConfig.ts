import GenericConfig, { PagesToFetchMap } from "./GenericConfig";

class AmazonConfig extends GenericConfig {
  constructor() {
    super('amazon');
  }

  private buildUrl(
    searchString: string,
    separator: string,
    keywords: string[],
    page: number
  ) {
    const keywordParam = keywords.reduce((accumulator, keyword) => (
      `${accumulator}${separator}${keyword}`
    ));
    return searchString
      .replace('<keyword>', keywordParam)
      .replace('<page>', page + '');
  }

  pagesToFetchMapBuilder(
    keywords: string[],
    searchString: string,
    searchStringKeywordSeparator: string,
    eshopType: string
  ): PagesToFetchMap {
    return pageNumber => {
      const url = this.buildUrl(searchString, searchStringKeywordSeparator, keywords, pageNumber);
      return { url, eshop: eshopType }
    }
  }

}

export default new AmazonConfig();