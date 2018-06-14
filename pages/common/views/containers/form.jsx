import { mapValues } from 'lodash';
import { connect } from 'react-redux';
import Form from '../components/form';
import { setField } from '../../../../lib/actions';

const extendSchema = (field, formatter) => {
  if (!formatter) {
    return field;
  }
  return {
    ...field,
    ...formatter,
    options: formatter.mapOptions ? field.options.map(formatter.mapOptions) : field.options
  };
};

const mapStateToProps = ({ schema, item, errors }, { formatters = {} }) => {
  return {
    item,
    errors,
    schema: mapValues(schema, (field, key) => extendSchema(field, formatters[key]))
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFieldChange: (key, value) => dispatch(setField(key, value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
