const { isUndefined, isNull, every } = require('lodash');

const validators = {
  type: (field, type) => {
    switch (type) {
      case 'array':
        return Array.isArray(field);
      case 'object':
        return !Array.isArray(field) && typeof field === 'object';
      case 'number':
        return typeof field === 'number';
      case 'string':
        return typeof field === 'string';
    }
    return false;
  },
  required: field => {
    if (Array.isArray(field)) {
      return !!field.length;
    }
    return field !== null && field !== '' && !isUndefined(field);
  },
  maxLength: (field, length) => {
    return isNull(field) ||
      (!isUndefined(field) && field.length <= length);
  },
  match: (field, regex) => {
    return !!(field.match && field.match(regex));
  },
  definedValues: (field, definedValues) => {
    if (Array.isArray(field)) {
      return every(field, val => definedValues.includes(val));
    }
    return definedValues.includes(field);
  }
};

module.exports = validators;
