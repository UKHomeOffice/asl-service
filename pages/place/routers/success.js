const { Router } = require('express');

module.exports = ({ model }) => {
  const app = Router();

  app.get('/', (req, res, next) => {
    const id = req[model];
    if (req.session.form && req.session.form[id]) {
      delete req.session.form[id];
    }
    next();
  });

  return app;
};
