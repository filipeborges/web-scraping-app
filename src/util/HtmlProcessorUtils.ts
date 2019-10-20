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
    // TODO: Use normalizeProductDetailLink() method
    if (!links || !keywordsToExclude) {
      throw new Error('HtmlProcessorUtil.normalizeLinks: Missing parameter info');
    }

    const normalizedLinks: string[] = [];

    links.forEach((link) => {
      if (link) {
        normalizedLinks.push(normalizeLink(link, keywordsToExclude));
      }
    });

    return normalizedLinks;
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
}
