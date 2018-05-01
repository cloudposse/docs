---
title: "Build Harness"
excerpt: ""
---
The `build-harness` is a collection of [Makefiles](doc:makefile) to facilitate building stuff. It supports Golang projects, Dockerfiles, Helm charts, and much more.
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "0-1": "https://raw.githubusercontent.com/cloudposse/build-harness",
    "1-1": "[![Build Status](https://travis-ci.org/cloudposse/build-harness.svg)](https://travis-ci.org/cloudposse/build-harness)",
    "1-0": "Build Status",
    "2-0": "Release",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/build-harness.svg)](https://github.com/cloudposse/build-harness/releases)"
  },
  "cols": 2,
  "rows": 3
}
[/block]
It's designed to work with CI/CD systems such as Travis CI, CircleCI, CodeFresh and Jenkins.

It's 100% Open Source and licensed under [APACHE2](LICENSE).

# Usage

At the top of your `Makefile` add, the following...
[block:code]
{
  "codes": [
    {
      "code": "-include $(shell curl -sSL -o .build-harness \"https://git.io/build-harness\"; echo .build-harness)",
      "language": "text",
      "name": "Makefile"
    }
  ]
}
[/block]
This will download a `Makefile` called `.build-harness` and include it at run-time. We recommend adding the `.build-harness` file to your `.gitignore`.

This automatically exposes many new targets that you can leverage throughout your build & CI/CD process.

Run `make help` for a list of available targets.
[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "The `/` in target names is interchangeable with the `:` in target names"
}
[/block]
# Real World Examples

We leverage the `build-harness` in nearly every project on our [GitHub](doc:github).
[block:parameters]
{
  "data": {
    "0-0": "[`github-authorized-keys`](https://github.com/cloudposse/github-authorized-keys/)",
    "0-1": "A Golang project that leverages `docker/%`, `go/%`, `travis/%` targets",
    "1-0": "[`charts`](https://github.com/cloudposse/charts/)",
    "1-1": "A collection of Helm Charts that leverages `docker/%` and `helm/%` targets",
    "2-0": "[`bastion`](https://github.com/cloudposse/bastion/)",
    "2-1": "A docker image that leverages `docker/%` and `bash/lint` targets",
    "3-0": "[`terraform-null-label`](https://github.com/cloudposse/terraform-null-label/)",
    "3-1": "A terraform module that leverages `terraform/%` targets"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Makefile Targets

Running `make help` will produce this helpful output of all available make targets.
[block:code]
{
  "codes": [
    {
      "code": "$ make help\n\n  Available targets:\n\nbash/lint                           Lint all bash scripts\ndocker/build                        Build docker image\ndocker/login                        Login into docker hub\ndocs/copyright-add                  Add copyright headers to source code\ngeodesic/deploy                     Run a Jenkins Job to Deploy $(APP) with $(CANONICAL_TAG)\ngit/aliases-update                  Update git aliases\ngit/export                          Export git vars\ngithub/download-private-release     Download release from github\ngithub/download-public-release      Download release from github\ngit/show                            Show vars\ngit/submodules-update               Update submodules\ngo/build                            Build binary\ngo/build-all                        Build binary for all platforms\ngo/clean                            Clean compiled binary\ngo/clean-all                        Clean compiled binary and dependency\ngo/deps                             Install dependencies\ngo/deps-build                       Install dependencies for build\ngo/deps-dev                         Install development dependencies\ngo/fmt                              Format code according to Golang convention\ngo/install                          Install cli\ngo/lint                             Lint code\ngo/test                             Run tests\ngo/vet                              Vet code\nhelm/chart/build                    Build chart $CHART_NAME from $CHART_TPL\nhelm/chart/build-all                Build chart $CHART_NAME from $CHART_TPL for all available $SEMVERSIONS\nhelm/chart/clean                    Clean chart packages\nhelm/chart/create                   Create chart $CHART from starter scaffold\nhelm/chart/publish                  Publish chart $CHART_NAME to $REPO_GATEWAY_ENDPOINT\nhelm/chart/starter/fetch            Fetch starter\nhelm/chart/starter/remove           Remove starter\nhelm/chart/starter/update           Update starter\nhelm/install                        Install helm\nhelm/repo/add                       Add $REPO_NAME from $REPO_ENDPOINT\nhelm/repo/add-current               Add helm remote dev repos\nhelm/repo/add-remote                Add helm remote repos\nhelm/repo/build                     Build repo\nhelm/repo/clean                     Clean helm repo\nhelm/repo/fix-perms                 Fix repo filesystem permissions\nhelm/repo/info                      Show repo info\nhelm/repo/lint                      Lint charts\nhelm/repo/update                    Update repo info\nhelm/serve/index                    Build index for serve helm charts\nhelp                                This help screen\njenkins/run-job-with-tag            Run a Jenkins Job with $(TAG)\nmake/lint                           Lint all makefiles\nreadme                              Alias for readme/build\nreadme/build                        Create README.md by building it from .README.md file\nreadme/init                         Create basic minimalistic .README.md template file\nreadme/toc-update                   Update table of contents in README.md\nsemver/export                       Export semver vars\nsemver/show                         Show\nstages/export                       Export stages vars\ntemplate/build                      Create $OUT file by building it from $IN template file\ntemplate/deps                       Install dependencies\nterraform/get-modules               Ensure all modules can be fetched\nterraform/get-plugins               Ensure all plugins can be fetched\nterraform/install                   Install terraform\nterraform/lint                      Lint check Terraform\nterraform/validate                  Basic terraform sanity check\ntravis/docker-login                 Login into docker hub\ntravis/docker-tag-and-push          Tag & Push according Travis environment variables",
      "language": "shell"
    }
  ]
}
[/block]