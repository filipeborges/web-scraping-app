import yargs from 'yargs';

function setupCmdLineOptions() {
  return yargs
    .usage('Usage: $0 --keywords <...keywords> --maxprice <maxprice>')
    .demandOption(['keywords', 'maxprice'])
    .array('keywords')
    .describe('keywords', 'keywords to search')
    .string('maxprice')
    .describe('maxprice', 'max price to search')
    .argv;
}

export default setupCmdLineOptions();
