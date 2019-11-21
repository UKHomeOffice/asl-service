class ForbiddenError extends Error {
  constructor() {
    super('Forbidden');
    this.status = 403;
  }
}

module.exports = (task, params = {}) => {
  return (req, res, next) => {
    req.user.can(task, Object.assign({}, req.params, params, { establishment: req.establishmentId }))
      .then(allowed => {
        return allowed ? next() : next(new ForbiddenError());
      });
  };
};
