const { each, uniq, isArray } = require('lodash');

const getContentSecurityPolicy = config => {
  const csp = config.csp || [];
  const directives = {
    defaultSrc: [`'none'`],
    styleSrc: [`'self'`],
    imgSrc: [`'self' data:`],
    fontSrc: [`'self'`, 'data:'],
    connectSrc: [`'self'`, 'https://sso-dev.notprod.homeoffice.gov.uk/'],
    scriptSrc: [`'self'`, (req, res) => `'nonce-${res.locals.static.nonce}'`]
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
