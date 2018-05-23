---
title: Build Harness
description: "The `build-harness` is a collection of Makefiles to facilitate building stuff. It supports Helm, Docker, Kubernetes, Helm Charts, and much more. We use it as part of our CI/CD pipelines."
---

The `build-harness` is a collection of [Makefiles](/tools/make) to facilitate building stuff. It supports Golang projects, Dockerfiles, Helm charts, and much more.

|              |                                                                                                                                        |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo  | <https://github.com/cloudposse/build-harness/>                                                                                         |
| Build Status | [![Build Status](https://travis-ci.org/cloudposse/build-harness.svg)](https://travis-ci.org/cloudposse/build-harness)                  |
| Release      | [![Release](https://img.shields.io/github/release/cloudposse/build-harness.svg)](https://github.com/cloudposse/build-harness/releases) |

It's designed to work with CI/CD systems such as Travis CI, CircleCI, Codefresh and Jenkins.

It's 100% Open Source and licensed under [APACHE2]({{< relref "LICENSE.md" >}}).

# Usage

At the top of your `Makefile` add, the following...

## Makefile

```shell
-include $(shell curl -sSL -o .build-harness "https://git.io/build-harness"; echo .build-harness)
```

This will download a `Makefile` called `.build-harness` and include it at run-time. We recommend adding the `.build-harness` file to your `.gitignore`.

This automatically exposes many new targets that you can leverage throughout your build & CI/CD process.

Run `make help` for a list of available targets.

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
The `/` in target names is interchangeable with the `:` in target names
{{% /dialog %}}

# Real World Examples

We leverage the `build-harness` in nearly every project on our [GitHub]({{< relref "documentation/our-github.md" >}}).

| Example Repo                                                                      | Usage                                                                      |
|:----------------------------------------------------------------------------------|:---------------------------------------------------------------------------|
| [`github-authorized-keys`](https://github.com/cloudposse/github-authorized-keys/) | A Golang project that leverages `docker/%`, `go/%`, `travis/%` targets     |
| [`charts`](https://github.com/cloudposse/charts/)                                 | A collection of Helm Charts that leverages `docker/%` and `helm/%` targets |
| [`bastion`](https://github.com/cloudposse/bastion/)                               | A docker image that leverages `docker/%` and `bash/lint` targets           |
| [`terraform-null-label`](https://github.com/cloudposse/terraform-null-label/)     | A terraform module that leverages `terraform/%` targets                    |

# Makefile Targets

Running `make help` will produce this helpful output of all available make targets.

```shell
$ make help

  Available targets:

bash/lint                           Lint all bash scripts
docker/build                        Build docker image
docker/login                        Login into docker hub
docs/copyright-add                  Add copyright headers to source code
geodesic/deploy                     Run a Jenkins Job to Deploy $(APP) with $(CANONICAL_TAG)
git/aliases-update                  Update git aliases
git/export                          Export git vars
github/download-private-release     Download release from github
github/download-public-release      Download release from github
git/show                            Show vars
git/submodules-update               Update submodules
go/build                            Build binary
go/build-all                        Build binary for all platforms
go/clean                            Clean compiled binary
go/clean-all                        Clean compiled binary and dependency
go/deps                             Install dependencies
go/deps-build                       Install dependencies for build
go/deps-dev                         Install development dependencies
go/fmt                              Format code according to Golang convention
go/install                          Install cli
go/lint                             Lint code
go/test                             Run tests
go/vet                              Vet code
helm/chart/build                    Build chart $CHART_NAME from $CHART_TPL
helm/chart/build-all                Build chart $CHART_NAME from $CHART_TPL for all available $SEMVERSIONS
helm/chart/clean                    Clean chart packages
helm/chart/create                   Create chart $CHART from starter scaffold
helm/chart/publish                  Publish chart $CHART_NAME to $REPO_GATEWAY_ENDPOINT
helm/chart/starter/fetch            Fetch starter
helm/chart/starter/remove           Remove starter
helm/chart/starter/update           Update starter
helm/install                        Install helm
helm/repo/add                       Add $REPO_NAME from $REPO_ENDPOINT
helm/repo/add-current               Add helm remote dev repos
helm/repo/add-remote                Add helm remote repos
helm/repo/build                     Build repo
helm/repo/clean                     Clean helm repo
helm/repo/fix-perms                 Fix repo filesystem permissions
helm/repo/info                      Show repo info
helm/repo/lint                      Lint charts
helm/repo/update                    Update repo info
helm/serve/index                    Build index for serve helm charts
help                                This help screen
jenkins/run-job-with-tag            Run a Jenkins Job with $(TAG)
make/lint                           Lint all makefiles
readme                              Alias for readme/build
readme/build                        Create README.md by building it from .README.md file
readme/init                         Create basic minimalistic .README.md template file
readme/toc-update                   Update table of contents in README.md
semver/export                       Export semver vars
semver/show                         Show
stages/export                       Export stages vars
template/build                      Create $OUT file by building it from $IN template file
template/deps                       Install dependencies
terraform/get-modules               Ensure all modules can be fetched
terraform/get-plugins               Ensure all plugins can be fetched
terraform/install                   Install terraform
terraform/lint                      Lint check Terraform
terraform/validate                  Basic terraform sanity check
travis/docker-login                 Login into docker hub
travis/docker-tag-and-push          Tag & Push according Travis environment variables
```
