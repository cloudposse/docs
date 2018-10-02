const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const env = process.env.NODE_ENV

var config = {
  entry: {
    app: './src/js/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: '[name].js'
	},
  mode: env || 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({
      extractComments: true
    })]
  },
};


module.exports = config;
