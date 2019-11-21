const permissions = require('../lib/middleware/permissions');
const { isFunction } = require('lodash');

function mountRoutes({ app, routes, settings, before, after }) {
  Object.keys(routes).forEach(key => {
    const route = routes[key];

    const name = settings.name
      ? `${settings.name}.${key}`
      : key;

    const router = route.router({ ...settings, name });

    const middleware = [
      router
    ];

    if (route.breadcrumb !== false) {
      middleware.unshift((req, res, next) => {
        req.breadcrumb(route.breadcrumb || name);
        next();
      });
    }

    if (route.permissions) {
      if (typeof route.permissions === 'string') {
        middleware.unshift(permissions(route.permissions));
      }
      if (isFunction(route.permissions)) {
        middleware.unshift(route.permissions);
      }
    }

    if (before) {
      middleware.unshift(before);
    }

    if (after) {
      middleware.push(after);
    }

    const args = [middleware];

    if (route.path) {
      args.unshift(route.path);
    }

    app.use(...args);

    mountRoutes({
      app: router,
      routes: Object.assign({}, route.routes || {}, route.router.routes || {}),
      settings: {
        ...settings,
        name
      }
    });
  });
}

module.exports = mountRoutes;
