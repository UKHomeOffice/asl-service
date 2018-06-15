const qs = require('qs');
const fetch = require('r2');

module.exports = (root, defaults = {}) => {

  return (path, options = {}) => {

    const headers = Object.assign({}, defaults.headers, options.headers);
    const query = Object.assign({}, defaults.query, options.query);

    options = Object.assign({}, defaults, options, { headers, query });

    const url = `${root}${path}?${qs.stringify(options.query)}`;

    return fetch(url, options).response
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
          });
      });

  };

};
