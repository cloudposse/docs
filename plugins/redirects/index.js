const fs = require('fs');
const path = require('path');

function getStaticRedirects() {
  let redirects = [];

  // Load docs and legacy redirects directly within this module
  const docsRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/docs.json')));
  const legacyRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/legacy_setup_docs.json')));

  // Add the loaded redirects to the in-memory store
  redirects = redirects.concat(docsRedirects, legacyRedirects);

  return redirects;
}

function refarchRedirectsPlugin(context, options) {
  return {
    name: 'redirects-plugin',

    async allContentLoaded({ actions, allContent }) {
      const { setGlobalData } = actions;
      const refarchRedirects = [];

      // Collect redirects from docs content with refarch_id
      allContent['docusaurus-plugin-content-docs']
        .default
        .loadedVersions[0]
        .docs
        .forEach((doc) => {
          if (doc.frontMatter.refarch_id) {
            refarchRedirects.push({
              from: `/reference-architecture/${doc.frontMatter.refarch_id}`,
              to: doc.permalink,
            });
            refarchRedirects.push({
              from: `/${doc.frontMatter.refarch_id}`,
              to: doc.permalink,
            });
          }
        });

      console.log('Refarch redirects:', refarchRedirects);

      // Set the refarch redirects in global data
      setGlobalData({
        refarchRedirects: refarchRedirects
      });
    },
  };
}

// Export the plugin and helper functions
module.exports = {
  getStaticRedirects,
  refarchRedirectsPlugin,
};
