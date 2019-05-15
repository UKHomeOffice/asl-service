const { each, uniq, isArray } = require('lodash');

const getContentSecurityPolicy = config => {
  const csp = config.csp || [];
  const directives = {
    defaultSrc: [`'none'`],
    styleSrc: [`'self'`, (req, res) => `'nonce-${res.locals.static.nonce}'`, "'unsafe-inline'"],
    imgSrc: [`'self' data:`],
    fontSrc: [`'self'`, 'data:'],
    connectSrc: [`'self'`],
    scriptSrc: [`'self'`, (req, res) => `'nonce-${res.locals.static.nonce}'`, "'unsafe-inline'"]
  };

  each(csp, (value, name) => {
    if (directives[name] && directives[name].length) {
      // concat unique directives with existing directives
      directives[name] = uniq(directives[name].concat(value));
    } else {
      directives[name] = isArray(value) ? value : [value];
    }
  });

  return directives;
};

module.exports = getContentSecurityPolicy;
