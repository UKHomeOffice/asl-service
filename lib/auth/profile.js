const api = require('../api');
const moment = require('moment');

module.exports = (endpoint) => {

  if (!endpoint) {
    return () => Promise.resolve(null);
  }

  const request = api(endpoint);

  return (token, session) => {

    return Promise.resolve()
      .then(() => {
        if (!session.profile ||
          (session.profile &&
            moment().isAfter(moment(session.profile.expiresAt).format()))) {

          const headers = {
            Authorization: `bearer ${token}`
          };

          return request(`/me`, { headers })
            .then(response => {
              const p = response.json.data;
              p.expiresAt = moment.utc(moment().add(600, 'seconds')).valueOf();
              return p;
            })
            .catch(() => null);
        } else {
          return session.profile;
        }
      })
      .then(profile => {
        session.profile = profile;
        return profile;
      });
  };

};
