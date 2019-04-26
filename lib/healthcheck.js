const fetch = require('r2');
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
      });

  }

  router.get('/ready', (req, res) => {
    const services = [settings.api, settings.workflow];
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
      });
  });

  router.get('*', (req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
};
