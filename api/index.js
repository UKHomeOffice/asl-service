const express = require('express');
const bodyParser = require('body-parser');

const auth = require('../lib/auth');
const normalise = require('../lib/settings');
const logger = require('../lib/logger');
const workflow = require('../lib/workflow');
const cacheControl = require('../lib/middleware/cache-control');

module.exports = settings => {
  settings = normalise(settings);
  const app = express();

  app.get('/healthcheck', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(cacheControl(settings));
  app.use(logger(settings));

  if (settings.auth) {
    const keycloak = auth(Object.assign(settings.auth, { bearerOnly: true }));
    app.use(keycloak.middleware());
    app.protect = rules => app.use(keycloak.protect(rules));
  }

  if (settings.workflow) {
    app.use(workflow(settings.workflow));
  }

  app.use(bodyParser.json({ limit: '5mb' }));

  return app;
};
