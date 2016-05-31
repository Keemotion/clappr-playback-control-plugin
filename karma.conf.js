// Karma configuration
// Generated on Tue May 31 2016 14:22:59 GMT+0200 (Romance Summer Time)
const webpack = require('karma-webpack');
const webpackConfig = require('./webpack.config');
webpackConfig.externals = {};
webpackConfig.devtool = 'inline-source-map';

module.exports = function exports(config) {
  config.set({
    frameworks: [
      'mocha',
    ],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/clappr/dist/clappr.min.js',
      'test/unit/**/*.spec.js',
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
    browsers: ['PhantomJS'],
    preprocessors: {
      'test/unit/**/*.spec.js': ['webpack'],
      'src/**/*.js': ['webpack'],
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
