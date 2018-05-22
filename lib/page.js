const path = require('path');
const express = require('express');
const persistQuery = require('./middleware/persist-query');
const actions = require('./actions');

module.exports = ({
  name,
  reducers,
  root,
  schema
}) => {
  const app = express.Router();

  app.use('/assets', express.static(path.resolve(root, './dist')));

  app.get('/', (req, res, next) => {
    res.locals.reducers = [ 'user', 'url', ...reducers ];
    res.store.dispatch(actions.setSchema(schema));
    next();
  });

  app.get('/', (req, res, next) => {
    const url = req.baseUrl === '/'
      ? ''
      : req.baseUrl;
    res.locals.url = url;
    next();
  });

  app.get('/', persistQuery());

  app.get('/', (req, res, next) => {
    res.template = path.resolve(root, 'views/index');
    next();
  });

  return app;
};
