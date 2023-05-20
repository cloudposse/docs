---
title: Automated Testing
description: 'Our automated testing strategy and resources'
---

## Terraform Testing

All of our Terraform modules have automated tests. We have two sets of checks: 

- First set is running github shared workflow [`feature-branch`](https://github.com/cloudposse/github-actions-workflows-terraform-module/blob/main/.github/workflows/feature-branch.yml) 
which does basic sanity checks: linting, formatting and docs. These checks are cheap to run and do not require any special permissions, so we run them automatically on every commit.
You also can run this set of checks locally using ```make precommit/terraform``` command on your host.

- Second set runs terraform integration tests based on the [`terratest`](https://github.com/gruntwork-io/terratest) library for infrastructure testing that do more in-depth integration tests of module functionality.
These are run on request, and only by authorized contributors. We use ChatOps to trigger this workflow.


## Philosophy of Terraform Integration Testing

At a minimum, we like to test to ensure that all of our modules cleanly `plan`, `apply` and `destroy`. This catches 80% of the problems with only 20% of the effort. We also want to test that the outputs are what we would expect. On the other hand, we don't want to retest what already is tested by HashiCorp in their providers. So for example, we have our [`terraform-aws-s3-bucket`](https://github.com/cloudposse/terraform-aws-s3-bucket) module that creates an S3 bucket. We don't need to test that a bucket is created; we assume that would be caught by the upstream terraform tests. But we do want to [test that the bucket name](https://github.com/cloudposse/terraform-aws-s3-bucket/blob/master/test/src/examples_complete_test.go#L38) is what we expect it to be, since this is an opinionated aspect of the module.

## Using ChatOps To Trigger Integration Tests

In order to securely run terraform tests and save on infrastructure costs we've setup some basic "ChatOps" style functionality. To use it you will need to have at least `triage` level of access to a repo. Typically, this is done by a CloudPosse team upon PR review.

Tests are initiated by posting GitHub comments on the PR. Currently supported commands are the following:

| Command                                             | Description                                                                        |
|-----------------------------------------------------|------------------------------------------------------------------------------------|
| `/terratest`                                        | Run the `terratest` integration tests in `test/src`                                |


Terraform tests run against our [testing infrastructure](https://github.com/cloudposse/testing.cloudposse.co) that we host in an isolated account on AWS, strictly for the purposes of testing infrastructure.

ChatOps is powered by [GitHub Actions](https://github.com/features/actions) and the [slash-dispatch-command](https://github.com/peter-evans/slash-command-dispatch).

The terratest workflow is defined in the [`cloudposse/actions`](https://github.com/cloudposse/actions/blob/master/.github/workflows/terratest-command.yml) repository. The benefit with this is that we have one place to control the testing
workflow for all of our hundreds of terraform modules. The downside, however, with dispatched workflows is that the _workflows_ always run from the `main` branch.

## ChatOps Configuration

If you're a contributor who wants to intialize one of our terraform modules, this is the process. Note, if a repo has already been configured for chatops, there's no need to proceed with these steps.

To initialize one of our modules with chatops, run the following commands:

1. `git clone` the terraform module repository
1. `cd $repo` to enter the repository directory
1. `make init` to initialize the build-harness
1. `make github/init` to write all the scaffolding
1. `git add *` to add the changes
1. Add the build badge to the `README.yaml` under the `badges` section. 
1. `make readme` to rebuild the `README.md` (remember, never edit the `README.md` manually since it's generated from the `README.yaml`)
1. Open up a Pull Request with the changes. Here is a [good example](https://github.com/cloudposse/terraform-github-repository-webhooks/pull/17).
1. Request a Code Review in the [`#pr-reviews`](https://slack.cloudposse.com) Slack channel (and *big* thanks for your contribution!)
