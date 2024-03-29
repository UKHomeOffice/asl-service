/* eslint implicit-dependencies/no-implicit: [2, { peer: true }] */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdir = require('mkdirp');
const TerserPlugin = require('terser-webpack-plugin');
const { ProvidePlugin } = require('webpack');
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

    // this glob looks up files in either a js or view directory within a page.
    // if a js directory is found we want to use this as the client side code
    // rather than the jsx view. Reduce right consumes the array from right to left
    // resulting in the js/*.js overwriting the jsx if present.
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
      extensions: ['.js', '.jsx'],
      fallback: {
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/')
      }
    },
    module: {
      rules: [
        {
          test: /\.js(x)?/,
          exclude: path => path.match(/node_modules/) &&
            !path.match(/node_modules\/@asl/) &&
            !path.match(/node_modules\/@ukhomeoffice/),
          use: {
            loader: 'babel-loader',
            options: babelrc
          }
        }
      ]
    },
    plugins: [
      // fix "process is not defined" error:
      // (do "npm install process" before running the build)
      new ProvidePlugin({
        process: 'process/browser',
        setImmediate: 'set-immediate-shim'
      })
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: false
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
