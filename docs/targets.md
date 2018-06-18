## Makefile Targets
```
Available targets:

  build                               Generate all static content (outputs to public/)
  deploy                              Deploy static site to S3
  deps                                Install package dependencies
  deps-darwin                         Install OSX deps
  deps-linux                          Install Linux deps
  deps/atom                           Install useful atom plugins
  lint                                Lint check all hugo code
  lint/check-for-empty-links          Lint check for empty markdown links
  lint/formatting                     Lint check common formatting mistakes
  open                                Open localhost in browser
  reindex                             Update algolia search index
  release                             Generate a release config
  run                                 Start the hugo server for live editing
  smoketest                           Run smoketest
  test                                Run tests
  validate                            Validate all html is good

```
