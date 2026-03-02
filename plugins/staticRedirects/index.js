const fs = require('fs');
const path = require('path');

function getStaticRedirects() {
  // Load redirects directly within this module
  const docsRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/docs.json'), 'utf-8'));
  const legacyRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/legacy_setup_docs.json'), 'utf-8'));
  const refarchRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/refarch.json'), 'utf-8'));
  const deprecatedRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/deprecated.json'), 'utf-8'));
  const componentsMigrationRedirects = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'redirects/components-migration.json'), 'utf-8'));

  // Combine the loaded redirects into a single array
  return [...docsRedirects, ...legacyRedirects, ...refarchRedirects, ...deprecatedRedirects, ...componentsMigrationRedirects];
}

// Export the plugin and helper functions
module.exports = {
  getStaticRedirects,
};
