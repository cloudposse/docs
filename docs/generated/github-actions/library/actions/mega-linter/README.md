---
title: mega-linter
sidebar_label: mega-linter
sidebar_class_name: command
description: |-
  Template repository of composite GitHub Action
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-mega-linter/blob/main/README.yaml
---

# GitHub Action: `mega-linter`
Template repository of composite GitHub Action




## Introduction

This is template repository to create composite GitHub Actions. 
Feel free to use it as reference and starting point.



## Usage

```yaml
  name: github-action-mega-linter
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-mega-linter
          uses: cloudposse/example-github-action-composite@main
          id: example
          with:
            param1: true

      outputs:
        result: ${{ steps.example.outputs.result1 }}
```






<!-- markdownlint-disable -->
## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| param1 | Input parameter placeholder | true | true |

## Outputs

| Name | Description |
|------|-------------|
| result1 | Output result placeholder |
<!-- markdownlint-restore -->

