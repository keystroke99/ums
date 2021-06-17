var appRoot = require('app-root-path');
var winston = require('winston');
var winstonDailyRotateFile = require('winston-daily-rotate-file');

var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/ums-api-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

var logger = new winston.createLogger({
  format: logFormat,
  transports: [
    new winstonDailyRotateFile(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
