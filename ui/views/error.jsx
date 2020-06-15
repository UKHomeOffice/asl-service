import React, { Fragment } from 'react';
import NotFound from './not-found';

export default ({ error, url, isAsruUser }) => {
  switch (error.status) {
    case 403:
      return <Fragment>
        <h1 className="heading-xlarge">You do not have permission to access this page</h1>
        <p>Please contact an administrator to request access</p>
      </Fragment>;
    case 404:
      return <NotFound isAsruUser={isAsruUser} />;
    default:
      return <Fragment>
        <h1 className="heading-xlarge">{ error.message }</h1>
        {
          error.status > 499 && error.stack && <pre>{ error.stack }</pre>
        }
        <p><a href={url}>Try again</a></p>
      </Fragment>;
  }
};
