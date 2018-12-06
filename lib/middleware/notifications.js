const { get, set } = require('lodash');
const { render } = require('mustache');

module.exports = () => (req, res, next) => {
  req.notification = ({ type = 'alert', key, ...props }) => {
    const message = render(get(res.locals.static.content, `notifications.${key}`), props);

    set(req.session, 'notification', {
      message,
      type
    });
  };

  if (req.session.notification) {
    res.locals.notification = req.session.notification;
    delete req.session.notification;
  }
  next();
};
