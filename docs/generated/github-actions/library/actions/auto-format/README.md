---
title: auto-format
sidebar_label: auto-format
sidebar_class_name: command
description: |-
  Github Action Auto-Format runs several repository "hygiene" tasks for repositories:
  - The `readme` target will rebuild `README.md` from `README.yaml`.
  - The `github_format` target adds all of Cloud Posse's standard repository housekeeping files (including GitHub Actions workflows) to the repository's `.github` folder.
  - The `terraform_format` target ensures consistent formatting across all Terraform files in the repository.
custom_edit_url: https://github.com/cloudposse/github-action-auto-format/blob/main/README.yaml
---

# GitHub Action: `auto-format`
Github Action Auto-Format runs several repository "hygiene" tasks for repositories:
- The `readme` target will rebuild `README.md` from `README.yaml`.
- The `github_format` target adds all of Cloud Posse's standard repository housekeeping files (including GitHub Actions workflows) to the repository's `.github` folder.
- The `terraform_format` target ensures consistent formatting across all Terraform files in the repository.






## Usage

If you haven't already, follow the steps in the [quickstart](#quickstart) section.
To choose which pieces of functionality will be executed, modify the `script-names:` input to the `cloudposse/github-action-auto-format` step to be a comma-separated list of one or more targets (e.g., `script-names: readme,terraform_format,github_format`).
This is an exhaustive list of all valid `script-name`s:
  - `readme`
  - `github_format`
  - `terraform_format`
If you're using the `auto-format.yml` workflow file distributed within this repository, then the Auto-format GitHub Action will trigger on pull request events, once a day at 7am UTC, and upon manual triggering via the `workflow_dispatch` mechanism.

## Quick Start

Here's how to get started...
1. Copy `.github/workflows/auto-format.yml` to the corresponding folder in your target repo.
2. Generate a Personal Access Token (PAT) that with the `workflow` permission *using a GitHub account that has  `write` permissions in the target repo* by following the directions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and selecting the `workflow` tick box on the token creation screen.
3. Add this token as a GitHub secret in your target repository and set the `workflow-token` input of the `github-action-auto-format` step to the name of your secret.
4. Set the `bot-name` input of the `github-action-auto-format` step to the GitHub username of the user who generated the token in step 2. *This user must have `write` permissions in the target repo.`
5. By default, the Auto-Format GitHub Action will execute all of its scripts when run. If you'd like to use a subset of the full functionality, modify the `script-names` input of the `github-action-auto-format` step as described in the [usage](#usage) section.
6. (Optional) You may want to change when the scheduled cron trigger is executed. If you'd like a guide, here's a useful resource for help in crafting cron strings - https://crontab.guru/
7. (Optional) CloudPosse recommends pinning to specific versions of actions for ease of long-term maintenance. If you care to edit the pin in `auto-format.yml` from `main` to a specific version, feel free to consult https://github.com/cloudposse/github-action-auto-format/releases for a list of available versions.


## Examples

Here's a real world example:
- [`github-action-auto-format`](https://github.com/cloudposse/github-action-auto-format/.github/workflows/auto-format.yml) - Cloud Posse's self-testing Auto-Format GitHub Action



