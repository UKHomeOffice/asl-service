const express = require('express');
const bodyParser = require('body-parser');

const auth = require('../lib/auth');
const normalise = require('../lib/settings');
const logger = require('../lib/logger');
const workflow = require('../lib/workflow');
const healthcheck = require('../lib/healthcheck');
const cacheControl = require('../lib/middleware/cache-control');
const requestLogger = require('../lib/middleware/log-requests');

module.exports = settings => {
  settings = normalise(settings);
  const app = express();

  app.use('/healthcheck', healthcheck());

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

  if (settings.logRequests) {
    app.use(requestLogger(settings.logRequests));
  }

  return app;
};
