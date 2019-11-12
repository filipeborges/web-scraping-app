import { EshopConfig } from "./config/config.interface";
import SubmarinoConfig from "./config/SubmarinoConfig";
import AmericanasConfig from "./config/AmericanasConfig";
import AmazonConfig from "./config/AmazonConfig";
import KabumConfig from "./config/KabumConfig";

export function buildEshopData(keywords: string[]) {

  const configList: EshopConfig[] = [];
  configList.push(SubmarinoConfig.getConfig(keywords));
  configList.push(AmericanasConfig.getConfig(keywords));
  configList.push(AmazonConfig.getConfig(keywords));
  configList.push(KabumConfig.getConfig(keywords));

  const dataList = [];

  configList.forEach(
    config => dataList.push(...config.data)
  );

  return {
    configList,
    dataList
  };
}