---
title: wait-commit-status
sidebar_label: wait-commit-status
sidebar_class_name: command
description: |-
  Wait for commit status
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-wait-commit-status/blob/main/README.yaml
---

# GitHub Action: `wait-commit-status`
Wait for commit status




## Introduction

Checks GitHub API for a given commit and look the commit status.



## Usage

```yaml
  name: github-action-wait-commit-status
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-wait-commit-status
          uses: cloudposse/github-action-wait-commit-status@main
          with:
            repository: ${{ github.repository }}
            sha: ${{ github.sha }}
            status: continuous-delivery/example-app
            lookup: "success"
            token: ${{ github.token }}
            check-timeout: 120
            check-retry-count: 5
            check-retry-interval: 20
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| check-retry-count | Check retry count | 5 | false |
| check-retry-interval | Check retry interval (in seconds) | 10 | false |
| expected\_state | Commit status state wait for. Valid values 'success', 'error', 'failure', 'pending' | success | false |
| repository | Repository | N/A | true |
| sha | Commit SHA | N/A | true |
| status | Commit status name | N/A | true |
| token | Github authentication token | ${{ github.token }} | false |


<!-- markdownlint-restore -->

