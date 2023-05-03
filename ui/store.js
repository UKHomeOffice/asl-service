const url = require('url');
const { applyMiddleware, createStore } = require('redux');
const thunk = require('redux-thunk').default;
const rootReducer = require('./reducers');
const { queryStringFromState } = require('@ukhomeoffice/asl-components/src/utils');

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

module.exports = createStore(rootReducer, window.INITIAL_STATE, applyMiddleware(...middleware));
