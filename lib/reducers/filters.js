const {
  isEmpty,
  chain,
  some,
  pickBy,
  pick,
  every
} = require('lodash');

const { getValue } = require('../utils');

const flattenNestedCols = ({ row, schema, col }) => {
  if (isEmpty(schema)) {
    return col === '*' ? row : pick(row, col);
  }
  const values = chain(schema)
    .pickBy((s, k) => col === '*' ? s.show : col === k)
    .mapValues((value, key) => getValue(row, key, value))
    .value();
  return values;
};

const valueMatchesFilter = (value, filter, options) => {
  const comparator = options.comparator === 'AND' ? every : some;
  return comparator(filter, f => {
    if (Array.isArray(value)) {
      return some(value, v => valueMatchesFilter(v, [ f ], options));
    }
    if (typeof value === 'string') {
      if (typeof f !== 'string') {
        return false;
      }
      return options.exact
        ? value.toLowerCase() === f.toLowerCase()
        : value.toLowerCase().includes(f.toLowerCase());
    }
    if (typeof value === 'number') {
      return f === value;
    }
  });
};

const rowMatchesFilterSet = (filters, schema) => row => {
  return every(filters, (filter, col) => {
    const flattened = flattenNestedCols({ row, schema, col });
    return some(flattened, (value, key) => {
      const options = schema[key] || {};
      return valueMatchesFilter(value, filter, options);
    });
  });
};

const applyFilters = ({ data, schema, filters }) => {
  const nonNullFilters = filters = pickBy(filters, f => !isEmpty(f));

  if (isEmpty(nonNullFilters)) {
    return data;
  }

  return data.filter(rowMatchesFilterSet(nonNullFilters, schema));
};

const filtersReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...action.filters };
    case 'SET_FILTER':
      return pickBy({
        ...state,
        [action.key]: action.value ? [].concat(action.value) : []
      }, v => v);
  }
  return state;
};

filtersReducer.applyFilters = applyFilters;

module.exports = filtersReducer;
