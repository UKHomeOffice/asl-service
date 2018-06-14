const { chain, unionWith, isEqual, reduce } = require('lodash');
const validators = require('./validators');

const defaultValidators = [
  {
    inputType: 'inputText',
    validate: [
      {
        validator: 'maxLength',
        params: 256
      }
    ]
  }
];

const validateField = ({ value, validate }) => {
  return validate.reduce((err, options) => {
    const { validator, params } = options;
    return err || (!validators[validator](value, params) && validator);
  }, null);
};

const validate = fields => {
  return reduce(fields, (err, field, key) => {
    const type = validateField(field);
    if (type) {
      return { ...err, [key]: type };
    }
    return err;
  }, {});
};

const normaliseValidators = field => {
  if (!field.validate) {
    return field;
  }
  return {
    ...field,
    validate: field.validate.map(v => {
      if (typeof v === 'string') {
        return { validator: v };
      }
      if (v.validator) {
        return v;
      }
      const validator = Object.keys(v)[0];
      return {
        validator,
        params: v[validator]
      };
    })
  };
};

const mapDefaults = (field, key) => {
  const defaults = (defaultValidators.find(v => v.inputType === field.inputType) || {}).validate;
  return {
    ...field,
    validate: field.validate
      ? unionWith(field.validate, defaults, isEqual)
      : defaults
  };
};

const middleware = (values, schema) => {
  const validators = chain(schema)
    .mapValues((field, key) => ({ ...field, value: values[key] }))
    .mapValues(normaliseValidators)
    .mapValues(mapDefaults)
    .pickBy(field => field.validate)
    .value();

  return validate(validators);
};

middleware.validate = validate;
module.exports = middleware;
