---
title: Contributor How-Tos
description: ''
---

## About

This document is intended to describe common and not-so-common processes that the contributor team executes as part of maintaining the 300+ open source projects within the Cloud Posse Organization.


## How-Tos

### Update Many Repos

To update many of the open source repos with a common change such as updating Terraform `required_version` pinning, adding GitHub actions, or updating pinned providers, the contributor team has adopted using [microplane](https://github.com/Clever/microplane). This tool allows us to execute automated changes across dozens or even hundreds of our open source repos, which saves many man hours of contributor time.

Here is a standard usage pattern that contributors can adopt to specific changes as they see fit:

1. [Download the microplane binary from their releases page](https://github.com/Clever/microplane/releases)
1. Open your terminal, rename and add the downloaded binary into your $PATH, and add execution privileges to the binary.
   1. `mv ~/Downloads/mp-0.0.21-darwin-amd64 /usr/local/bin/mp && chmod 755 /usr/local/bin/mp`
1. Add a [GH Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to your shells environment variables under the variable `GITHUB_API_TOKEN`:
   1. `export GITHUB_API_TOKEN=$YOUR_TOKEN`
1. Change to an empty directory that you can use as a scratch workspace for your Many Repos change:
   1. `mkdir ~/mp_workspace && cd ~/mp_workspace`
1. Init microplane - Finds all of the CloudPosse public projects and creates an `mp/` folder and an `mp/init.json` file describing them.
   1. `mp init --all-repos "cloudposse"`
   1. NOTE: microplane supposedly has the ability to search against an organization and narrow the returned repos that end up in `init.json`, but that functionality seems buggy and not working.
1. Manually edit `mp/init.json` to include only the repos which you want to make changes against.
   1. Your editor's multi-select edit capabilities are your friend here.
   1. Duplicate the original `init.json` so you don't need to re-run `mp init` in the case that you want to start fresh.
1. Run microplane clone to pull all of the repos specified in `init.json` down to your local machine for mass changes.
   1. `mp clone`
1. Create a bash script to facilitate the changes that you're attempting to make against the many repos you've specified.
   1. Use the microplane `-r` or `--repo` flag to operate on a single repo for testing your script prior to doing it across all repos.
   1. Go through the full microplane process (explained in the following steps) for this single repo test-run and get it signed off by the other CloudPosse contributors to ensure everyone agrees with the change prior to making it across the many repos that you're targetting.
1. Once you've got a script that is working like you expect, you can run the `mp plan` step. This step executes the given script across all the repos specified in `init.json` and then commits the result. You should format your `mp plan` command as follows:
    > mp plan -b $YOUR_BRANCH_NAME -m "[AUTOMATED] $YOUR_PR_TITLE
    >
    > ## What
    >
    > 1. $INFO_ON_YOUR_CHANGE_NUMBER_ONE
    > 1. $INFO_ON_YOUR_CHANGE_NUMBER_TWO
    >
    > ## Why
    >
    > 1. $INFO_ON_WHY_YOU_MADE_YOUR_CHANGE_NUMBER_ONE
    > 1. $INFO_ON_WHY_YOU_MADE_YOUR_CHANGE_NUMBER_TWO" \
    > -- \
    > sh -c $PWD/$YOUR_SCRIPT_NAME.sh
1. Verify one of the repos that you're updating exemplifies the changes you're trying to make:
   1. `cd mp/terraform-aws-tfstate-backend/plan/planned/`
   1. `git show`
   1. Confirm the changes and commit message that you see are what you want to push.
1. If everything looks legit, ship it:
   1. `mp push -a $YOUR_GITHUB_USERNAME`

That should cycle through all of the repos in `init.json` and pushing them to the branch you specified and creating a PR against the `master` branch. Now go forth and run `/test all` against all of those PRs and ask some kind soul to help you get them merged 😎.
