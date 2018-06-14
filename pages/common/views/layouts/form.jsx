import React from 'react';
import ErrorSummary from '../containers/error-summary';
import Form from '../containers/form';

const FormLayout = ({
  children,
  fields
}) => (
  <div className="grid-row">
    <div className="column-two-thirds">
      <ErrorSummary />
      {
        children
      }
      <Form formatters={fields} />
    </div>
  </div>
);

export default FormLayout;
