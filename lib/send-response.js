const { omit } = require('lodash');

module.exports = settings => (req, res, next) => {
  res.sendResponse = () => {
    if (!res.template) {
      const err = new Error('Not found');
      err.status = 404;
      throw err;
    }

    if (req.accepts('html')) {
      return res.render(res.layout || settings.layout || 'layout', {
        Component: res.template,
        crumbs: req.breadcrumbs
      });
    } else if (req.accepts('application/json')) {
      res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
        'Surrogate-Control': 'no-store'
      });
      res.json(omit(res.locals, ['static', 'cache', '_locals', 'settings']));
    } else {
      const err = new Error('Not acceptable');
      err.status = 406;
      throw err;
    }
  };
  next();
};
