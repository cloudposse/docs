<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  deps                                Install node modules
  deps-production                     Install production only node modules
  build                               Generate all static content (outputs to build/) using docker environment
  start                               Start web server locally
  real-clean                          Clean all dependencies and generated html files 
  all                                 Run `clean`, `deps` and `build steps

```
<!-- markdownlint-restore -->
