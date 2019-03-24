const isValidConfig = config => (
  config
  && config.urls
  && config.productSelector
  && config.productLinkSelector
  && config.productPriceSelector
  && config.productNameSelector
  && config.validLinkPatterns
  && config.eshopType
);

const validateConfig = (config) => {
  if (!isValidConfig(config)) {
    console.log('============= E-SHOP CONFIG ===================');
    console.log(config);
    throw new Error('E-Shop invalid config');
  }
};

export default validateConfig;
