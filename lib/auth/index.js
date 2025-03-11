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
    // ASPeL URL
    const postLogoutRedirectUri = req.headers.referer || req.headers.origin;
    const idTokenHint = req.kauth?.grant?.id_token?.token; // Extract ID token if available

    const logoutUrl = new URL(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.append('post_logout_redirect_uri', postLogoutRedirectUri);

    if (idTokenHint) {
      logoutUrl.searchParams.append('id_token_hint', idTokenHint);
    }

    res.redirect(logoutUrl.toString());
  });

  router.use(keycloak.middleware({ logout: '/keycloak/logout' }));
  router.use(keycloak.protect());

  router.use((req, res, next) => {
    Promise.resolve()
      .then(() => {
        const remaining = req.kauth.grant.access_token.content.exp * 1000 - Date.now();
        const user = {
          id: req.kauth.grant.access_token.content.sub,
          access_token: req.kauth.grant.access_token.token,
          keycloakRoles: req.kauth.grant.access_token.content?.realm_access?.roles ?? []
        };
        // if token is less than 30s away from expiring then refresh it
        if (remaining < 30 * 1000 && req.kauth.grant.refresh_token) {
          const body = new URLSearchParams();
          body.set('grant_type', 'refresh_token');
          body.set('client_id', settings.client);
          body.set('client_secret', settings.secret);
          body.set('refresh_token', req.kauth.grant.refresh_token.token);

          const opts = { method: 'POST', body };

          return Promise.resolve()
            .then(() => {
              return request(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/token`, opts).response;
            })
            .then(response => response.json())
            .then(grant => keycloak.grantManager.createGrant(grant))
            .then(grant => {
              if (grant.access_token) {
                keycloak.storeGrant(grant, req, res);
                return {
                  ...user,
                  access_token: grant.access_token.token,
                  keycloakRoles: grant.access_token.content?.realm_access?.roles ?? []
                };
              }
              return user;
            })
            .catch(() => {
              return user;
            });
        }
        return user;
      })
      .then(user => {
        req.user = user;
        return getProfile(req.user, req.session);
      })
      .then(profile => {
        Object.assign(req.user, {
          profile,

          can: (task, params) => {
            return permissions(req.user.access_token, task, params).then(() => true).catch(() => false);
          },

          allowedActions: () => {
            return permissions(req.user.access_token).then(response => response.json);
          },

          refreshProfile: () => {
            req.session.profile.expiresAt = Date.now();
            return getProfile(req.user, req.session)
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
        });

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
