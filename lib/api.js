const qs = require('qs');

module.exports = (root, defaults = {}, cache) => {

  return (path, options = {}) => {

    const headers = Object.assign({}, defaults.headers, options.headers);
    const query = Object.assign({}, defaults.query, options.query);

    options = Object.assign({}, defaults, options, { headers, query });

    const url = `${root}${path}?${qs.stringify(options.query)}`;

    if (cache && options.maxAge && (!options.method || options.method === 'get')) {
      const hit = cache.get(url, { maxAge: options.maxAge });
      if (hit) {
        return Promise.resolve(hit);
      }
    };

    return fetch(url, options)
      .then(response => {
        return response.json()
          .then(json => {
            if (response.status > 399) {
              const err = new Error(json.message);
              err.status = response.status;
              Object.assign(err, json);
              throw err;
            }
            return json;
          })
          .then(json => {
            return {
              url,
              status: response.status,
              json: json
            };
          })
          .then(result => {
            if (cache && options.maxAge) {
              cache.set(url, result);
            }
            return result;
          });
      });

  };

};
