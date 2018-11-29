const { combineReducers } = require('redux');

module.exports = combineReducers({
  notification: require('./notification'),
  model: state => state || {},
  datatable: require('./datatable'),
  static: (state = {}) => state
});
