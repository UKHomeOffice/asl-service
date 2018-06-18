const { Router } = require('express');
const { render } = require('mustache');

module.exports = crumbs => {
  const router = Router();
  router.get('/', (req, res, next) => {
    res.locals.crumbs = crumbs && crumbs.map(c => {
      if (typeof c === 'string') {
        return render(c, res.locals);
      }
      return {
        label: render(c.label, res.locals),
        href: render(c.href, res.locals)
      };
    });
    next();
  });
  return router;
};
