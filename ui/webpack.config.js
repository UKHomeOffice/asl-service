/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdir = require('mkdirp');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const TEMPLATE_PATH = path.resolve(__dirname, './assets/js/template.jsx');
const template = fs.readFileSync(TEMPLATE_PATH).toString();

const normalise = settings => {
  const glob = './pages/**/views/*.jsx';
  const ignore = ['./pages/common/**'];

  if (typeof settings === 'string') {
    return { dir: settings, glob, ignore };
  }
  return Object.assign({ glob, ignore }, settings);
};

module.exports = dirs => {

  dirs = [].concat(dirs);

  const entry = dirs.reduce((all, project) => {

    const settings = normalise(project);

    glob.sync(settings.glob, { ignore: settings.ignore, cwd: settings.dir, absolute: true })
      .forEach(page => {
        const baseName = path.join(path.relative(settings.dir, page), '../..');
        const fileName = path.basename(page, path.extname(page));
        const dir = path.resolve(settings.dir, '.tmp', baseName, fileName);
        const file = path.resolve(dir, 'entry.jsx');
        const js = template
          .replace(/{{page}}/g, page);
        mkdir.sync(dir);
        fs.writeFileSync(file, js);
        all[path.join(baseName, fileName)] = file;
      });
    return all;
  }, {});

  return {
    entry,
    output: {
      filename: '[name]/bundle.js'
    },
    mode,
    devtool: mode === 'development' && 'inline-source-map',
    target: 'web',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.js(x)?/,
          exclude: path => {
            const parts = path.split('/');
            const notASL = parts
              // get the name of every immediate  child directory of node_modules in the path
              .map((dir, i) => dir === 'node_modules' && parts[i + 1])
              // are any of them not @asl?
              .some(dir => dir !== '@asl');
            // if any are *not* @asl then exclude from babel
            return notASL;
          },
          loader: 'babel-loader'
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'common',
            chunks: 'initial',
            minChunks: Object.keys(entry).length
          }
        }
      }
    }
  };
};
