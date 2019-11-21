class UnauthorisedError extends Error {
  constructor() {
    super('Unauthorised');
    this.status = 401;
  }
}

module.exports = (task, params = {}) => {
  return (req, res, next) => {
    req.user.can(task, Object.assign({}, req.params, params, { establishment: req.establishmentId }))
      .then(allowed => {
        return allowed ? next() : next(new UnauthorisedError());
      });
  };
};
