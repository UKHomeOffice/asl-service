const { cloneDeep, merge } = require('lodash');

module.exports = settings => {
  settings = cloneDeep(settings);
  return merge({
    urls: {},
    log: {
      level: 'info',
      format: 'combined',
      json: true
    },
    verboseErrors: false,
    root: process.cwd()
  }, settings);
};
