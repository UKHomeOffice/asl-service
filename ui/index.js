require('../lib/register');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressViews = require('express-react-views');
const { MemoryStore } = require('express-session');
const session = require('@lennym/redis-session');
const { assets } = require('govuk-react-components');

const { combineReducers, createStore } = require('redux');
const allReducers = require('../lib/reducers');

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
    path.resolve(__dirname, '../pages/common/views')
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

  app.use('/public', express.static(path.resolve(__dirname, '../pages/common/dist')));

  app.use(logger(settings));

  if (settings.session) {
    app.use(session(settings.session));
  }
  if (settings.auth) {
    const keycloak = auth(Object.assign({ store: new MemoryStore() }, settings.auth));
    app.use(keycloak.middleware());
    app.protect = rules => app.use(keycloak.protect(rules));
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
    res.locals.user = req.user;
    next();
  });

  app.use((req, res, next) => {
    res.store = createStore(combineReducers(allReducers), {
      user: {
        id: req.user.id,
        name: req.user.get('name')
      }
    });
    res.locals.store = res.store;
    next();
  });

  app.use(router);
  /*
  csv && app.use(generateCsv());
  if (pdf) {
    app.use(pdfRenderer(pdf));
    app.use(generatePdf());
  }
*/
  app.use(sendResponse(settings));
  app.use(errorHandler());

  return {
    protect: (...args) => app.protect(...args),
    listen: (...args) => app.listen(...args),
    static: staticrouter,
    use: (...args) => router.use(...args)
  };
};
