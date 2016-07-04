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
// env dependent
var pluginFileName = null;
var devtool = null;
if (environment === 'production') {
  pluginFileName = 'clappr-playback-control-plugin.min.js';
} else {
  devtool = 'source-map';
  pluginFileName = 'clappr-playback-control-plugin.js';
}
const output = {
  path: path.resolve(__dirname, 'dist'),
  publicPath: '<%=baseUrl%>/',
  filename: pluginFileName,
  library: 'PlaybackControlPlugin',
  libraryTarget: 'umd',
  pathinfo: false
};
// webpack build configuration
module.exports = {
  entry: path.join(__dirname, 'src/plugin'),
  devtool: devtool,
  plugins: pluginsList,
  externals: {
    clappr: 'Clappr',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        loaders: [
          'css',
          [
            'sass?includePaths[]=', path.resolve(__dirname, './node_modules/compass-mixins/lib'),
            '&includePaths[]=', path.resolve(__dirname, './node_modules/clappr/src/base/scss'),
            '&includePaths[]=', path.resolve(__dirname, './src/base/scss'),
          ].join(''),
        ],
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
    root: path.resolve(__dirname, 'src'),
  },
  output: output,
};
