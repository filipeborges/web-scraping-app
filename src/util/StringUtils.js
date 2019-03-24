const buildUrl = (searchString, separator, keywords, quantity, pageNumber) => {
  const keywordParam = keywords.reduce((accumulator, keyword) => (
    `${accumulator}${separator}${keyword}`
  ));
  return searchString
    .replace('<keyword>', keywordParam)
    .replace('<quantity>', quantity)
    .replace('<pageNumber>', pageNumber);
};

export default buildUrl;
