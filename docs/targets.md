## Makefile Targets
```
Available targets:

  build                               Generate all static content (outputs to public/) using docker environment
  components/build                    Build front-end components
  deploy                              Deploy static site to S3
  deps                                Install package dependencies
  deps-darwin                         Install OSX deps
  deps-linux                          Install Linux deps
  deps/atom                           Install useful atom plugins
  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  hugo/build                          Generate all static content (outputs to public/) using local environment
  hugo/run                            Start the hugo server for live editing using local environment
  invalidate-cache                    Invalidate CloudFlare cache (all files)
  lint                                Lint check all hugo code
  lint/check-for-empty-links          Lint check for empty markdown links
  lint/formatting                     Lint check common formatting mistakes
  open                                Open localhost in browser
  reindex                             Update algolia search index
  release                             Generate a release config
  run                                 Start the hugo server for live editing using docker environment
  smoketest                           Run smoketest
  terraform-modules/update            Update terraform-modules pages
  test                                Run tests
  validate                            Validate all html is good

```
