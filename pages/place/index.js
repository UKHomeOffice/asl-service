const { merge } = require('lodash');
const { setSchema } = require('../../lib/actions');
const page = require('../../lib/page');
const pageContent = require('./content');
const routers = require('./routers');

module.exports = ({ content } = {}) => {
  const app = page({
    root: __dirname,
    reducers: [
      'establishment',
      'item',
      'schema',
      'diff',
      'errors'
    ],
    pageContent: merge({}, pageContent, content)
  });

  app.use((req, res, next) => {
    if (req.place === 'new') {
      // do the things for "new"
    }
    next();
  });

  app.use('/edit', routers.edit());
  app.use('/delete', routers.delete());
  app.use('/', routers.view());

  app.use((req, res, next) => {
    if (req.form && req.form.schema) {
      res.store.dispatch(setSchema(req.form.schema));
    }
    next();
  });

  return app;
};
