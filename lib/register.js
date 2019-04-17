const babelrc = require('../.babelrc.json');

require('@babel/register')({
  ...babelrc,
  ignore: [
    // ignore files that are not .jsx unless they're in an @asl scoped dependency
    // skip `asl-*` to cover the case when that is linked
    p => !p.match(/.jsx/) && !p.match(/@asl/) && !p.match(/\/asl-/),
    // ignore node modules that are not @asl owned dependencies
    p => p.match(/node_modules/) && !(p.match(/@joefitter\/docx/) || p.match(/@asl/))
  ]
});
