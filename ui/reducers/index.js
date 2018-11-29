module.exports = {
  notification: require('./notification'),
  model: state => state || {},
  datatable: require('./datatable'),
  static: (state = {}) => state
};
