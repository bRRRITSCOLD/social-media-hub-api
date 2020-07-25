import winston = require('winston');

const options = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warning: 'magenta',
    info: 'green',
    debug: 'yellow',
  },
};

winston.addColors(options.colors);

const winstonLogger = winston.createLogger({
  levels: options.levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) => {
          const {
            timestamp, level, message, ...args
          } = info;
          const ts = timestamp.slice(0, 19).replace('T', ' ');
          return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 1) : ''}`;
        }),
      ),
    }),
  ],
});

const logger = {
  error(message: any) {
    winstonLogger.log('error', message);
  },
  warn(message: any) {
    winstonLogger.log('warn', message);
  },
  info(message: any) {
    winstonLogger.log('info', message);
  },
  debug(message: any) {
    winstonLogger.log('debug', message, (err: any, level: any) => {
      console.log(err);
      console.log(level);
    });
  },
};

export {
  logger,
};
