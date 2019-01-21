const { combineReducers } = require('redux');
const filters = require('./filters');
const sort = require('./sort');
const pagination = require('./pagination');

const INITIAL_STATE = {
  rows: [],
  isFetching: false
};

const progress = (state = null) => state;

const data = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'REQUEST_ITEMS':
      return {
        ...state,
        isFetching: true
      };
    case 'RECEIVE_ITEMS':
      return {
        ...state,
        isFetching: false,
        rows: action.rows
      };
    case 'REQUEST_FAILED':
      return {
        ...state,
        isFetching: false
      };
  }
  return state;
};

module.exports = combineReducers({
  progress,
  filters,
  sort,
  pagination,
  data
});
