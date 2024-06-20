---
title: terratest
sidebar_label: terratest
sidebar_class_name: command
description: |-
  A GitHub Action to run Terratest tests and post the results as a build artifact.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-terratest/blob/main/README.yaml
---

# GitHub Action: `terratest`
A GitHub Action to run Terratest tests and post the results as a build artifact.






## Usage

```yaml
  name: github-action-terratest
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-terratest
          uses: cloudposse/github-action-terratest@main
          with:
            sourceDir: test/src
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| sourceDir | The directory containing the source code to test | . | true |


<!-- markdownlint-restore -->

