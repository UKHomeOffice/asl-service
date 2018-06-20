import React, { Fragment } from 'react';

export default ({ error }) => <Fragment>
  <h1 className="heading-xlarge">{ error.message }</h1>
  {
    error.status > 499 && <pre>{ error.stack }</pre>
  }
</Fragment>;
