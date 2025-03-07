import React from 'react';
// todo: remove deprecated hydrate method when React is updated to 18.
// eslint-disable-next-line react/no-deprecated
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Wrapper } from '@ukhomeoffice/asl-components';

/* eslint-disable implicit-dependencies/no-implicit */
import Component from '{{page}}';
import store from '@asl/service/ui/store';
/* eslint-enable implicit-dependencies/no-implicit */

hydrate(
  <Provider store={store}>
    <Wrapper>
      <Component />
    </Wrapper>
  </Provider>,
  document.getElementById('page-component')
);
