---
title: release-branch-manager
sidebar_label: release-branch-manager
sidebar_class_name: command
description: |-
  GitHub Action for Managing Release Branches
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-release-branch-manager/blob/main/README.yaml
---

# GitHub Action: `release-branch-manager`
GitHub Action for Managing Release Branches




## Introduction

This GitHub Action adopts a streamlined approach to managing release branches, drawing on a trunk-based branching strategy. In this model, the `DEFAULT_BRANCH` consistently represents the most recent release, while release branches are exclusively created for previous major releases, if applicable. This structure simplifies the process for contributors when submitting Pull Requests for bug fixes or backporting modifications to older releases, as it enables them to target a specific major release.

**How it works:** upon publishing a new major release `N`, a corresponding branch for the previous release `N-1` will be automatically generated.

Imagine you have tags like this in your repo:

```
0.1.0
0.2.0
1.0.0
1.1.0
1.2.0
1.2.1
2.0.0
2.1.0
2.2.0
3.0.0
3.1.0   main
```

Upon the first release published event, the "release branch manager" will generate new branches named `release/vN-1`, where N corresponds to the latest tag of each major release. In this case, several new branches will be created:

```
0.1.0
0.2.0   release/v0
1.0.0
1.1.0
1.2.0
1.2.1   release/v1
2.0.0
2.1.0
2.2.0   release/v2
3.0.0
3.1.0   main
```

Note that `3.1.0` is latest tag and release branch manager wouldn't create release branch because latest major release is maintained in `main` branch.

If you wish to make changes to `2.2.0`, you must create a pull request for the `release/v2` branch and generate a corresponding release/tag with a major version of `2`, for example, `2.3.0`.

This action requires GitHub releases to follow the [SemVer versioning](https://semver.org/) scheme.



## Usage

Example of workflow that that will create major release tags. To use it, just add this workflow to your `.github/workflows` directory. 

```yaml
  name: github-action-release-branch-manager

  on:
    release:
      types:
        - published

  jobs:
    publish:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-release-branch-manager@v1
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| dry-run | Run action without pushing changes to upstream | false | false |
| git-user-email | Git user email that will be used for git config | actions-bot@users.noreply.github.com | false |
| git-user-name | Git user name that will be used for git config | actions-bot | false |
| log-level | Log level for this action. Available options: ['off', 'error', 'warn', 'info', 'debug']. Default 'info' | info | false |
| minimal-version | Minimal 'major' version that release branch creation should start from | 0 | false |
| token | GitHub Token used to perform git and GitHub operations | ${{ github.token }} | false |


## Outputs

| Name | Description |
|------|-------------|
| response | Response in json format for example: {"succeeded":true,"reason":"CREATED\_BRANCHES","message":"Successfully created release branches","data":{"release/v3":"3.1.0","release/v2":"2.0.0","release/v1":"1.1.0"}} |
<!-- markdownlint-restore -->

