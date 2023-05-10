const path = require('path');

const spec = path.join(__dirname, 'src', 'spec.js');
const index = path.join(__dirname, 'src', 'index.js');

const webpack = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'eslint-loader',
        include: [ index, spec ],
        enforce: 'pre'
      },
      {
        test: /.js$/,
        include: [ index, spec ],
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        include: [ index ],
        loader: 'istanbul-instrumenter-loader',
        exclude: /(node_modules|\.spec\.(js|jsx)$)/,
        enforce: 'post'
      }
    ]
  }
};

module.exports = function karmaConfig(config) {
  config.set({
    basePath: './',
    frameworks: [ 'mocha', 'chai' ],
    reporters: [ 'mocha' ],
    files: [
      spec,
      'node_modules/babel-polyfill/dist/polyfill.js'
    ],
    preprocessors: {
      [spec]: [ 'webpack', 'sourcemap' ]
    },
    browsers: [ 'PhantomJS' ],
    webpack: webpack,
    webpackMiddleware: {
      noInfo: true
    },
    mochaReporter: {
      showDiff: true
    },
    reporters: [ 'progress', 'coverage-istanbul' ],
    coverageIstanbulReporter: {
      reports: (config.singleRun ? [ 'lcov',  'text' ] : [ ])
    }
  });
};
