const winston = require('winston');
const morgan = require('morgan');
const { Router } = require('express');
const { get } = require('lodash');
const StatsD = require('hot-shots');
const onFinished = require('on-finished');

module.exports = settings => {
  const stats = new StatsD();
  const options = { level: 'info', ...settings.log };

  const router = Router();

  const transports = [
    new winston.transports.Console({
      level: options.level || 'info',
      handleExceptions: true
    })
  ];

  const logger = winston.createLogger({
    transports,
    format: settings.json ? winston.format.json() : undefined
  });

  logger.stream = {
    write: msg => logger.log('info', msg)
  };

  morgan.token('user', req => get(req, 'user.profile.id'));

  router.use(morgan(`${morgan.short} - :user`, { stream: logger.stream }));
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

  // log a zero error count on successful responses
  if (settings.errorEvent) {
    const event = `${settings.errorEvent}.500`;
    router.use((req, res, next) => {
      onFinished(res, (err, response) => {
        if (!err && response.statusCode === 200) {
          stats.increment(event, 0);
        }
      });
      next();
    });
  }

  return router;

};
