const { get } = require('lodash');

const replace = params => fragment => {
  if (fragment[0] === ':') {
    if (!params[fragment.substr(1)]) {
      throw new Error(`URL Builder: undefined parameter: "${fragment}"`);
    }
    return params[fragment.substr(1)];
  }
  return fragment;
};

module.exports = () => (req, res, next) => {

  req.buildRoute = (page, params) => {

    const href = get(res.locals.static.urls, page);

    if (!href) {
      throw new Error(`Unknown route target: ${page}`);
    }
    const replacer = replace({ ...req, ...params });
    const url = href.split('/').map(replacer).join('/');

    return url;
  };
  next();
};
