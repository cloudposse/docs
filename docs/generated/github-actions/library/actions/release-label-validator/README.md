---
title: release-label-validator
sidebar_label: release-label-validator
sidebar_class_name: command
description: |-
  This GitHub Action validates that the major label is only assigned to Pull Requests targeting the default branch, enhancing the management of significant changes.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-release-label-validator/blob/main/README.yaml
---

# GitHub Action: `release-label-validator`
This GitHub Action validates that the major label is only assigned to Pull Requests targeting the default branch, enhancing the management of significant changes.




## Introduction

This is a GitHub Action to validate that only Pull Requests targeting the default branch can have the `major` label set. This is useful in combination with the [`release-drafter`](https://github.com/release-drafter/release-drafter) and the Cloud Posse [`release-branch-manager`](https://github.com/cloudposse/github-action-release-branch-manager) GitHub Actions,  to ensure the `major` label can only be assigned to Pull Requests created against the default branch, ensuring that significant changes are clearly identified and properly managed.



## Usage

```yaml
  name: github-action-release-label-validator

  on:
    pull_request:
      types:
        - labeled
        - unlabeled
        - opened
        - synchronize
        - reopened

  jobs:
    validate:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-release-label-validator@v1
```






<!-- markdownlint-disable -->



<!-- markdownlint-restore -->

