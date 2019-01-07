const express = require('express');
const bodyParser = require('body-parser');

const auth = require('../lib/auth');
const normalise = require('../lib/settings');
const logger = require('../lib/logger');
const workflow = require('../lib/workflow');

module.exports = settings => {
  settings = normalise(settings);
  const app = express();

  app.use(logger(settings));

  if (settings.auth) {
    const keycloak = auth(Object.assign(settings.auth, { bearerOnly: true }));
    app.use(keycloak.middleware());
    app.protect = rules => app.use(keycloak.protect(rules));
  }

  if (settings.workflow) {
    app.use(workflow(settings.workflow));
  }

  app.use(bodyParser.json());

  return app;
};
