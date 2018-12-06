const { get, set } = require('lodash');

module.exports = () => (req, res, next) => {
  req.notification = ({ type = 'alert', key }) => {
    set(req.session, 'notification', { message: get(res.locals.static.content, `notifications.${key}`), type });
  };

  if (req.session.notification) {
    res.locals.notification = req.session.notification;
    delete req.session.notification;
  }
  next();
};
