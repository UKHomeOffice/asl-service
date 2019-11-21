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

function getUrl(urls, parts, replacer) {
  let item = urls;
  const sections = parts.map(part => {
    const section = get(item, part);
    if (!section) {
      throw new Error(`Unknown route target: ${parts.join('.')}`);
    }
    item = section.routes;
    return section.path.split('/').map(replacer).join('/');
  });
  return sections.join('');
}

module.exports = () => (req, res, next) => {

  req.buildRoute = (page, params) => {
    const parts = page.split('.');
    const replacer = replace({ ...req, ...params });
    return getUrl(res.locals.static.urls, parts, replacer);
  };
  next();
};
