module.exports = (task) => {
  return (req, res, next) => {
    req.user.can(task, req.params)
      .then(() => next())
      .catch(next);
  };
};
