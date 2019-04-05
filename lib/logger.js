const winston = require('winston');
const morgan = require('morgan');
const { Router } = require('express');

module.exports = settings => {

  const options = { level: 'info', ...settings.log };

  const router = Router();

  const transports = [
    new winston.transports.Console({
      level: options.level || 'info'
    })
  ];

  const logger = winston.createLogger({
    transports,
    format: settings.json ? winston.format.json() : undefined
  });

  logger.stream = {
    write: msg => logger.log('info', msg)
  };

  router.use(morgan(options.format, { stream: logger.stream }));
  router.use((req, res, next) => {
    req.log = (level, msg) => {
      if (msg === undefined) {
        msg = level;
        level = 'info';
      }
      logger.log(level, msg);
    };
    next();
  });

  return router;

};
