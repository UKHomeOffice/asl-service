const babelrc = require('../.babelrc.server.json');

require('@babel/register')({
  ...babelrc,
  ignore: [
    // ignore files that are not .jsx unless they're in @asl/projects
    // skip `asl-projects` to cover the case when that is linked
    p => !p.match(/.jsx/) && !(p.match(/@asl\/projects/) || p.match(/\/asl-projects/) || p.match(/backpack-transpiled/)),
    // ignore node modules that are not @asl owned dependencies
    p => p.match(/node_modules/) && !(p.match(/@joefitter\/docx/) || p.match(/@asl/) || p.match(/@ukhomeoffice/) || p.match(/backpack-transpiled/))
  ]
});
