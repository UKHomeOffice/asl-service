const fetch = require('r2');

module.exports = settings => (req, res) => {
  if (settings.api) {
    return fetch(`${settings.api}/healthcheck`)
      .then(response => {
        if (response.status !== 200) {
          res.status(500);
          res.json({
            status: 'failed',
            message: `Could not connect to downstream API at ${settings.api}`
          });
        }
      });
  }
  res.json({ status: 'ok' });
};
