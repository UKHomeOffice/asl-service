import React from 'react';
import HomeOffice from '../components/home-office';

const Layout = ({
  Component,
  ...props
}) => {
  return (
    <HomeOffice
      {...props}
    >
      <div className="govuk-width-container">
        <main className="main govuk-main-wrapper" id="content">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <div id="page-component">
                <Component {...props} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </HomeOffice>
  );
};

module.exports = Layout;
