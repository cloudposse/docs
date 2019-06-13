const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const env = process.env.NODE_ENV;

var config = {
  entry: {
    app: './src/js/app.js',
    mermaid: './src/js/mermaid.js',
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
        options: {
          presets: ['@babel/preset-env'],
        },
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    // new BundleAnalyzerPlugin() // Disabled by default.
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
};


module.exports = config;
