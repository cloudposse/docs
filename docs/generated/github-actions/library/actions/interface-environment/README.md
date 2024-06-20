---
title: interface-environment
sidebar_label: interface-environment
sidebar_class_name: command
description: |-
  Get Environments settings from private settings action provider
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-interface-environment/blob/main/README.yaml
---

# GitHub Action: `interface-environment`
Get Environments settings from private settings action provider




## Introduction

Get Environments settings from private settings action provider. 



## Usage

```yaml
  name: github-action-interface-environment
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-interface-environment
          uses: cloudposse/example-github-action-composite@main
          id: environment
          with:
            implementation_repository: cloudposse/actions-private
            implementation_path: environments
            implementation_ref: main
            implementation_github_pat: ${{ secrets.GITHUB_REPO_ACCESS_TOKEN }}
            environment: dev
            namespace: dev      

      outputs:
        name: github-action-interface-environment
        region: "${{ steps.environment.outputs.region }}"
        role: "${{ steps.environment.outputs.role }}"
        cluster: "${{ steps.environment.outputs.cluster }}"
        namespace: "${{ steps.environment.outputs.namespace }}"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| application | Application name | N/A | false |
| attributes | Comma separated attributes | N/A | false |
| environment | Environment name | N/A | true |
| implementation\_github\_pat | GitHub PAT allow fetch environment action implementation | N/A | true |
| implementation\_path | Repository path with Environment action implementation |  | true |
| implementation\_ref | Ref of environment action implementation | main | true |
| implementation\_repository | Repository with Environment action implementation | N/A | true |
| namespace | Namespace name | N/A | true |
| repository | Repository name | N/A | false |


## Outputs

| Name | Description |
|------|-------------|
| cluster | Environments that need to be destroyed |
| name | Environment name |
| namespace | Namespace |
| region | JSON formatted {label}: {environment} map |
| role | Environments that need to be deployed |
| ssm-path | Path to ssm secrets |
<!-- markdownlint-restore -->

