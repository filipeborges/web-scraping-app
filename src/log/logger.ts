import winston from 'winston';

function buildProductionLogConfig() {
  return {
    transports: [
      new winston.transports.File({
        name: 'error-file',
        filename: 'error.log',
        level: 'error',
      }),
      new winston.transports.File({
        name: 'warn-file',
        filename: 'warn.log',
        level: 'warn',
      }),
      new winston.transports.File({
        name: 'info-file',
        filename: 'info.log',
        level: 'info',
      }),
    ],
  };
}

function buildDevelopmentLogConfig() {
  return {
    transports: [
      new winston.transports.Console(),
    ],
  };
}

const logConfig = process.env.NODE_ENV === 'production'
  ? buildProductionLogConfig() : buildDevelopmentLogConfig();

const logger = new winston.Logger(logConfig);

export default {
  info: data => logger.log('info', '%j', data),
  warn: data => logger.warn(data),
  error: error => logger.error(error),
};
