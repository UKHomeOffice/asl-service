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

          grantToken: (username, password) => {
            // todo: use req.api
            return Promise.resolve()
              .then(() => {
                const body = new URLSearchParams();
                body.set('grant_type', 'password');
                body.set('username', username);
                body.set('password', password);
                body.set('client_id', settings.client);
                body.set('client_secret', settings.secret);

                // body.set('client_id', 'account');
                // body.set('client_secret', '');

                const url = `${settings.url}/realms/${settings.realm}/protocol/openid-connect/token`;

                const opts = {
                  method: 'POST',
                  body
                };

                console.log({
                  url,
                  opts
                });

                return request(url, opts).response;
              })
              .then(response => {
                console.log('response', response);
                return response.json()
                  .then(json => {
                    if (response.status > 399) {
                      const error = new Error(response.statusText);
                      error.status = response.status;
                      Object.assign(error, json);
                      throw error;
                    }
                    return json;
                  });
              });
          },

          updateKeycloak: (token, user) => {
            return Promise.resolve()
              .then(() => {
                const opts = {
                  method: 'PUT',
                  headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token.access_token}`
                  },
                  json: {
                    username: user.email,
                    email: user.email
                  }
                };

                const url = `${settings.url.replace('/auth', '')}/${settings.realm}/users/${user.id}`;

                console.log({
                  url,
                  opts
                });

                return request(url, opts).response;
              })
              .then(response => {
                console.log('response', response);
                if (response.status > 399) {
                  const error = new Error(response.statusText);
                  error.status = response.status;
                  throw error;
                }
                return Promise.resolve('OK');
              });
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
