const { format, createLogger, transports } = require("winston");
const { combine, timestamp, prettyPrint } = format;
require("winston-daily-rotate-file");
// const DailyRotateFile = require('winston-daily-rotate-file');

const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/logger-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
});

const logger = createLogger({
	level: 'info',
	format: combine(
        timestamp({
          format: "MMM-DD-YYYY HH:mm:ss",
        }),
        prettyPrint()
    ),
	// defaultMeta: { service: 'user-service' },
	transports: [
        fileRotateTransport,
	    // new transports.File({ filename: `logs/error.log`, level: 'error' }),
	    // new transports.File({ filename: `logs/info.log`, level: 'info' }),
	    // new transports.File({ filename: `logs/warning.log`, level: 'warning' }),
	],
	exceptionHandlers: [
        new transports.File({ filename: `logs/exceptions.log` }),
	],
	rejectionHandlers: [
		new transports.File({ filename: `logs/rejections.log` }),
	],
});

module.exports = logger;