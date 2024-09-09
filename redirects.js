const fs = require('fs');

function redirections() {
  // These are redirects for REFARCH content
  refarch = JSON.parse(fs.readFileSync('./redirects/refarch.json'));
  // These are new custom redirects for docs
  // We can replace these with "doc.frontMatter.refarch_id"
  docs = JSON.parse(fs.readFileSync('./redirects/docs.json'));
  // These are redirects for any link in the old setup docs for previous customers
  legacy = JSON.parse(fs.readFileSync('./redirects/legacy_setup_docs.json'));

  redirects = refarch.concat(docs);
  return redirects;
}

module.exports = {
  redirects: redirections()
};
