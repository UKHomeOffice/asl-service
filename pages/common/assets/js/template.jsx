/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

import React from 'react';
import url from 'url';
import { pick } from 'lodash';
import { stringify } from 'qs';
import { render } from 'react-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Component from '{{page}}';
import allReducers from '{{root}}/lib/reducers';

const persistState = store => next => action => {
  const result = next(action);
  switch (action.type) {
    case 'SET_SORT_COLUMN':
    case 'SET_FILTERS':
    case 'SET_FITLER':
      const { filters, sort } = store.getState();
      const href = url.parse(window.location.href);
      href.search = stringify({ filters, sort });
      window.history.replaceState(undefined, undefined, href.format());
  }
  return result;
};

const middleware = [persistState];

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');
  middleware.push(logger);
}

const rootReducer = combineReducers(pick(allReducers, window.REDUCERS));
const store = createStore(rootReducer, window.INITIAL_STATE, applyMiddleware(...middleware));

render(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('page-component')
);
