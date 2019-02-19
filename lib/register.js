const babelrc = require('../.babelrc.json');

require('@babel/register')({ ...babelrc,
  ignore: [
    p => p.match(/node_modules/) && !p.match(/@joefitter\/docx/) && !p.match(/@asl/)
  ] });
