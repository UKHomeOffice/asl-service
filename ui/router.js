require('../lib/register');

const { merge, set } = require('lodash');
const bodyParser = require('body-parser');
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
const ClientError = require('../errors/client-error');

const privacy = require('./pages/privacy');
const cookies = require('./pages/cookies');
const accessibility = require('./pages/accessibility');
const ErrorComponent = require('./views/error');

const base64 = require.resolve('js-base64');

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
    app.get('/public/js/common/base64.js', (req, res) => res.sendFile(base64));
    app.use('/public', express.static(settings.assets));
  }
  app.get('/public/css/wide.css', (req, res) => res.sendFile(path.resolve(__dirname, './assets/css/wide.css')));
  app.get('/favicon.ico', (req, res) => res.sendFile(path.resolve(__dirname, './assets/images/favicon.png')));

  app.use('/ho', express.static(homeOffice.assets));

  app.use(cacheControl(settings));

  if (settings.session) {
    app.use(session(settings.session));
    app.use('/logout', (req, res, next) => {
      req.session.destroy(() => next());
    });
  }

  app.use('/healthcheck', healthcheck(settings));

  app.use(logger(settings));

  if (settings.auth) {
    const keycloak = auth(Object.assign({ store: new MemoryStore() }, settings.auth));
    app.use(keycloak.middleware());
    app.protect = rules => router.use(keycloak.protect(rules));
  }

  app.use('/keepalive', (req, res) => res.json({}));

  app.post('/error', bodyParser.json(), (req, res, next) => {
    return next(new ClientError(req.body.message, { ...req.body, userAgent: req.get('user-agent') }));
  });

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
    set(res.locals, 'static.user', req.user.profile);
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

  app.use('/privacy', privacy());
  app.use('/cookies', cookies());
  app.use('/accessibility', accessibility());

  app.use(router);

  // if the response has not yet been sent then send it
  app.use((req, res) => {
    res.sendResponse();
  });

  app.use(errorHandler({
    ...settings,
    template: ErrorComponent
  }));

  const _app = (...args) => app(...args);

  return Object.assign(_app, {
    param: (...args) => router.param(...args),
    protect: (...args) => app.protect(...args),
    listen: (...args) => app.listen(...args),
    static: staticrouter,
    use: (...args) => router.use(...args)
  });

};
