import React, { Fragment } from 'react';

export default ({ isAsruUser }) => {
  return (
    <Fragment>
      <h1 className="heading-xlarge">Page not found</h1>
      <p>Here’s why a page might not be displaying:</p>
      <p><strong>The link is wrong</strong></p>
      <p>If you pasted the web address, check you copied the entire address.</p>
      <p><strong>You don’t have permission to view the page</strong></p>

      { isAsruUser
        ? <p>Contact an ASRU admin for help.</p>
        : <Fragment>
          <p>To protect people’s data, we restrict who can view people and licences at your establishment. Contact an admin for help.</p>
          <p><strong>A person has left the establishment</strong></p>
          <p>If you’re trying to find someone, they may have transferred to another establishment.</p>
        </Fragment>
      }
    </Fragment>
  );
};
