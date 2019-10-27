// TODO: Improve location of below statement
process.env.PATH = `${process.env.PATH}:${process.env.BROWSER_DRIVER_PATH}`;

import controller from './controller';

export { controller };
