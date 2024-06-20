---
title: atmos-terraform-drift-detection
sidebar_label: atmos-terraform-drift-detection
sidebar_class_name: command
description: |-
  This Github Action is used to detect drift
tags:
  - github-action
  - atmos
  - terraform

custom_edit_url: https://github.com/cloudposse/github-action-atmos-terraform-drift-detection/blob/main/README.yaml
---

# GitHub Action: `atmos-terraform-drift-detection`
This Github Action is used to detect drift




## Introduction

This Github Action is used to detect drift.

It will create or update github issue once drift is detect.

It is expected to run this action in a workflow with a scheduled run.

There is another companion action [github-action-atmos-terraform-drift-remediation](https://github.com/cloudposse/github-action-atmos-terraform-drift-remediation).



## Usage

### Workflow example

```yaml
  name: github-action-atmos-terraform-drift-detection

  on:
    schedule:
      - cron: "0 * * * *"

  permissions:
    id-token: write
    contents: write
    issues: write

  jobs:
    select-components:
      runs-on: ubuntu-latest
      name: github-action-atmos-terraform-drift-detection
      outputs:
        matrix: ${{ steps.components.outputs.matrix }}
      steps:
        - name: github-action-atmos-terraform-drift-detection
          id: components
          uses: cloudposse/github-action-atmos-terraform-select-components@v0
          with:
            jq-query: 'to_entries[] | .key as $parent | .value.components.terraform | to_entries[] | select(.value.settings.github.actions_enabled // false) | [$parent, .key] | join(",")'
            debug: ${{ env.DEBUG_ENABLED }}

    plan-atmos-components:
      needs:
        - select-components
      runs-on: ubuntu-latest
      if: ${{ needs.select-components.outputs.matrix != '{"include":[]}' }}
      strategy:
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(needs.select-components.outputs.matrix) }}
      name: github-action-atmos-terraform-drift-detection
      env:
        GITHUB_TOKEN: "${{ github.token }}"
      steps:
        - name: github-action-atmos-terraform-drift-detection
          id: atmos-plan
          uses: cloudposse/github-action-atmos-terraform-plan@v0
          with:
            component: ${{ matrix.component }}
            stack: ${{ matrix.stack }}
            component-path: ${{ matrix.component_path }}
            drift-detection-mode-enabled: "true"
            terraform-plan-role: "arn:aws:iam::111111111111:role/acme-core-gbl-identity-gitops"
            terraform-state-bucket: "acme-core-ue2-auto-gitops"
            terraform-state-role: "arn:aws:iam::999999999999:role/acme-core-ue2-auto-gitops-gha"
            terraform-state-table: "acme-core-ue2-auto-gitops"
            aws-region: "us-east-2"

    drift-detection:
      needs:
        - plan-atmos-components
      runs-on: ubuntu-latest
      steps:
        - name: github-action-atmos-terraform-drift-detection
          uses: cloudposse/github-action-atmos-terraform-drift-detection@v0
          with:
            max-opened-issues: '3'
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| assignee-teams | Comma-separated list of teams to assign issues to. You have to pass github token with `read:org` scope. This is used only when issue is getting created. |  | false |
| assignee-users | Comma-separated list of users to assign issues to. This is used only when issue is getting created. |  | false |
| labels | Comma-separated list of additional labels to assign issues to. |  | false |
| max-opened-issues | Number of open drift detection issues. Use `-1` to open unlimited number of issues. Default: 10 | 10 | false |
| process-all | Process all issues or only the ones that relates to affected stacks. Default: false | false | false |
| token | Used to pull node distributions for Atmos from Cloud Posse's GitHub repository. Since there's a default, this is typically not supplied by the user. When running this action on github.com, the default value is sufficient. When running on GHES, you can pass a personal access token for github.com if you are experiencing rate limiting. | ${{ github.server\_url == 'https://github.com' && github.token \|\| '' }} | false |


<!-- markdownlint-restore -->

