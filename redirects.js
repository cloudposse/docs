const fs = require('fs');

function refarchRedirections() {
  return JSON.parse(fs.readFileSync('./content/reference-architecture/refarch.json'));
}

module.exports = {
  redirects: refarchRedirections()
};
