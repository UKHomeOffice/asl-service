import React from 'react';
import GovUK from 'govuk-react-components/components/layout';

const Layout = ({
  Component,
  ...props
}) => {
  return (
    <GovUK
      {...props}
    >
      <main className="main" id="content">
        <div className="grid-row">
          <div className="column-full">
            <div id="page-component">
              <Component {...props} />
            </div>
          </div>
        </div>
      </main>
    </GovUK>
  );
};

module.exports = Layout;
