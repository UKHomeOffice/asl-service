const { size, reduce, uniq } = require('lodash');
const { stringify } = require('qs');

module.exports = () => (req, res, next) => {
  const filters = size(req.body)
    ? reduce(req.body, (obj, value, key) => {
      const newKey = key.substr(0, key.search(/-\d/));
      return { ...obj, [newKey]: uniq([ ...obj[newKey] || [], value ]) };
    }, {})
    : {};
  const sort = req.query.sort || {};
  const url = `${req.baseUrl}?${stringify({ filters, sort })}`;
  return res.redirect(url);
};
