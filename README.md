<!-- This file was automatically generated by the `build-harness`. Make all changes to `README.yaml` and run `make readme` to rebuild this file. -->

[![Cloud Posse](https://cloudposse.com/logo-300x69.png)](https://cloudposse.com)

# Developer Documentation  [![Build Status](https://g.codefresh.io/api/badges/build?repoOwner=cloudposse&repoName=docs&branch=master&pipelineName=docs&accountName=cloudposse&type=cf-1)](https://g.codefresh.io/repositories/cloudposse/docs/builds?filter=trigger:build;branch:master;service:5af3ac6d081c8d00016aee46~docs) [![Latest Release](https://img.shields.io/github/release/cloudposse/docs.svg)](https://github.com/cloudposse/docs/releases) [![Slack Community](https://slack.cloudposse.com/badge.svg)](https://slack.cloudposse.com)


Welcome to the Cloud Posse Developer Hub Documentation Portal.

All documentation is published to [docs.cloudposse.com](https://docs.cloudposse.com). Here you'll find comprehensive guides and documentation to help you start working with the Cloud Posse technology stack as quickly as possible, as well as support if you get stuck.

Let's jump right in! Here's how to get started with our documentation.This project is part of our comprehensive ["SweetOps"](https://docs.cloudposse.com) approach towards DevOps. 



It's 100% Open Source and licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](LICENSE).
<a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img title="Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License" src="static/images/cc-by-nc-sa.png" width="250" /></a>



## Usage

1. Run `make init`
2. Run `make run` to start local server
3. Run `make build` to generate static site in `public/`




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



## Related Projects

Check out these related projects.

- [Geodesic](https://github.com/cloudposse/geodesic) - Geodesic is the fastest way to get up and running with a rock solid, production grade cloud platform


## Help

**Got a question?**

File a GitHub [issue](https://github.com/cloudposse/docs/issues), send us an [email][email] or join our [Slack Community][slack].

## Commerical Support

Work directly with our team of DevOps experts via email, slack, and video conferencing. 

We provide *commercial support* for all of our [Open Source][github] projects. As a *Dedicated Support* customer, you have access to our team of subject matter experts at a fraction of the cost of a fulltime engineer. 

- **Questions.** We'll use a Shared Slack channel between your team and ours.
- **Troubleshooting.** We'll help you triage why things aren't working.
- **Code Reviews.** We'll review your Pull Requests and provide constructive feedback.
- **Bug Fixes.** We'll rapidly work to fix any bugs in our projects.
- **Build New Terraform Modules.** We'll develop original modules to provision infrastructure.
- **Cloud Architecture.** We'll assist with your cloud strategy and design.
- **Implementation.** We'll provide hands on support to implement our reference architectures. 

## Community Forum

Get access to our [Open Source Community Forum][slack] on Slack. It's **FREE** to join for everyone! Our "SweetOps" community is where you get to talk with others who share a similar vision for how to rollout and manage infrastructure. This is the best place to talk shop, ask questions, solicit feedback, and work together as a community to build *sweet* infrastructure.

## Contributing

### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/cloudposse/docs/issues) to report any bugs or file feature requests.

### Developing

If you are interested in being a contributor and want to get involved in developing this project or [help out](https://github.com/orgs/cloudposse/projects/3) with our other projects, we would love to hear from you! Shoot us an [email](mailto:hello@cloudposse.com).

In general, PRs are welcome. We follow the typical "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull Request** so that we can review your changes

**NOTE:** Be sure to merge the latest changes from "upstream" before making a pull request!

## Copyright

Copyright © 2017-2018 [Cloud Posse, LLC](https://cloudposse.com)



## License 
[![License](https://img.shields.io/badge/License-CC%20BY%20NC%20SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/) 
<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img title="Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License" src="https://docs.cloudposse.com/images/cc-by-nc-sa.png" width="250" /></a>

This material may only be distributed subject to the terms and conditions set forth in the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License or later with the restrictions noted below (the latest version of the license is presently available at <http://creativecommons.org/licenses/by-nc-sa/4.0/>).

**Attribution** You must attribute the work in the manner specified by the author or licensor.

**Noncommercial** The licensor permits others to copy, distribute and transmit the work. In return, licensees may not use the work for commercial purposes — unless they get the licensor's permission.

**Share Alike** The licensor permits others to distribute derivative works only under the same license or one compatible with the one that governs the licensor's work.

## Distribution

Distribution of substantively modified versions of this document is prohibited without the explicit permission of the copyright holder.

Distribution of the work or derivative of the work in any standard (paper) book form for commercial purposes is prohibited unless prior permission is obtained from the copyright holder.

## Trademarks

All other trademarks referenced herein are the property of their respective owners.

## About

This project is maintained and funded by [Cloud Posse, LLC][website]. Like it? Please let us know at <hello@cloudposse.com>

[![Cloud Posse](https://cloudposse.com/logo-300x69.png)](https://cloudposse.com)

We're a [DevOps Professional Services][hire] company based in Los Angeles, CA. We love [Open Source Software](https://github.com/cloudposse/)!

We offer paid support on all of our projects.  

Check out [our other projects][github], [apply for a job][jobs], or [hire us][hire] to help with your cloud strategy and implementation.

  [docs]: https://docs.cloudposse.com/
  [website]: https://cloudposse.com/
  [github]: https://github.com/cloudposse/
  [jobs]: https://cloudposse.com/jobs/
  [hire]: https://cloudposse.com/contact/
  [slack]: https://slack.cloudposse.com/
  [linkedin]: https://www.linkedin.com/company/cloudposse
  [twitter]: https://twitter.com/cloudposse/
  [email]: mailto:hello@cloudposse.com


### Contributors

|  [![Erik Osterman][osterman_avatar]](osterman_homepage)<br/>[Erik Osterman][osterman_homepage] | [![Igor Rodionov][goruha_avatar]](goruha_homepage)<br/>[Igor Rodionov][goruha_homepage] | [![Andriy Knysh][aknysh_avatar]](aknysh_homepage)<br/>[Andriy Knysh][aknysh_homepage] |
|---|---|---|

  [osterman_homepage]: https://github.com/osterman
  [osterman_avatar]: http://s.gravatar.com/avatar/88c480d4f73b813904e00a5695a454cb?s=144
  [goruha_homepage]: https://github.com/goruha/
  [goruha_avatar]: http://s.gravatar.com/avatar/bc70834d32ed4517568a1feb0b9be7e2?s=144
  [aknysh_homepage]: https://github.com/aknysh/
  [aknysh_avatar]: https://avatars0.githubusercontent.com/u/7356997?v=4&u=ed9ce1c9151d552d985bdf5546772e14ef7ab617&s=144


