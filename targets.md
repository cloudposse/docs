<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  build                               Generate all static content (outputs to public/) using docker environment
  components/build                    Build front-end components
  css                                 Generate all static content (outputs to public/) using docker environment
  deploy                              Deploy static site to S3
  deps                                Install package dependencies
  deps-darwin                         Install OSX deps
  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  invalidate-cache                    Invalidate CloudFlare cache (all files)
  reindex                             Update algolia search index
  release                             Generate a release config
  run                                 Start the hugo server for live editing using docker environment
  smoketest                           Run smoketest
  terraform-modules/update            Update terraform-modules pages
  test                                Run tests
  validate                            Validate all html is good

```
<!-- markdownlint-restore -->
