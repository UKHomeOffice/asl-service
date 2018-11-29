const url = require('url');
const { applyMiddleware, createStore, combineReducers } = require('redux');
const thunk = require('redux-thunk').default;
const allReducers = require('./reducers');
const queryStringFromState = require('@asl/components/src/utils').queryStringFromState;

const persistState = store => next => action => {
  const result = next(action);
  switch (action.type) {
    case 'SET_SORT':
    case 'SET_FILTERS':
    case 'SET_FILTER':
    case 'SET_PAGE':
      const href = url.parse(window.location.href);
      href.search = queryStringFromState(store.getState());
      window.history.replaceState(undefined, undefined, href.format());
  }
  return result;
};

const middleware = [thunk, persistState];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const rootReducer = combineReducers(allReducers);
module.exports = createStore(rootReducer, window.INITIAL_STATE, applyMiddleware(...middleware));
