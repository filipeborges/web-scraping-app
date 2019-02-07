const normalizeLink = (link, keywordsToExclude) => {
  let normalizedLink = link;
  let regex;
  keywordsToExclude.forEach((keyword) => {
    regex = new RegExp(keyword, 'g');
    normalizedLink = normalizedLink.replace(regex, '');
  });

  return normalizedLink;
};

export default class HtmlProcessorUtil {
  static normalizeLinks(links, keywordsToExclude) {
    if (!links || !keywordsToExclude) {
      throw new Error('HtmlProcessorUtil.normalizeLinks: Missing parameter info');
    }

    const normalizedLinks = [];

    links.forEach((link) => {
      if (link) {
        normalizedLinks.push(normalizeLink(link, keywordsToExclude));
      }
    });

    return normalizedLinks;
  }
}
