---
title: "Proposed: Distribution Method for GitHub Actions"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1356660737/Proposed%3A+Distribution+Method+for+GitHub+Actions
sidebar_position: 200
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/proposed-distribution-method-for-github-actions.md
---

# Proposed: Distribution Method for GitHub Actions
**Date**: **22 Jun 2022**

:::warning Rejected!

The proposal in this ADR was rejected! For questions, please reach out to Cloud Posse.

- After this proposal was created, GitHub announced support for reusable workflows.

:::

## Status

**DRAFT**

## Problem

We need a reliable way to distribute GitHub Actions workflows to repos and keep these workflows up to date with any changes made to the GitHub Actions themselves. An example of such a workflow might be [https://github.com/cloudposse/github-action-ci-terraform/blob/main/.github/workflows/ci-terraform.yml](https://github.com/cloudposse/github-action-ci-terraform/blob/main/.github/workflows/ci-terraform.yml).
Here are 6 factors to keep in mind when designing a solution:

1. Customers (not just Cloud Posse) need to be able to use this solution to both initialize actions in their repos and update their actions later on.

2. We need our solution to be able to update all of our repos easily.

3. Not all repos need the same workflows; some repos might need all of our GitHub Actions workflows, but others might only need a subset. Our solution should distribute workflow files accordingly. (E.g., some actions might be specific to Terraform projects, and non-Terraform repos don’t need these.)

4. Our solution needs to include a (possibly, one-time) strategy for pushing out actions en masse to our Cloud Posse repos (e.g., git-xargs).

5. As a rule, too many PRs can be noisy, so ideally our solution will minimize the number of PRs needed to keep things up to date.

6. We want our solution to auto-merge PRs if the tests pass.

## Context

I, Dylan, have been writing a bunch of CI/CD-related GitHub Actions ([https://github.com/cloudposse/github-action-ci-terraform](https://github.com/cloudposse/github-action-ci-terraform), [https://github.com/cloudposse/github-action-auto-format](https://github.com/cloudposse/github-action-auto-format), [https://github.com/cloudposse/github-action-auto-release](https://github.com/cloudposse/github-action-auto-release), [https://github.com/cloudposse/github-action-validate-codeowners](https://github.com/cloudposse/github-action-validate-codeowners)) and other people, like @Igor Rodionov have been working on GitHub Actions, too. We need a reliable distribution and maintenance strategy for them in order for them to be usable. As it is now, the easiest way to add them to a repo is for someone to manually copy a workflow file from each action repo into the repo of interest. For maintenance, the state of the art is manually checking whether there have been updates to each GitHub Action repo. Needless to say, these strategies could be improved on.

## Considered Options

### Option 1: Pull distribution (w/ or w/o centralized workflow file repo)

The key here is creating a GitHub Action whose whole purpose is to distribute and keep current the workflows of all other GitHub Actions in all repos: `github-action-distributor`. (Very similar actions already exist, e.g., [https://github.com/marketplace/actions/repo-file-sync-action](https://github.com/marketplace/actions/repo-file-sync-action) and [https://github.com/marketplace/actions/push-a-file-to-another-repository](https://github.com/marketplace/actions/push-a-file-to-another-repository).) In this proposal, the `github-action-distributor` would copy all GitHub Actions workflows directly from their home repos (e.g., [https://github.com/cloudposse/github-action-validate-codeowners/blob/main/.github/workflows/validate-codeowners.yml](https://github.com/cloudposse/github-action-validate-codeowners/blob/main/.github/workflows/validate-codeowners.yml)) to their destination repos (e.g., [https://github.com/cloudposse/terraform-example-module](https://github.com/cloudposse/terraform-example-module)).

- **One-time, internal org-level distribution strategy:**

- Use a `git-xargs` command to distribute a GitHub Actions workflow for a `github-action-distributor`. The purpose of the `github-action-distributor` is to propagate all the appropriate GitHub Actions workflows to a repo and keep them up to date using a cron job.

- **Customer repo-level distribution strategy:**

- Customers can manually (or using a tool like `git-xargs`, I suppose) distribute the `github-action-distributor` workflow to each repository they would like to add GitHub Actions workflows to.

- **Internal and customer repo-level update strategy:**

- Whenever new a new version of a GitHub Actions workflow is released, a change can be made to the `github-action-distributor` (using `renovate.json` ideally, or manually) to distribute the new version of that workflow from now on, and this change will be reflected in all downstream repos the next time their `github-action-distributor` cron job runs. Alternatively, we can pin the version of the `github-action-distributor` action used in a given repo, so that the versions of all GitHub Actions workflows in that repo are known and stable.

There are two **variants** of this option, depending on whether we copy the workflow files for the GitHub Actions into their own repo:

1. We could have action maintainers manually copy the workflow file(s) for the action(s) they maintain to a centralized repo (e.g., `cloudposse/actions`) and have the `distributor` action pull whatever is in that repo into the end-user repos. In order to update what workflows are being distributed, someone would just copy new workflows to the centralized workflow repo.

2. We could have the `distributor` action pull workflows from their home repos (e.g., pulling `.github/workflows/auto-format.yml` from `cloudposse/github-action-auto-format`). In order to update what workflows are being distributed, someone would update the version tags that would be hardcoded into the `distributor` action.

**NB:** It should be possible to implement the `github-action-distributor` as just a piece of functionality within a larger, existing GitHub Action. For example, the `github` [target](https://github.com/cloudposse/github-action-auto-format/blob/main/scripts/github/format.sh) inside the `auto-format` action essentially fulfills this role right now by copying the desired workflows from the `cloudposse/.github` repo.

### Option 2: Push distribution (w/ or w/o centralized workflow file repo)

Similar to option 1 above, there would be a GitHub Action, `github-action-distributor`, whose purpose is to distribute GitHub Action workflow files to end-user repos. Also similar to Option 1, this action would be compatible with centralized and decentralized workflow organizational strategies (see “**variants**” above).

In this proposal, though, the `distributor` would behave differently. Instead of being added to each end-user repository (e.g., `cloudposse/terraform-aws-components`, `cloudposse/build-harness`, `cloudposse/atmos`, etc.), it would only run in one repository (the centralized workflow file repo, in the case where we use that strategy), or in a small number of repositories (each of the `github-action-*` repositories, if we decline to use a centralized workflow file repo). Whenever a workflow file is updated inside a repo that has the `distributor` action added, that updated workflow will be pushed out to either all `cloudposse/*` repos, or a logical subset of them, depending on the specific action. The net result is that PRs would be opened in the end-user repos and automatically merged, all by the `distributor` action.

This option comes with the advantage, relative to Option 1, of being much simpler for Cloud Posse to bootstrap, since the manual distribution of the `distributor` workflow file is limited to &lt; ~10 repos, enough to easily be done by hand. However, the bootstrapping process for third-parties would be non-existent. They would need to find their own methods, likely by implementing something like Option 1 for themselves.

### Option 3: Using internal GitHub functionality

It looks like there may be a way to distribute sample actions to an org’s repos via the `[org]/.github` repo, but this functionality is not well-documented, if it does exist, and even if it does, it probably requires opening a number of PRs on each repo to bootstrap. [If there is more interest in this, I (Dylan) can look into it further.)

One point worth noting is that this approach would lead to the same workflows being distributor to all (or nearly all) repos in the `cloudposse` GitHub org. This means that all actions/workflows need to detects early as possible whether they’re going to do anything useful on a given repo (e.g., running `terraform/fmt` would be completely unnecessary in a non-Terraform repo) and exit asap, to not tie up GitHub runners unnecessarily.

## Decision

**DECIDED**:

## Consequences

-

## References

-

-


