/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import Component from '{{page}}';
import store from '{{store}}';

hydrate(
  <Provider store={store}>
    <Component />
  </Provider>,
  document.getElementById('page-component')
);
