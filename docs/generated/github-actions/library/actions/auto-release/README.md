---
title: auto-release
sidebar_label: auto-release
sidebar_class_name: command
description: |-
  This is an opinionated composite Github Action that implements a workflow based on the popular `release-drafter` action to automatically draft releases with release notes that are derived from PR descriptions as they are merged into the default branch. ```

  Under default settings, `auto-release` will also cut a new release from the default branch after every merge into it. However, releases are not cut for merges of pull requests with a `no-release` label attached. In that case, the release notes are left as a draft and a release with all unreleased changes will be made the next time a pull request without the `no-release` label is merged into the default branch.
custom_edit_url: https://github.com/cloudposse/github-action-auto-release/blob/main/README.yaml
---

# GitHub Action: `auto-release`
This is an opinionated composite Github Action that implements a workflow based on the popular `release-drafter` action to automatically draft releases with release notes that are derived from PR descriptions as they are merged into the default branch. ```

Under default settings, `auto-release` will also cut a new release from the default branch after every merge into it. However, releases are not cut for merges of pull requests with a `no-release` label attached. In that case, the release notes are left as a draft and a release with all unreleased changes will be made the next time a pull request without the `no-release` label is merged into the default branch.






## Usage

Copy the `.github/workflows/auto-release.yml` and `.github/configs/release-drafter.yml` files from this repository into the corresponding folders of the repository to which you'd like to add Auto-release functionality.
This will trigger the `auto-release` functionality every time merges are made into the default branch.

## Quick Start

Here's how to get started...
1. Copy the `.github/workflows/auto-release.yml` github action workflow from this repository into the corresponding folder of the target repo
2. Copy the `.github/configs/release-drafter.yml` auto-release config file from this repository into the corresponding folder of the target repo
3. Customize the config file as desired, per the [config documentation](https://github.com/release-drafter/release-drafter#configuration)


## Examples

Here's a real world example:
- [`github-action-auto-release`](https://github.com/cloudposse/github-action-auto-release/.github/workflows/auto-release.yml) - The self-testing Cloud Posse Auto-format GitHub Action



<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| config-name | If your workflow requires multiple release-drafter configs it is helpful to override the config-name.<br/>The config should still be located inside `.github` as that's where we are looking for config files.<br/> | configs/draft-release.yml | false |
| latest | A string indicating whether the release being created or updated should be marked as latest.<br/> |  | false |
| prerelease | Boolean indicating whether this release should be a prerelease |  | false |
| publish | Whether to publish a new release immediately | false | false |
| summary-enabled | Enable github action summary. | true | false |
| token | Standard GitHub token (e.g., secrets.GITHUB\_TOKEN) | ${{ github.token }} | false |


## Outputs

| Name | Description |
|------|-------------|
| body | The body of the drafted release. |
| exists | Tag exists so skip new release issue |
| html\_url | The URL users can navigate to in order to view the release |
| id | The ID of therelease that was created or updated. |
| major\_version | The next major version number. For example, if the last tag or release was v1.2.3, the value would be v2.0.0. |
| minor\_version | The next minor version number. For example, if the last tag or release was v1.2.3, the value would be v1.3.0. |
| name | The name of the release |
| patch\_version | The next patch version number. For example, if the last tag or release was v1.2.3, the value would be v1.2.4. |
| resolved\_version | The next resolved version number, based on GitHub labels. |
| tag\_name | The name of the tag associated with the release. |
| upload\_url | The URL for uploading assets to the release, which could be used by GitHub Actions for additional uses, for example the @actions/upload-release-asset GitHub Action. |
<!-- markdownlint-restore -->

