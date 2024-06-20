---
title: seek-deployment
sidebar_label: seek-deployment
sidebar_class_name: command
description: |-
  Get GitHub deployment object by ref and environment name
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-seek-deployment/blob/master/README.yaml
---

# GitHub Action: `seek-deployment`
Get GitHub deployment object by ref and environment name






## Usage

```yaml
  name: github-action-seek-deployment
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-seek-deployment
          uses: cloudposse/github-action-seek-deployment@main
          id: deployment
          with:
            github-token: ${{ secrets.GITHUB_TOKEN }}
            environment: dev
            ref: ${{ github.event.pull_request.head.ref }}
            status: success

      outputs:
        id: "${{ steps.deployment.outputs.id }}"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| environment | Environment name | N/A | true |
| github-token | The GitHub token | ${{ github.token }} | true |
| ref | Branch or commit SHA | N/A | true |
| status | Deployment status | N/A | false |


## Outputs

| Name | Description |
|------|-------------|
| id | Deployment ID |
<!-- markdownlint-restore -->

