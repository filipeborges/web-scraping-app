import { ResultCollection } from "../HtmlProcessor";
import { normalizeNumberString } from "./NumberUtils";

export function sortResultCollection(result: ResultCollection) {
  result && result.sort((a, b) => {
    const aNum = Number(normalizeNumberString(a.price));
    const bNum = Number(normalizeNumberString(b.price));
    if (aNum < bNum) {
      return -1;
    }
    if (aNum > bNum) {
      return 1;
    }
    return 0;
  });
}