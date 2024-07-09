const { each, uniq, isArray } = require('lodash');

const getContentSecurityPolicy = config => {
  const csp = config.csp || [];
  const directives = {
    defaultSrc: [`'none'`],
    styleSrc: [`'self'`, "'unsafe-inline'"],
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

  if (process.env.NODE_ENV === 'development') {
    // unsafe-inline is required for react/redux dev tools to work.
    // On Firefox specifying a nonce disables unsafe-inline.
    return {
      ...directives,
      scriptSrc: ["'self'", "'unsafe-inline'"]
    };
  } else {
    return directives;
  }
};

module.exports = getContentSecurityPolicy;
