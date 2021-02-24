---
title: Automated Testing
description: 'Our automated testing strategy and resources'
---

## Terraform Testing

Nearly all of our Terraform modules are updated with automated tests. We have 2 general strategies. First is by running some [`bats`](https://github.com/bats-core/bats-core) tests that do some basic sanity checks.
These tests are defined in our [`test-harness`](https://github.com/cloudposse/test-harness) and generally don't require any credentials to run. Since that's the case, they can really only do basic linting and static analysis.

Then we have some tests which are based on the [`terratest`](https://github.com/gruntwork-io/terratest) library for infrastructure testing that do more in-depth integration tests of module functionality.

## Philosophy of Testing

Here's our philosophy on infrastructure testing. At a minimum, we like to test to ensure that all of our modules cleanly `plan`, `apply` and `destroy`. This catches 80% of the problems with only 20% of the effort. We also want to test that the outputs are what we would expect. On the other hand, we don't want to retest what already is tested by HashiCorp in their providers. So for example, we have our [`terraform-aws-s3-bucket`](https://github.com/cloudposse/terraform-aws-s3-bucket) module that creates an S3 bucket. We don't need to test that a bucket is created; we assume that would be caught by the upstream terraform tests. But we do want to [test that the bucket name](https://github.com/cloudposse/terraform-aws-s3-bucket/blob/master/test/src/examples_complete_test.go#L38) is what we expect it to be, since this is an opinionated aspect of the module.

## About ChatOps

We've setup some basic "ChatOps" style functionality to run tests. This is required in order to securely run infrastructure integration tests without exposing integration secrets.  More than this, it's a [hard limitation
imposed by GitHub](https://www.google.com/search?q=github.community+run+on+forks+secrets) and the only way we can run the tests from Pull Requests originating from forks.

Our tests run against some [testing infrastructure](https://github.com/cloudposse/testing.cloudposse.co) that we host in an isolated account on AWS, strictly for the purposes of testing infrastructure.

Our ChatOps is powered by [GitHub Actions](https://github.com/features/actions) and the [slash-dispatch-command](https://github.com/peter-evans/slash-command-dispatch).

The workflow is defined in the [`cloudposse/actions`](https://github.com/cloudposse/actions/blob/master/.github/workflows/test-command.yml) repository. The benefit with this is we have one place to control the testing
workflow for all of our hundreds of terraform modules. The downside, however, with dispatched workflows is that the _workflows_ always run from the `master` branch.


## ChatOps Usage

To run the tests, you'll need to issue some commands by posting GitHub comments on the PR. You can use any of the following to perform tests or run certain actions:


| Command                                             | Description                                                                        |
|-----------------------------------------------------|------------------------------------------------------------------------------------|
| `/test bats`                                        | Run bats automated tests                                                           |
| `/test readme`                                      | Verify the `README.md` is current and updated from `README.yaml`                   |
| `/test terratest`                                   | Run the `terratest` integration tests in `test/src`                                |
| `/test all`                                         | Run `readme`, `bats`, and `terratest` tests                                        |
| `/test bats readme`, `/test readme terratest`, etc. | Run any combination of `/test` commands from one comment.                          |
| `/rebuild-readme`                                   | Run `make init && make readme` on the current code and commit it back to the repo. |
| `/terraform-fmt`                                    | Run `terraform fmt` on the current code and commit it back to the repo.            |


All tests run from the [`cloudposse/actions`](https://github.com/cloudposse/actions/actions) repository.


## ChatOps Configuration

If you're a contributor who wants to intialize one of our terraform modules, this is the process. Note, if a repo has already been configured for chatops, there's no need to proceed with these steps.

To initialize one of our modules with chatops, run the following commands:

1. `git clone` the terraform module repository
2. `cd $repo` to enter the repository directory
3. `make init` to initialize the build-harness
4. `make github/init` to write all the scaffolding
5. `git add *` to add the changes
6. `git rm -rf codefresh/` to remove legacy codefresh pipelines no longer needed
7. Add the build badge to the `README.yaml` under the `badges` section. Also, remove any Codefresh badge, since that's also no longer needed
8. `make readme` to rebuild the `README.md` (remember, never edit the `README.md` manually since it's generated from the `README.yaml`)
9. Open up a Pull Request with the changes. Here is a [good example](https://github.com/cloudposse/terraform-github-repository-webhooks/pull/17).
10. Request a Code Review in the [`#pr-reviews`](https://slack.cloudposse.com) Slack channel (and *big* thanks for your contribution!)
