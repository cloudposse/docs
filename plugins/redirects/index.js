const fs = require('fs');
const path = require('path');

let redirects = [];

// Load docs and legacy redirects directly within this module
const docsRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/docs.json')));
const legacyRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/legacy_setup_docs.json')));

// Add the loaded redirects to the in-memory store
redirects = redirects.concat(docsRedirects, legacyRedirects);

function getRedirects() {
  return redirects;
}

function redirectsPlugin(context, options) {
  return {
    name: 'redirects-plugin',

    async allContentLoaded({ actions, allContent }) {
      const { setGlobalData } = actions;
      const refarchRedirects = [];

      try {
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

      } catch (error) {
        // Handle errors by logging them
        console.error('Error while processing refarch redirects:', error);
      }
    },
  };
}

// Export the plugin and helper functions
module.exports = {
  getRedirects,
  redirectsPlugin,
};
