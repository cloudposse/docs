---
title: jq
sidebar_label: jq
sidebar_class_name: command
description: |-
  Process a input with a jq script and output result as step output
tags:
  - github-action
  - jq

custom_edit_url: https://github.com/cloudposse/github-action-jq/blob/main/README.yaml
---

# GitHub Action: `jq`
Process a input with a jq script and output result as step output






## Usage

```yaml
  name: github-action-jq
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    example:
      outputs:
        result: "${{ steps.current.outputs.output }}"
      steps:
        - uses: cloudposse/github-action-jq@main
          id: current
          with:
            compact: true
            input: '["test", "test2", "test3"]'
            script: |-
              map(select(. == "test"))
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| compact | Compact instead of pretty-printed output | false | false |
| input | JSON file or JSON formatted string | N/A | true |
| raw-output | Output raw strings, not JSON texts | false | false |
| remove-trailing-newline | Remove trailing newline | true | false |
| script | JQ query string | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| output | Output from the jq command |
<!-- markdownlint-restore -->

