require('../lib/register');

const { merge, set } = require('lodash');
const express = require('express');
const path = require('path');
const uuid = require('uuid');
const expressViews = require('express-react-views');
const { MemoryStore } = require('express-session');
const homeOffice = require('@ukhomeoffice/frontend-toolkit');
const session = require('@lennym/redis-session');
const helmet = require('helmet');
const getContentSecurityPolicy = require('../lib/get-content-security-policy');
const sendResponse = require('../lib/send-response');
const errorHandler = require('../lib/error-handler');
const auth = require('../lib/auth');
const api = require('../lib/api');
const normalise = require('../lib/settings');
const logger = require('../lib/logger');
const healthcheck = require('../lib/healthcheck');
const routeBuilder = require('../lib/middleware/route-builder');
const notifications = require('../lib/middleware/notifications');
const cacheControl = require('../lib/middleware/cache-control');

module.exports = settings => {

  settings = normalise(settings);

  settings = Object.assign({
    assets: path.resolve(settings.root, './public'),
    views: path.resolve(settings.root, './views')
  }, settings);

  const app = express();
  const staticrouter = express.Router();
  const router = express.Router();

  app.set('trust proxy', true);
  app.set('view engine', 'jsx');
  app.set('views', [
    settings.views,
    path.resolve(__dirname, './views')
  ]);

  app.engine('jsx', expressViews.createEngine({
    transformViews: false
  }));


  app.use(staticrouter);

  if (settings.assets) {
    app.use('/public', express.static(settings.assets));
  }
  app.get('/favicon.ico', (req, res) => res.sendFile(path.resolve(__dirname, './assets/images/favicon.png')));

  app.use('/ho', express.static(homeOffice.assets));

  app.use(cacheControl(settings));

  if (settings.session) {
    app.use(session(settings.session));
    app.use('/logout', (req, res, next) => {
      req.session.destroy(() => next());
    });
  }

  app.get('/healthcheck', healthcheck(settings));

  app.use(logger(settings));

  if (settings.auth) {
    const keycloak = auth(Object.assign({ store: new MemoryStore() }, settings.auth));
    app.use(keycloak.middleware());
    app.protect = rules => router.use(keycloak.protect(rules));
  }

  if (settings.api) {
    app.use((req, res, next) => {
      const headers = req.user && {
        Authorization: `bearer ${req.user.access_token}`
      };
      req.api = api(settings.api, { headers });
      next();
    });
  }

  app.use(routeBuilder());

  app.use((req, res, next) => {
    set(res.locals, 'static.nonce', uuid.v4());
    return next();
  });

  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: getContentSecurityPolicy(settings)
  }));

  app.use((req, res, next) => {
    res.locals.user = req.user || {};
    res.locals.static = res.locals.static || {};
    set(res.locals, 'static.content', merge({}, res.locals.static.content, settings.content));
    set(res.locals, 'static.urls', merge({}, settings.urls));
    next();
  });

  app.use(notifications());

  app.use((req, res, next) => {
    req.breadcrumb = crumb => {
      req.breadcrumbs = req.breadcrumbs || [];
      req.breadcrumbs = [ ...req.breadcrumbs, crumb ];
    };
    next();
  });

  app.use(sendResponse(settings));

  app.use(router);

  // if the response has not yet been sent then send it
  app.use((req, res) => {
    res.sendResponse();
  });

  app.use(errorHandler(settings));

  const _app = (...args) => app(...args);

  return Object.assign(_app, {
    param: (...args) => router.param(...args),
    protect: (...args) => app.protect(...args),
    listen: (...args) => app.listen(...args),
    static: staticrouter,
    use: (...args) => router.use(...args)
  });

};
