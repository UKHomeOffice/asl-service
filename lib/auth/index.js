const Keycloak = require('keycloak-connect');
const { Router } = require('express');
const { isEmpty } = require('lodash');
const request = require('r2');
const URLSearchParams = require('url-search-params');

const can = require('./can');
const Profile = require('./profile');

module.exports = settings => {

  const router = Router();
  const getProfile = Profile(settings.profile);

  const config = {
    realm: settings.realm,
    'auth-server-url': settings.url,
    'ssl-required': 'external',
    resource: settings.client,
    credentials: {
      secret: settings.secret
    },
    bearerOnly: settings.bearerOnly
  };

  const keycloak = new Keycloak({ store: settings.store }, config);
  const permissions = can(settings.permissions);

  router.use((req, res, next) => {
    if (req.path !== '/logout' && !req.session && !settings.bearerOnly) {
      return next(new Error('No session'));
    }
    next();
  });

  keycloak.accessDenied = (req, res, next) => {
    if (!isEmpty(req.query)) {
      return res.redirect(req.path);
    }
    const e = new Error('Access Denied');
    e.status = 403;
    next(e);
  };

  router.use('/logout', (req, res) => {
    res.redirect('/keycloak/logout');
  });

  router.use(keycloak.middleware({ logout: '/keycloak/logout' }));
  router.use(keycloak.protect());

  router.use((req, res, next) => {
    const user = {
      id: req.kauth.grant.access_token.content.sub,
      token: req.kauth.grant.access_token.token
    };
    getProfile(user, req.session)
      .then(p => {
        req.user = {
          id: user.id,
          profile: p,
          access_token: user.token,

          can: (task, params) => {
            return permissions(user.token, task, params).then(() => true).catch(() => false);
          },

          allowedActions: () => {
            return permissions(user.token).then(response => response.json);
          },

          refreshProfile: () => {
            req.session.profile.expiresAt = Date.now();
            return getProfile(user, req.session)
              .then(profile => {
                req.user.profile = profile;
              });
          },

          verifyPassword: (username, password) => {
            return Promise.resolve()
              .then(() => {
                const body = new URLSearchParams();
                body.set('grant_type', 'password');
                body.set('username', username);
                body.set('password', password);
                body.set('client_id', settings.client);
                body.set('client_secret', settings.secret);

                const opts = { method: 'POST', body };

                return request(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/token`, opts).response;
              })
              .then(response => response.status === 200); // successful response means we got an access token
          }
        };

        Object.defineProperty(req.user, '_auth', {
          value: req.kauth.grant.access_token.content
        });
      })
      .then(() => next())
      .catch(next);
  });

  return {
    middleware: () => router,
    protect: rules => keycloak.protect(rules)
  };
};
