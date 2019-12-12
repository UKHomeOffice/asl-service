const { UnauthorisedError } = require('../../errors');

module.exports = (task, params = {}) => {
  return (req, res, next) => {
    req.user.can(task, Object.assign({}, req.params, { establishment: req.establishmentId }, params))
      .then(allowed => {
        return allowed ? next() : next(new UnauthorisedError());
      });
  };
};
