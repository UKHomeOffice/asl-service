import React from 'react';
import omit from 'lodash/omit';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import HomeOffice from '../components/home-office';
import rootReducer from '../reducers';
import {
  Breadcrumbs,
  StatusBar
} from '@asl/components';

const Wrapped = ({ store, children }) => <Provider store={store}>{ children }</Provider>;

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
                { children }
              </div>
            </div>
          </div>
        </main>
      </div>
      {
        wrap && <script src="/public/js/common/base64.js" />
      }
      {
        wrap && <script nonce={nonce} dangerouslySetInnerHTML={{__html: `
          function decode(str) { return JSON.parse(window.Base64.decode(str)); }
          window.INITIAL_STATE=decode('${Buffer.from(JSON.stringify(store.getState()), 'utf8').toString('base64')}');
        `}} />
      }
    </HomeOffice>
  );
  if (wrap) {
    return <Wrapped store={store}>{ page }</Wrapped>;
  }
  return page;
};

module.exports = Layout;
