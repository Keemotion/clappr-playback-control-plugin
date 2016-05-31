// node
const path = require('path');
// vendors
const webpack = require('webpack');
const argv = require('yargs').argv;
// project
const packageInfo = require(path.join(__dirname, 'package.json'));
// locals
const environment = argv.environment || packageInfo.config.environment;
const build = argv.build || packageInfo.config.build;
const pluginVersion = packageInfo.version;
const pluginFileName = 'clappr-playback-rate-plugin.js';
const pluginsList = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin(
    {
      'process.env.NODE_ENV': JSON.stringify(environment),
      'global.ENVIRONMENT': environment,
      'global.BUILD': build,
      'global.VERSION': pluginVersion,
    }
  ),
];
// patch the environment
process.env.NODE_ENV = JSON.stringify(environment);
global.ENVIRONMENT = environment;
global.BUILD = build;
global.VERSION = pluginVersion;
// webpack build configuration
module.exports = {
  entry: [
    path.join(
      __dirname,
      'src/plugin'
    ),
  ],
  devtool: 'source-map',
  plugins: pluginsList,
  externals: {
    clappr: 'Clappr',
    'clappr-zepto': 'clappr-zepto',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: [
          'css',
          [
            'sass?includePaths[]=', path.resolve(__dirname, './node_modules/compass-mixins/lib'),
            '&includePaths[]=', path.resolve(__dirname, './node_modules/clappr/src/base/scss'),
            '&includePaths[]=', path.resolve(__dirname, './src/base/scss'),
          ].join(''),
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.html/,
        loader: 'html?minimize=false',
      },
      {
        test: /\.(png|woff|eot|ttf|swf)/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '<%=baseUrl%>/',
    filename: pluginFileName,
    library: 'PlaybackControlPlugin',
    libraryTarget: 'umd',
  },
};
