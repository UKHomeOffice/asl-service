import React, { Fragment } from 'react';
import { stringify } from 'qs';
import { noop, omit } from 'lodash';

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
        <a href={`?${stringify(omit(props, 'dispatch'))}`} onClick={e => { e.preventDefault(); onApply(); }}>{label}</a>
      )
    }
    {
      type === 'form' && (
        <form id={id} onSubmit={e => { e.preventDefault(); onApply(); }}>
          <input type="hidden" name="props" value={stringify(omit(props, 'dispatch'))} />
          { children }
        </form>
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
