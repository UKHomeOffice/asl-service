const { combineReducers } = require('redux');
const { pickBy } = require('lodash');

const options = (state = [], action) => state;

const active = (state = {}, action) => {
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

module.exports = combineReducers({
  active,
  options
});
