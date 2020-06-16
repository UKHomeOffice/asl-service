const ClientError = require('../errors/client-error');
const StatsD = require('hot-shots');
const omit = require('lodash/omit');
const get = require('lodash/get');

module.exports = settings => {
  const stats = new StatsD();
  return (error, req, res, next) => {
    const status = error.status || 500;
    res.status(status);
    const params = {
      url: req.originalUrl,
      method: req.method,
      message: error.message,
      stack: error.stack,
      status,
      // omit args from redis errors because they contain mixed data types which can break elasticsearch's indexing
      ...omit(error, 'args')
    };
    if (typeof req.log === 'function') {
      req.log('error', params);
    } else {
      console.error(JSON.stringify({ ...params, type: 'UNHANDLED_LOGGING' }));
    }
    if (settings.errorEvent) {
      const event = `${settings.errorEvent}.${status}`;
      stats.increment(event);
    }

    if (!settings.verboseErrors && status > 499) {
      error.message = 'Something went wrong';
      error.stack = null;
    }
    if (error instanceof ClientError) {
      return res.status(200).json({});
    }
    if (req.accepts('html') && settings.template) {
      const Component = error.template || settings.template;
      const url = req.get('Referrer') || '';
      return res.render(res.layout || settings.layout || 'layout', {
        Component: Component.default || Component,
        scripts: [],
        url,
        error,
        isAsruUser: !!get(req, 'user.profile.asruUser', false)
      });
    }
    // Error thrown in AJAX call
    res.json({ message: error.message });
  };
};
