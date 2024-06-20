---
title: major-release-tagger
sidebar_label: major-release-tagger
sidebar_class_name: command
description: |-
  GitHub Action that automatically generates or updates `v<major-release>` tags every time a new release is published.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-major-release-tagger/blob/main/README.yaml
---

# GitHub Action: `major-release-tagger`
GitHub Action that automatically generates or updates `v<major-release>` tags every time a new release is published.




## Introduction

This GitHub Action automatically generates or updates `v<major-release>` tags every time a new release is published, making it effortless to keep track of your project's major versions.

Imagine your Git repository has the following tags:

```
1.0.0
1.1.0
2.0.0
2.0.1
2.1.0
3.0.0
```

By simply incorporating Major Release Tagger, your repo will be enriched with the corresponding v-tags:

```
1.0.0
1.1.0    v1
2.0.0
2.0.1    v2
2.1.0
3.0.0    v3
```

When you create a new release tagged `3.1.0`, the `v3` tag will automatically point to it:

```
1.0.0
1.1.0    v1
2.0.0
2.0.1    v2
2.1.0
3.0.0
3.1.0    v3
```

Stay organized and efficient with Major Release Tagger - the ultimate GitHub Action to streamline your versioning process.



## Usage

```yaml
  name: github-action-major-release-tagger

  on:
    release:
      types:
        - published

  jobs:
    publish:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-major-release-tagger@v1
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| dry-run | Run action without pushing changes to upstream | false | false |
| git-user-email | Git user email that will be used for git config | actions-bot@users.noreply.github.com | false |
| git-user-name | Git user name that will be used for git config | actions-bot | false |
| log-level | Log level for this action. Available options: ['off', 'error', 'warn', 'info', 'debug']. Default 'info' | info | false |
| token | Standard GitHub token (e.g., secrets.GITHUB\_TOKEN) | ${{ github.token }} | false |


## Outputs

| Name | Description |
|------|-------------|
| response | Response in json format for example: {"succeeded":true,"reason":"MAPPED\_TAGS","message":"Successfully created/update v-tags.","data":{"v1": {"state":"updated", "oldSHA": "d9b3a3034766ac20294fd1c36cacc017ae4a3898", "newSHA":"e5c6309b473934cfe3e556013781b8757c1e0422"}, "v2": {"state":"created", "oldSHA": "bbf9f924752c61dcef084757bcf4440e23f2e16b", "newSHA":"5ae37ee514b73cf8146fe389ad839469e7f3a6d2"}}} |
<!-- markdownlint-restore -->

