const ErrorComponent = require('../ui/views/error');

module.exports = settings => {
  return (error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    if (req.log) {
      req.log('error', error);
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
    if (!settings.verboseErrors) {
      return res.json({ message: 'Fetch failed' });
    }
    res.json({ message: error.message });
  };
};
