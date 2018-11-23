const ErrorComponent = require('../ui/views/error');

module.exports = settings => {
  return (error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    if (req.log) {
      req.log('error', error);
    }
    const Component = error.template || ErrorComponent;
    res.render(res.layout || settings.layout || 'layout', {
      Component: Component.default || Component,
      scripts: [],
      error
    });
  };
};
