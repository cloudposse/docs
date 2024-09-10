const fs = require('fs');
const path = require('path');

let redirects = [];

// Load docs and legacy redirects directly within this module
const docsRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../redirects/docs.json')));
const legacyRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../redirects/legacy_setup_docs.json')));

// Add the loaded redirects to the in-memory store
redirects = redirects.concat(docsRedirects, legacyRedirects);

function addRedirects(newRedirects) {
  redirects = redirects.concat(newRedirects);
}

function getRedirects() {
  return redirects;
}

function loadRefarchRedirects(context, options) {
  return {
    name: 'redirects-plugin',

    // Plugin lifecycle hook to collect refarchRedirects
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

      // Add refarch redirects to the in-memory store
      addRedirects(refarchRedirects);

      // Log result
      console.log('Refarch Redirects Added:', refarchRedirects);
    },
  };
}

// Export the plugin and helper functions
module.exports = {
  addRedirects,
  getRedirects,
  loadRefarchRedirects,
};
