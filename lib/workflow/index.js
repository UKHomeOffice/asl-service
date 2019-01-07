const Workflow = require('./client');

module.exports = url => (req, res, next) => {
  req.workflow = new Workflow(url, req.user);
  next();
};
