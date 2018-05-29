const { get } = require('lodash');

const toTitleCase = str =>
  str.replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase()}${txt.substr(1)}`);

const getTitle = (key, options = {}) => {
  if (options.title) {
    if (typeof options.title === 'function') {
      return options.title(key);
    }
    return options.title;
  }
  return toTitleCase(key);
};

const getValue = (row, key, schema = {}) => {
  const accessor = schema.accessor || key;
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return get(row, accessor);
};

module.exports = {
  toTitleCase,
  getTitle,
  getValue
};
