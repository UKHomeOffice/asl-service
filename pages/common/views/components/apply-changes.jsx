import React, { Fragment } from 'react';
import { stringify } from 'qs';
import { noop } from 'lodash';

const ApplyChanges = ({
  id,
  type,
  label,
  onApply,
  children,
  ...props
}) => (
  <Fragment>
    {
      type === 'link' && (
        <a href={`?${stringify({ ...props })}`} onClick={e => { e.preventDefault(); onApply(); }}>{label}</a>
      )
    }
    {
      type === 'form' && (
        <form id={id} action={`?${stringify({ ...props })}`} method="POST" onSubmit={e => { e.preventDefault(); onApply(); }}>{ children }</form>
      )
    }
  </Fragment>

);

ApplyChanges.defaultProps = {
  type: 'link',
  label: 'Submit',
  onApply: noop
};

export default ApplyChanges;
