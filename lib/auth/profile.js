const api = require('../api');
const moment = require('moment');

module.exports = (endpoint) => {

  if (!endpoint) {
    return () => Promise.resolve(null);
  }

  const request = api(endpoint);

  return (user, session) => {

    return Promise.resolve()
      .then(() => {
        if (session.profile && Date.now() < session.profile.expiresAt && session.profile.userId && session.profile.userId === user.id) {
          return session.profile;
        } else {

          const headers = {
            Authorization: `bearer ${user.token}`
          };

          return request(`/me`, { headers })
            .then(response => {
              const p = response.json.data;
              p.expiresAt = moment.utc(moment().add(600, 'seconds')).valueOf();
              return p;
            })
            .catch(() => null);
        }
      })
      .then(profile => {
        session.profile = profile;
        return profile;
      });
  };

};
