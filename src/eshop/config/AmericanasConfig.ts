import GenericConfig, { PagesToFetchMap } from './GenericConfig';

const ITEMS_PER_PAGE = 24;

class AmericanasConfig extends GenericConfig {
  constructor() {
    super('americanas');
  }

  private buildUrl(
    searchString: string,
    separator: string,
    keywords: string[],
    itemsPerPage: number,
    offset: number
  ) {
    const keywordParam = keywords.reduce((accumulator, keyword) => (
      `${accumulator}${separator}${keyword}`
    ));
    return searchString
      .replace('<keyword>', keywordParam)
      .replace('<itemsPerPage>', itemsPerPage + '')
      .replace('<offset>', offset + '');
  }

  pagesToFetchMapBuilder(
    keywords: string[],
    searchString: string,
    searchStringKeywordSeparator: string,
    eshopType: string
  ): PagesToFetchMap {
    return (pageNumber, index) => {
      const url = this.buildUrl(searchString, searchStringKeywordSeparator,
        keywords, ITEMS_PER_PAGE, ITEMS_PER_PAGE * index);
      return { url, eshop: eshopType }
    }
  }
}

export default new AmericanasConfig();