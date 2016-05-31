const path = require('path');
const webpack = require('karma-webpack');
const webpackConfig = require('./webpack.config');
webpackConfig.externals = {};
webpackConfig.devtool = 'inline-source-map';
webpackConfig.entry = path.join(__dirname, 'test/main.js');

module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'src/plugin.js',
      'test/**/*.spec.js',
    ],
    plugins: [
      webpack,
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-spec-reporter',
    ],
    browsers: ['Firefox'],
    preprocessors: {
      'src/plugin.js': ['webpack'],
      'test/**/*.spec.js': ['webpack'],
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'build/reports/coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
      ],
    },
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
  });
};
