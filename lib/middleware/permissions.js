class UnauthorisedError extends Error {
  constructor() {
    super('Unauthorised');
    this.status = 401;
  }
}

module.exports = (task) => {
  return (req, res, next) => {
    req.user.can(task, req.params)
      .then(allowed => {
        return allowed ? next() : next(new UnauthorisedError());
      });
  };
};
