/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Wrapper } from '@asl/components';
import Component from '{{page}}';
import store from '@asl/service/ui/store';

hydrate(
  <Provider store={store}>
    <Wrapper>
      <Component />
    </Wrapper>
  </Provider>,
  document.getElementById('page-component')
);
