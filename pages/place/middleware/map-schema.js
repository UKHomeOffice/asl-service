const { merge } = require('lodash');

const mapSchema = (schema, nacwos) => {
  const options = nacwos.map(({ id, profile: { name } }) => ({
    label: name,
    value: id
  }));
  return merge({}, schema, {
    nacwo: {
      options,
      validate: [
        {
          definedValues: options.map(option => option.value)
        }
      ]
    }
  });
};

module.exports = ({ schema }) => (req, res, next) => {
  return req.api(`/establishment/${req.establishment}/roles`, { query: { type: 'nacwo' } })
    .then(response => {
      req.form.schema = mapSchema(schema, response.json.data);
    })
    .then(() => next())
    .catch(next);
};
