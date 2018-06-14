const { mapValues } = require('lodash');
const { Router } = require('express');
const { setDiff } = require('../../../lib/actions');
const getItem = require('../helpers/get-item');
const submitChange = require('../middleware/submit-change');

const defaultMiddleware = (req, res, next) => next();

module.exports = ({
  configure = defaultMiddleware,
  checkSession = defaultMiddleware,
  getValues = defaultMiddleware,
  populateStore = defaultMiddleware
} = {}) => ({ model, schema }) => {
  const app = Router();

  const _configure = (req, res, next) => {
    req.form = req.form || {};
    req.form.id = req[model];
    req.form.schema = schema;
    return configure(req, res, next);
  };

  const _processQuery = (req, res, next) => {
    const { clear, edit } = req.query;
    if (clear) {
      delete req.session.form[req.form.id];
      const re = new RegExp(`/${req.form.id}/edit/confirm`);
      res.redirect(req.baseUrl.replace(re, ''));
    }
    if (edit) {
      res.redirect(req.baseUrl.replace(/\/confirm/, ''));
    }
    next();
  };

  const _checkSession = (req, res, next) => {
    if (req.session.form && req.session.form[req.form.id]) {
      return checkSession(req, res, next);
    }
    res.redirect(req.baseUrl.replace(/\/confirm/, ''));
  };

  const _getValues = (req, res, next) => {
    getItem(req, model)
      .then(item => {
        req.form.diff = mapValues(req.form.schema, ({ parse }, key) => {
          return {
            oldValue: item[key],
            newValue: req.session.form[req.form.id].values[key]
          };
        });
      })
      .then(() => getValues(req, res, next))
      .catch(next);
  };

  const _populateStore = (req, res, next) => {
    res.store.dispatch(setDiff(req.form.diff));
    return populateStore(req, res, next);
  };

  const submit = (req, res, next) => {
    if (req.session.form && req.session.form[req.form.id]) {
      return submitChange(req.session.form[req.form.id])
        .then(() => {
          res.redirect(req.originalUrl.replace(/\/confirm/, '/success'));
        })
        .catch(next);
    }
    return res.redirect(req.originalUrl);
  };

  app.get('/',
    _configure,
    _processQuery,
    _checkSession,
    _getValues,
    _populateStore
  );

  app.post('/',
    _configure,
    submit
  );

  return app;
};
