import { EshopConfig } from "../config/config.interface";

const isValidConfig = (config: EshopConfig): boolean => (
  (config
    && config.urls
    && config.productSelector
    && config.productLinkSelector
    && config.productPriceSelector
    && config.productNameSelector
    && config.validLinkPatterns
    && config.eshopType
  ) as any as boolean
);

const validateConfig = (config: EshopConfig) => {
  if (!isValidConfig(config)) {
    throw new Error('E-Shop invalid config');
  }
};

export default validateConfig;
