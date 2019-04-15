const ErrorComponent = require('../ui/views/error');

module.exports = settings => {
  return (error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    if (req.log) {
      req.log('error', { ...error, message: error.message, stack: error.stack });
    }

    if (!settings.verboseErrors && error.status > 499) {
      error.message = 'Something went wrong';
      error.stack = null;
    }

    if (req.accepts('html')) {
      const Component = error.template || ErrorComponent;
      return res.render(res.layout || settings.layout || 'layout', {
        Component: Component.default || Component,
        scripts: [],
        error
      });
    }
    // Error thrown in AJAX call
    res.json({ message: error.message });
  };
};
