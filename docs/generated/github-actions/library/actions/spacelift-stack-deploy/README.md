---
title: spacelift-stack-deploy
sidebar_label: spacelift-stack-deploy
sidebar_class_name: command
description: |-
  Trigger Spacelist stack synchronously
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-spacelift-stack-deploy/blob/main/README.yaml
---

# GitHub Action: `spacelift-stack-deploy`
Trigger Spacelist stack synchronously




## Introduction

[Spacelift](https://spacelift.io) is a sophisticated, continuous integration 
and deployment (CI/CD) platform for infrastructure-as-code. 
The GitHub action triggers Spacelift stack run to provistion infrastructure.



## Usage

```yaml
  name: github-action-spacelift-stack-deploy
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    infrastructure:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-spacelift-stack-deploy@main
          id: spacelift
          with:
            stack: eks-cluster
            github_token: ${{ secrets.PUBLIC_REPO_ACCESS_TOKEN }}
            organization: acme
            api_key_id: ${{ secrets.SPACELIFT_API_KEY_ID }}
            api_key_secret: ${{ secrets.SPACELIFT_API_KEY_SECRET }}

      outputs:
         outputs: ${{ steps.spacelift.outputs.outputs }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| api\_key\_id | API Key ID | N/A | true |
| api\_key\_secret | API Key Secret | N/A | true |
| github\_token | GitHub Token (Required to install Spacelift CLI) | N/A | true |
| organization | Organization name | N/A | true |
| stack | Stack name | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| outputs | Stack outputs |
<!-- markdownlint-restore -->

