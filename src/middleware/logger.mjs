import winston from 'winston';
class LOG {
	constructor(data) {
		let { all, error, info, console, warn, debug } = data;
		const logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: { date: new Date().toISOString() },
		});
		logger.clear();
		if (all) logger.add(new winston.transports.File({ filename: all }));
		if (error) logger.add(new winston.transports.File({ filename: all, level: 'error' }));
		if (info) logger.add(new winston.transports.File({ filename: all, level: 'info' }));
		if (warn) logger.add(new winston.transports.File({ filename: all, level: 'warn' }));
		if (debug) logger.add(new winston.transports.File({ filename: all, level: 'debug' }));
		if (console) {
			logger.add(new winston.transports.Console({ format: winston.format.colorize({ all: true }), level: 'debug' }));
			global.console.log = (...args) => logger.info.call(logger, ...args);
			global.console.info = (...args) => logger.info.call(logger, ...args);
			global.console.warn = (...args) => logger.warn.call(logger, ...args);
			global.console.error = (...args) => logger.error.call(logger, ...args);
			global.console.debug = (...args) => logger.debug.call(logger, ...args);
		}
		return logger;
	}
};
export default LOG;