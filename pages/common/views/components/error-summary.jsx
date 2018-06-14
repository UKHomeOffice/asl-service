import { size } from 'lodash';
import React from 'react';
import Snippet from '../containers/snippet';

const Errors = ({
  errors
}) => {
  if (!size(errors)) {
    return null;
  }
  return (
    <div className="error-summary" role="alert" aria-labelledby="error-summary-heading" tabIndex="-1">
      <h2 className="heading-medium error-summary-heading" id="error-summary-heading">
        <Snippet>
          {
            size(errors) > 1
              ? 'errors.headingPlural'
              : 'errors.heading'
          }
        </Snippet>
      </h2>
      <ul className="error-summary-list">
        {
          Object.keys(errors).map(key =>
            <li key={key}><a href={`#${key}`}><Snippet>{`errors.${key}.${errors[key]}`}</Snippet></a></li>
          )
        }
      </ul>
    </div>
  );
};

export default Errors;
