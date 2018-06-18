module.exports = () => {
  return (error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    if (req.log && error.status > 499) {
      req.log('error', error);
    }
    res.render('error', { error });
  };
};
