/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdir = require('mkdirp');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const TEMPLATE_PATH = path.resolve(__dirname, './assets/js/template.jsx');
const template = fs.readFileSync(TEMPLATE_PATH).toString();
const STORE_PATH = path.resolve(__dirname, './assets/js/default-store');

module.exports = dirs => {

  dirs = [].concat(dirs);

  const entry = dirs.reduce((all, cwd) => {
    let store = STORE_PATH;
    try {
      store = require.resolve(`${cwd}/lib/store`);
    } catch (e) {}

    glob.sync('./pages/**/views/*.jsx', { ignore: ['./pages/common/**'], cwd, absolute: true })
      .forEach(page => {
        const baseName = path.join(path.relative(cwd, page), '../..');
        const fileName = path.basename(page, path.extname(page));
        const dir = path.resolve(cwd, '.tmp', baseName, fileName);
        const file = path.resolve(dir, 'entry.js');
        const js = template
          .replace(/{{page}}/g, page)
          .replace(/{{store}}/g, store);
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
          test: /\.jsx?/,
          exclude: /node_modules/,
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
