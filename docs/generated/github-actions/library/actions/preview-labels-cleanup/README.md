---
title: preview-labels-cleanup
sidebar_label: preview-labels-cleanup
sidebar_class_name: command
description: |-
  Remove labels used to control deployments with [github-action-preview-environment-controller](https://github.com/cloudposse/github-action-preview-environment-controller)
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-preview-labels-cleanup/blob/main/README.yaml
---

# GitHub Action: `preview-labels-cleanup`
Remove labels used to control deployments with [github-action-preview-environment-controller](https://github.com/cloudposse/github-action-preview-environment-controller)




## Introduction

On close a pull request we need to cleanup all labels  that specify a preview environments where the PR was deployed.
This GitHub action integrates with [github-action-preview-environment-controller](https://github.com/cloudposse/github-action-preview-environment-controller) action



## Usage

```yaml
  name: github-action-preview-labels-cleanup
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-preview-labels-cleanup
          uses: cloudposse/github-action-preview-environment-controller@v0.7.0
          id: controller
          with:
            labels: ${{ toJSON(github.event.pull_request.labels.*.name) }}
            open: ${{ github.event.pull_request.state == 'open' }}
            env-label: |
              preview: deploy
  
      outputs:
        labels_env: ${{ steps.controller.outputs.labels_env }}

    destroy:
      runs-on: ubuntu-latest
      if: ${{ github.event.pull_request.state != 'open' }}
      needs: [ context ]
      steps:      
        - name: github-action-preview-labels-cleanup
          uses: cloudposse/github-action-preview-labels-cleanup
          with:
            labels_env: ${{ needs.context.outputs.labels_env }}
            env: preview
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| env | Environment | N/A | true |
| labels\_env | JSON formatted {label}: {environment} map  | {} | true |
| pr\_number | The number of the pull request, which will default to extracting from the workflow event if not specified. | N/A | false |


## Outputs

| Name | Description |
|------|-------------|
<!-- markdownlint-restore -->

