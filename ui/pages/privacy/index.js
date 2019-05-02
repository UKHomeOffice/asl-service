const page = require('../../page');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
