const api = require('../api');

module.exports = (endpoint) => {

  if (!endpoint) {
    return () => {
      const err = new Error('Access denied');
      err.status = 403;
      return Promise.reject(err);
    };
  }

  const request = api(endpoint);

  return (token, task = '', query) => {
    const headers = {
      Authorization: `bearer ${token}`
    };
    return request(`/${task}`, { headers, query });
  };

};
