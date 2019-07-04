const Keycloak = require('keycloak-connect');
const {Router} = require('express');

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
    const e = new Error('Access Denied');
    e.status = 403;
    next(e);
  };

  router.use('/logout', (req, res) => {
    res.redirect('/keycloak/logout');
  });

  router.use(keycloak.middleware({ logout: '/keycloak/logout' }));
  router.use(keycloak.protect());

  const setUser = (req, res, next) => {
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
          }
        };

        Object.defineProperty(req.user, '_auth', {
          value: req.kauth.grant.access_token.content
        });
      })
      .then(() => next())
      .catch(next);
  };

  router.use(setUser);

  router.use((req, res, next) => {
    req.user.refreshProfile = (req, res, next) => {
      req.session.profile.expiresAt = Date.now();
      return setUser(req, res, next);
    };

    next();
  });

  return {
    middleware: () => router,
    protect: rules => keycloak.protect(rules)
  };
};
