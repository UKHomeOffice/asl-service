const api = require('../api');

module.exports = (endpoint) => {

  if (!endpoint) {
    return () => Promise.resolve(null);
  }

  const request = api(endpoint);

  return token => {
    const headers = {
      Authorization: `bearer ${token}`
    };
    return request(`/me`, { headers })
      .then(response => response.json.data)
      .catch(() => null);
  };

};
