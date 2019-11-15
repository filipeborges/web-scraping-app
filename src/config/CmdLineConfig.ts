import yargs from 'yargs';

function setupCmdLineOptions() {
  return yargs
    .usage('Usage: $0 --keywords <...keywords> --maxprice <maxprice> --regexFilter')
    .demandOption(['keywords', 'maxprice'])
    .array('keywords')
    .describe('keywords', 'keywords to search')
    .string('maxprice')
    .describe('maxprice', 'max price to search')
    .boolean('regexFilter')
    .describe('regexFilter', 'filter result with a regex composed of keywords param')
    .argv;
}

export default setupCmdLineOptions();

export type CmdLineParams = ReturnType<typeof setupCmdLineOptions>;
