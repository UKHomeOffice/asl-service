const { parse, stringify } = require('qs');
const { setFilters, setSort } = require('../actions');

module.exports = () => (req, res, next) => {

  if (req.query.props) {
    const props = parse(req.query.props);
    props.filters = Object.keys(req.query).reduce((filters, key) => {
      const match = key.match(/^filter-(.+)$/);
      if (match) {
        filters[match[1]] = [].concat(req.query[key]);
      }
      return filters;
    }, {});
    return res.redirect(`?${stringify(props)}`);
  }

  if (typeof req.query.filters === 'object') {
    res.store.dispatch(setFilters(req.query.filters));
  }
  if (typeof req.query.sort === 'object') {
    const { column, ascending } = req.query.sort;
    res.store.dispatch(setSort({
      column,
      ascending: ascending === 'true'
    }));
  }
  next();
};
