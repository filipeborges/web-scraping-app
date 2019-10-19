import config from './config.json';

export type Config = typeof config;

export type EshopConfig = typeof config.amazon | typeof config.americanas;
