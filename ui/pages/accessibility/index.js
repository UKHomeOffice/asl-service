const page = require('../../page');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.breadcrumb('dashboard');
    req.breadcrumb('accessibility');
    next();
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
