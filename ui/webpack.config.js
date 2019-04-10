/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdir = require('mkdirp');
const TerserPlugin = require('terser-webpack-plugin');
const babelrc = require('../.babelrc.json');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const TEMPLATE_PATH = path.resolve(__dirname, './assets/js/template.jsx');
const template = fs.readFileSync(TEMPLATE_PATH).toString();

const normalise = settings => {
  const glob = './pages/**/+(js|views)/+(*.js|*.jsx)';
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

    return glob.sync(settings.glob, { ignore: settings.ignore, cwd: settings.dir, absolute: true })
      .reduceRight((pages, page) => {
        const extension = path.extname(page);
        const baseName = path.join(path.relative(settings.dir, page), '../..');
        const fileName = path.basename(page, extension);
        const name = path.join(baseName, fileName);
        if (extension !== '.jsx') {
          return { ...pages, [name]: page };
        }
        const dir = path.resolve(settings.dir, '.tmp', baseName, fileName);
        const file = path.resolve(dir, 'entry.jsx');
        const js = template
          .replace(/{{page}}/g, page);
        mkdir.sync(dir);
        fs.writeFileSync(file, js);
        return {
          ...pages,
          [name]: file
        };
      }, all);
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
          exclude: path => path.match(/node_modules/) && !path.match(/node_modules\/@asl/),
          use: {
            loader: 'babel-loader',
            options: babelrc
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: false,
          cache: true
        })
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'common',
            chunks: 'initial',
            minChunks: Math.ceil(Object.keys(entry).length / 2)
          }
        }
      }
    }
  };
};
