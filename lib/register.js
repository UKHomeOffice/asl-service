const babelrc = require('../.babelrc.json');

require('@babel/register')({ ...babelrc, ignore: [] });
