import cheerio from 'cheerio';
import HtmlProcessorUtils from './util/HtmlProcessorUtils';
// import Logger from './log/Logger';

// const isValidSearchString = searchString => (
//   searchString && !searchString.match('<|>')
// );

const isValidConfig = config => (
  config
  && config.productSelector
  && config.productLinkSelector
  && config.priceSelector
);

const extractUrlFromHref = anchorElem => anchorElem.attribs.href;

const extractUrl = (elem) => {
  if (elem && elem.attribs && elem.attribs.href) {
    return extractUrlFromHref(elem);
  }
  return undefined;
};

// TODO: Improve
const extractPrice = (elem) => {
  if (elem) {
    let price = '';
    elem.children.forEach((child) => {
      price += child.children[0].data;
    });
    return price;
  }
  return undefined;
};

export default class HtmlProcessor {
  constructor(html, config) {
    if (!isValidConfig(config)) {
      throw new Error('HtmlProcessor.constructor: Missing config info');
    }

    this.config = config;
    this.$ = cheerio.load(html);
    this.cheerioFiltered = this.$(this.config.productSelector);
  }

  numberOfProductMatches() {
    return this.$(this.config.productSelector).length;
  }

  getProductPrices() {
    const prices = [];
    const productPrices = this.cheerioFiltered.find(this.config.priceSelector);
    productPrices.each((i, elem) => {
      prices.push(extractPrice(elem));
    });
    console.log(prices);
    console.log(prices.length);
  }

  getProductDetailLinks() {
    const urls = [];

    this.cheerioFiltered
      .find(this.config.productLinkSelector)
      .each((i, elem) => {
        const linkStr = extractUrl(elem);
        const linkAlreadyExists = urls.some(url => url === linkStr);
        if (!linkAlreadyExists) {
          urls.push(linkStr);
        }
      });
    return HtmlProcessorUtils.normalizeLinks(urls, this.config.normalizeKeywords);
  }
}

// const TEXT_NODE = 'text';
// const DIV_ELEM_NAME = 'div';

// const findAllElementsWithKeyword = (elementContents, keyword) => {
//   const elementsWithKeyword = [];

//   if (elementContents && keyword) {
//     const lowerCaseKeyword = keyword.toLowerCase();
//     let nodeText;
//     elementContents.each((index, element) => {
//       if (element.type === TEXT_NODE) {
//         nodeText = element.data.trim().toLowerCase();
//         if (nodeText.indexOf(lowerCaseKeyword) !== -1) {
//           elementsWithKeyword.push(element);
//         }
//       }
//     });
//   }

//   return elementsWithKeyword;
// };

// const getTextFromElementContents = (elementContents) => {
//   const texts = [];

//   if (elementContents) {
//     let text;
//     elementContents.each((index, element) => {
//       if (element.type === TEXT_NODE) {
//         text = element.data.trim();
//         if (text.length > 0) {
//           texts.push(text);
//         }
//       }
//     });
//   }
//   return texts;
// };

// const getHtmlExcludedTags = () => {
//   const excludedTags = process.env.HTML_PARSER_EXCLUDED_TAGS;
//   return excludedTags ? excludedTags.split(',').map(tag => tag.trim()) : [];
// };

// const getTextContentToExclude = () => {
//   const excludedContent = process.env.TEXT_CONTENT_EXCLUDE;
//   return excludedContent ? excludedContent.split(',') : [];
// };

// const isElementTagAllowed = elementName => (
//   getHtmlExcludedTags().every(excludedTag => excludedTag !== elementName)
// );

// // TODO Refatorar para usar o metodo 'closest()' do cheerio
// const findClosestDivAncestor = (element) => {
//   const ancestorMaxLvl = process.env.CLOSEST_DIV_ANCESTOR_MAX_LEVEL;

//   for (
//     let i = 1, { parent } = element; i <= ancestorMaxLvl && parent; i += 1, { parent } = parent
//   ) {
//     if (parent.name === DIV_ELEM_NAME) {
//       return parent;
//     }
//   }
//   return undefined;
// };

// const filterExcludedTextContent = selectedTextNodes => (
//   !selectedTextNodes ? [] : selectedTextNodes.filter(elem => (
//     elem.data && getTextContentToExclude()
//       .every(contentToExclude => elem.data.indexOf(contentToExclude) === -1)
//   ))
// );

// const searchForRelatedElements = (divAncestors, keyword) => {
//   if (!divAncestors || !keyword) {
//     return undefined;
//   }

//   const findedElements = [];
//   let contents = divAncestors.contents();

//   do {
//     findAllElementsWithKeyword(contents, keyword)
//       .forEach(element => findedElements.push(element));
//     contents = contents.contents();
//   } while (contents.length > 0);

//   return findedElements;
// };


// process(topLevelKeyword) {
//   let elementsTopLevelKey = this.getAllElementsWithKeyword(topLevelKeyword);
//   elementsTopLevelKey = filterExcludedTextContent(elementsTopLevelKey);

//   // console.log(elementsTopLevelKey);

//   let divAncestor = elementsTopLevelKey.map(element => findClosestDivAncestor(element));
//   divAncestor = divAncestor.filter(elem => elem);

//   const findedElems = [];
//   const $ = this.getCheerio();
//   divAncestor.forEach((e) => {
//     findedElems.push(searchForRelatedElements($(e), 'R$'));
//   });
//   // TODO Testar
//   findedElems.forEach(e => console.log(e));
// }

// getAllElementsWithKeyword(keyword) {
//   let contents = this.getHtmlContent();
//   const elements = [];

//   do {
//     findAllElementsWithKeyword(contents, keyword)
//       .forEach(element => elements.push(element));
//     contents = contents.contents();
//   } while (contents.length > 0);

//   return elements;
// }

// getHtmlContent() {
//   const pageContent = this.$('html').contents();
//   return pageContent.filter((index, element) => isElementTagAllowed(element.name));
// }

// extractAllTextContent() {
//   let contents = this.getHtmlContent();
//   let textContent = [];

//   do {
//     textContent = Array.prototype.concat(textContent, getTextFromElementContents(contents));
//     contents = contents.contents();
//   } while (contents.length > 0);

//   return textContent;
// }

// getCheerio() {
//   return this.$;
// }
