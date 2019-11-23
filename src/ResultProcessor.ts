import argv from './config/CmdLineConfig';
import { normalizeNumberString } from './util/NumberUtils';
import { ResultCollection } from './HtmlProcessor';
import { sortResultCollection } from './util/ArrayUtil';
import logger from './log/logger';
import jsonfile from 'jsonfile';

class ResultProcessor {

  buildIsDesiredProductPrice(desiredPrice: string) {
    const targetPrice = Number(normalizeNumberString(desiredPrice));
    return (productPrice: string) => productPrice
      && Number(normalizeNumberString(productPrice)) <= targetPrice;
  }

  processResult(result: ResultCollection) {
    sortResultCollection(result);
    this.writeToFilePretty(result);
  }

  private writeToFilePretty(result: ResultCollection) {
    result.length && jsonfile.writeFile(
      argv.output || 'result.json',
      result,
      { spaces: '\t' },
      (err) => {
        if (err) {
          return logger.error(err);
        }
        logger.info('========== End of Search ==========');
      }
    );
  }

}

export default new ResultProcessor();