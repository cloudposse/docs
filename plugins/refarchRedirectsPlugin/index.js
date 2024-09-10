const redirects = require('../redirects');

module.exports = function refarchRedirectsPlugin(context, options) {
  return {
    name: 'refarch-redirects',

    async allContentLoaded({ actions, allContent }) {
      const { setGlobalData } = actions;
      const refarchRedirects = [];

      // Collect redirects from docs content
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
      redirects.addRedirects(refarchRedirects);

      // Optionally set global data for other uses
      setGlobalData({
        redirects: refarchRedirects,
      });
    },
  };
};
