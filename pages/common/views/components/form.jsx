import React from 'react';
import { map, get } from 'lodash';
import Input from 'govuk-react-components/components/forms/input-text';
import RadioGroup from 'govuk-react-components/components/forms/radio-group';
import Select from 'govuk-react-components/components/forms/select';
import Snippet from '../containers/snippet';

const fields = {
  inputText: ({ ...props }) => <Input { ...props } />,
  radioGroup: ({ ...props }) => <RadioGroup { ...props } />,
  checkboxGroup: ({ ...props }) => <RadioGroup type="checkbox" { ...props } />,
  select: ({ ...props }) => <Select { ...props } />
};

const Form = ({
  schema,
  item,
  errors,
  applyLabel = 'Submit',
  onFieldChange
}) => (
  <form method="POST">
    {
      map(schema, ({ inputType, accessor, ...props }, key) =>
        fields[inputType]({
          key,
          value: accessor ? get(item[key], accessor) : (item[key] || ''),
          label: key,
          name: key,
          error: errors[key] && <Snippet>{`errors.${key}.${errors[key]}`}</Snippet>,
          onChange: e => onFieldChange(key, e.target.value),
          ...props
        })
      )
    }
    <input type="submit" className="button" value={applyLabel} />
  </form>
);

export default Form;
