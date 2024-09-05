const fs = require('fs');

function redirections() {
  refarch = JSON.parse(fs.readFileSync('./redirects/refarch.json'));
  docs = JSON.parse(fs.readFileSync('./redirects/docs.json'));

  redirects = refarch.concat(docs);

  return redirects;
}

module.exports = {
  redirects: redirections()
};
