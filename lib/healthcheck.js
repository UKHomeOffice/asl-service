const fetch = require('r2');
const { get } = require('lodash');
const { Router } = require('express');

module.exports = settings => {
  const router = Router();

  const ping = url => {
    if (!url) {
      return false;
    }
    return fetch(`${url}/healthcheck`)
      .then(response => {
        if (response.status !== 200) {
          return { url, status: response.status };
        }
        return false;
      })
      .catch(() => {
        return { url, status: null };
      });
  };

  router.get('/ready', (req, res, next) => {
    const services = [
      settings.api,
      settings.workflow,
      get(settings, 'auth.permissions')
    ];
    Promise.all(services.map(ping))
      .then(responses => {
        const down = responses.filter(Boolean);
        if (down.length) {
          res.status(500);
          res.json({
            status: 'failed',
            down
          });
        } else {
          res.json({ status: 'ok' });
        }
      })
      .catch(next);
  });

  router.get('/', (req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
};
