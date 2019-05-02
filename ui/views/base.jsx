import React from 'react';
import omit from 'lodash/omit';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import HomeOffice from '../components/home-office';
import rootReducer from '../reducers';
import {
  Breadcrumbs,
  StatusBar,
  Wrapper
} from '@asl/components';

const Wrapped = ({ store, children }) => <Provider store={store}>{ children }</Provider>;

const renderChildren = (children, wrap) => {
  if (wrap) {
    return <Wrapper>{ children }</Wrapper>;
  }
  return children;
};

const Layout = ({
  error,
  children,
  scripts = [],
  user,
  crumbs,
  footerLinks,
  static: staticContent = {},
  ...props
}) => {
  const {
    content: {
      siteTitle = 'Research and testing using animals',
      ...content
    } = {},
    urls,
    nonce,
    ...rest
  } = staticContent;

  const wrap = !error;
  const store = wrap
    ? createStore(rootReducer, {
      ...omit(props, ['footerLinks', 'settings', '_locals', 'cache']),
      static: { ...rest, content, urls }
    })
    : {};
  if (scripts.length) {
    scripts = ['/public/js/common/bundle.js'].concat(scripts);
  }
  const page = (
    <HomeOffice
      propositionHeader={siteTitle}
      stylesheets={['/public/css/app.css']}
      scripts={scripts}
      headerContent={<StatusBar user={user} />}
      nonce={nonce}
      footerLinks={footerLinks}
      phaseBanner={{
        phase: 'beta',
        feedbackUrl: '/feedback'
      }}
    >
      <div className="govuk-width-container">
        <Breadcrumbs crumbs={crumbs} />
        <main className="main govuk-main-wrapper" id="content">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <div id="page-component">
                { renderChildren(children, wrap) }
              </div>
            </div>
          </div>
        </main>
      </div>
      {
        wrap && <script nonce={nonce} dangerouslySetInnerHTML={{__html: `window.INITIAL_STATE=${JSON.stringify(store.getState())};`}} />
      }
    </HomeOffice>
  );
  if (wrap) {
    return <Wrapped store={store}>{ page }</Wrapped>;
  }
  return page;
};

module.exports = Layout;
