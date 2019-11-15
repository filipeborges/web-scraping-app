import { CmdLineParams } from "../config/CmdLineConfig";
import { ResultCollection } from "../HtmlProcessor";

const normalizeLink = (link: string, keywordsToExclude: string[]) => {
  let normalizedLink = link;
  let regex;
  keywordsToExclude.forEach((keyword) => {
    regex = new RegExp(keyword, 'g');
    normalizedLink = normalizedLink.replace(regex, '');
  });

  return normalizedLink;
};

const buildLinkValidPatternsRegex = (validLinkPatterns: string[]) => (
  validLinkPatterns.map(validPattern => (
    new RegExp(validPattern)
  ))
);

export default class HtmlProcessorUtil {
  static normalizeProductDetailLinks(links: string[], keywordsToExclude: string[]) {
    return links.map(link => this.normalizeProductDetailLink(link, keywordsToExclude));
  }

  static normalizeProductDetailLink(link: string, keywordsToExclude: string[]) {
    if (!link || !keywordsToExclude) {
      return undefined;
    }
    return normalizeLink(link, keywordsToExclude);
  }

  static isValidLink(link: string, validLinkPatterns: string[]) {
    if (!link || !validLinkPatterns) {
      throw new Error('HtmlProcessorUtil.isValidLink: Missing parameter info');
    }

    const validLinkPatternsRegex = buildLinkValidPatternsRegex(validLinkPatterns);
    return validLinkPatternsRegex.every(validLinkPattern => (
      link.match(validLinkPattern)
    ));
  }

  static insertResultCollectionElement(
    result: ResultCollection,
    name: string,
    price: string,
    detailLink: string,
    cmdLineParams: CmdLineParams
  ) {
    if (cmdLineParams.regexFilter) {
      const productNameContainsAllKeywords = cmdLineParams.keywords.every(
        (keyword: string) => (
          name.match(new RegExp(`\\s${keyword}\\s`, 'i'))
          || name.match(new RegExp(`^${keyword}\\s`, 'i'))
          || name.match(new RegExp(`\\s${keyword}$`, 'i'))
        )
      );
      productNameContainsAllKeywords && result.push({
        name,
        price,
        detailLink
      });
    } else {
      result.push({
        name,
        price,
        detailLink
      });
    }
  }
}
