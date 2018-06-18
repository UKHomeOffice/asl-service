module.exports = () => {
  return (error, req, res, next) => {
    res.status(500);
    if (error.status) {
      res.status(error.status);
    }
    if (req.log) {
      req.log('error', error);
    }
    res.render('error', { error });
  };
};
