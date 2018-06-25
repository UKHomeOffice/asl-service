require('../lib/register');

const { merge } = require('lodash');
const express = require('express');
const path = require('path');
const expressViews = require('express-react-views');
const { MemoryStore } = require('express-session');
const session = require('@lennym/redis-session');
const { assets } = require('govuk-react-components');

const sendResponse = require('../lib/send-response');
const errorHandler = require('../lib/error-handler');

const auth = require('../lib/auth');
const api = require('../lib/api');
const normalise = require('../lib/settings');
const logger = require('../lib/logger');

const toolkitDir = path.dirname(require.resolve('govuk_frontend_toolkit/package.json'));
const imagesDir = path.resolve(toolkitDir, './images');

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
  app.use(assets());

  app.use('/govuk/images', express.static(imagesDir));
  if (settings.assets) {
    app.use('/public', express.static(settings.assets));
  }

  app.use(logger(settings));

  if (settings.session) {
    app.use(session(settings.session));
  }
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

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.user = {
        id: req.user.id,
        name: req.user.get('name')
      };
    }
    res.locals.static = res.locals.static || {};
    res.locals.static.content = merge({}, res.locals.static.content, settings.content);
    next();
  });

  app.use(router);

  app.use(sendResponse(settings));
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
