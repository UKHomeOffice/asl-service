const size = require('object-sizeof');
const StatsD = require('hot-shots');

const stats = new StatsD();

module.exports = (store, opts) => {

  opts = Object.assign({ ttl: 300, maxSize: 2 * 1024 * 1024 }, opts);

  Object.keys(store).forEach(key => {
    const entry = store[key];
    if (entry.created < Date.now() - (opts.ttl * 1000)) {
      delete store[key];
    }
  });

  return {
    get: (key, { maxAge = 300 } = {}) => {
      const result = store[key];
      if (result && Date.now() - result.created < (maxAge * 1000)) {
        stats.gauge('asl.cache.hitrate', 1);
        return result.data;
      }
      stats.gauge('asl.cache.hitrate', 0);
    },
    set: (key, data) => {
      if (size(store) > opts.maxSize) {
        // don't save any results until the cache size has reduced
        return;
      }
      store[key] = {
        data,
        created: Date.now()
      };
    }
  };

};
