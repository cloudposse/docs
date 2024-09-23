// https://stackoverflow.com/questions/74876229/how-to-tweak-docusaurus-webpack-config-for-some-react-component
// https://webpack.js.org/loaders/html-loader/
// https://github.com/algolia/docsearch-website/blob/master/plugins/my-loaders/index.js
// https://github.com/facebook/docusaurus/issues/2097
// https://webpack.js.org/concepts/#loaders

const html = require('html-loader');
const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'custom-loaders',
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            // Existing rule for HTML files
            {
              test: /\.(html|htm)$/i,
              loader: 'html-loader',
              options: {
                minimize: {
                  removeComments: false,
                  collapseWhitespace: false,
                },
              },
            },
            {
              test: /\.(txt|yml|yaml|tf)$/i,
              use: 'raw-loader',
            },
            {
              test: /(?:Dockerfile|Makefile)$/i,
              use: 'raw-loader',
            },
          ],
        },

        resolve: {
          alias: {
            '@examples': path.resolve(__dirname, 'examples'),
          },
        },
      };
    },
  };
};
