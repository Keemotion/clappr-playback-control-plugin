// node
const path = require('path');
// vendors
const webpack = require('webpack');
// project
// locals
const pluginFileName = 'clappr-playback-rate-plugin.js';
const pluginsList = [
  new webpack.optimize.OccurenceOrderPlugin(),
];
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
