const buildUrl = (searchString, separator, keywords, quantity) => {
  const keywordParam = keywords.reduce((accumulator, keyword) => (
    `${accumulator}${separator}${keyword}`
  ));
  return searchString
    .replace('<keyword>', keywordParam)
    .replace('<quantity>', quantity);
};

export default buildUrl;
