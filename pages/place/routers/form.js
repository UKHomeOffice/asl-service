const { Router } = require('express');
const bodyParser = require('body-parser');
const { mapValues, size, some, get, isEqual } = require('lodash');
const validator = require('../../../lib/validation');

const defaultMiddleware = (req, res, next) => next();

const hasChanged = (value, key, item) => {
  if (Array.isArray(value)) {
    return !isEqual([ ...value ].sort(), [ ...item[key] ].sort());
  }
  return value !== item[key];
};

const flattedNested = (data, schema) => {
  return mapValues(schema, ({ accessor }, key) => accessor
    ? get(data[key], accessor)
    : data[key]
  );
};

const getDefaultValues = (req, model) => {
  return req.api(`/establishment/${req.establishment}/${model}/${req.form.id}`)
    .then(({ json: { data } }) => {
      return Promise.resolve(flattedNested(data, req.form.schema));
    })
    .catch(err => Promise.reject(err));
};

module.exports = ({
  configure = defaultMiddleware,
  clearErrors = defaultMiddleware,
  getValues = defaultMiddleware,
  process = defaultMiddleware,
  validate = defaultMiddleware,
  getValidationErrors = defaultMiddleware,
  saveValues = defaultMiddleware
} = {}) => ({
  model,
  schema = {},
  confirmStep = 'confirm'
}) => {
  const form = Router();

  const _configure = (req, res, next) => {
    req.form = req.form || {};
    req.form.id = req[model];
    req.form.schema = schema;
    req.session.form = req.session.form || {};
    req.session.form[req.form.id] = req.session.form[req.form.id] || {};
    return configure(req, res, next);
  };

  const _clearErrors = (req, res, next) => {
    delete req.session.form[req.form.id].validationErrors;
    return clearErrors(req, res, next);
  };

  const _getValues = (req, res, next) => {
    getDefaultValues(req, model)
      .then(defaultValues => {
        req.form.values = {
          ...defaultValues,
          ...req.session.form[req.form.id].values
        };
      })
      .then(() => getValues(req, res, next))
      .catch(next);
  };

  const _process = (req, res, next) => {
    req.form.values = mapValues(req.form.schema, ({ format }, key) => {
      return format ? format(req.body[key]) : req.body[key] || null;
    });
    return process(req, res, next);
  };

  const _checkChanged = (req, res, next) => {
    getDefaultValues(req, model)
      .then(defaultValues => {
        if (some(req.form.values, (value, key) => hasChanged(value, key, defaultValues))) {
          return next();
        }
        return next({ validation: { form: 'unchanged' } });
      })
      .catch(next);
  };

  const _validate = (req, res, next) => {
    const validation = validator(req.form.values, req.form.schema);
    if (size(validation)) {
      return next({ validation });
    }
    return validate(req, res, next);
  };

  const _saveValues = (req, res, next) => {
    req.session.form[req.form.id].values = req.form.values;
    return saveValues(req, res, next);
  };

  const _getValidationErrors = (req, res, next) => {
    req.form.validationErrors = req.session.form[req.form.id].validationErrors;
    return getValidationErrors(req, res, next);
  };

  const errorHandler = (err, req, res, next) => {
    if (err.validation) {
      req.session.form[req.form.id].validationErrors = err.validation;
      req.session.form[req.form.id].values = req.form.values;
      return res.redirect(req.originalUrl);
    }
    return next(err);
  };

  form.get('/',
    _configure,
    _getValues,
    _getValidationErrors
  );

  form.post('/',
    bodyParser.urlencoded({ extended: false }),
    _configure,
    _clearErrors,
    _process,
    _checkChanged,
    _validate,
    _saveValues,
    errorHandler
  );

  return form;
};
