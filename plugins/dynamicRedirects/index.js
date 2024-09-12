async function loadRedirects(allContent) {
  const redirects = [];

  // Check if 'docusaurus-plugin-content-docs' is available and has the expected structure
  const docsPlugin = allContent['docusaurus-plugin-content-docs'];

  // Check that docsPlugin and its required properties exist
  if (!docsPlugin || !docsPlugin.default || !docsPlugin.default.loadedVersions) {
    console.error("Docs plugin content is not available or improperly structured. Skipping redirects generation.");
    return redirects; // Return empty array if the docs content is not available
  }

  // Access the docs from the first loaded version
  const docs = docsPlugin.default.loadedVersions[0]?.docs || [];

  // Iterate over docs to create redirects based on refarch_id
  docs.forEach((doc) => {
    if (doc.frontMatter?.refarch_id) {
      redirects.push(
        {
          from: `/reference-architecture/${doc.frontMatter.refarch_id}`,
          to: doc.permalink,
        },
        {
          from: `/${doc.frontMatter.refarch_id}`,
          to: doc.permalink,
        }
      );
    }
  });

  console.debug('Loaded redirects:', redirects);
  return redirects;
}

function redirectsPlugin(context, options) {
  return {
    name: 'redirects-plugin',

    // Since the loadContent lifecycle method is synchronous, let's adjust this
    async loadContent() {
      // Returning an empty object as loadContent does not receive allContent directly
      return {};
    },

    async allContentLoaded({ actions, allContent }) {
      const { setGlobalData } = actions;

      // Load redirects using the custom loadRedirects function
      const redirects = await loadRedirects(allContent);

      // Set redirects in global data
      setGlobalData({
        redirects,
      });

      console.debug('Global data set with redirects.');
    },
  };
}

// Export the plugin
module.exports = {
  redirectsPlugin,
};
