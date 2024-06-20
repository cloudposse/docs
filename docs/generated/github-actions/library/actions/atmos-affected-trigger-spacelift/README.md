---
title: atmos-affected-trigger-spacelift
sidebar_label: atmos-affected-trigger-spacelift
sidebar_class_name: command
description: |-
  GitHub Action for Triggering Affected Spacelift Stacks
tags:
  - github-action
  - atmos
  - spacelift

custom_edit_url: https://github.com/cloudposse/github-action-atmos-affected-trigger-spacelift/blob/main/README.yaml
---

# GitHub Action: `atmos-affected-trigger-spacelift`
GitHub Action for Triggering Affected Spacelift Stacks




## Introduction

This repo contains a GitHub Action that determines the affected [Atmos](https://atmos.tools) stacks for a PR, then
creates a comment on the PR which Spacelift can use to trigger the corresponding stacks via a push policy.

Optionally, you can use the `spacectl` trigger method, which uses the `spacectl` CLI to trigger the corresponding
spacelift stacks directly rather than via comment/push policy.



## Usage

```yaml
  name: github-action-atmos-affected-trigger-spacelift
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-atmos-affected-trigger-spacelift
          uses: cloudposse/github-action-atmos-affected-trigger-spacelift@main
          id: example
          with:
            atmos-config-path: ./rootfs/usr/local/etc/atmos
            github-token: ${{ secrets.GITHUB_TOKEN }}

        - name: github-action-atmos-affected-trigger-spacelift
          uses: cloudposse/github-action-atmos-affected-trigger-spacelift@main
          id: example
          with:
            atmos-config-path: ./rootfs/usr/local/etc/atmos
            github-token: ${{ secrets.GITHUB_TOKEN }}
            trigger-method: spacectl
            spacelift-endpoint: https://unicorn.app.spacelift.io
            spacelift-api-key-id: ${{ secrets.SPACELIFT_API_KEY_ID }}
            spacelift-api-key-secret: ${{ secrets.SPACELIFT_API_KEY_SECRET }}

```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| atmos-config-path | A path to the folder where atmos.yaml is located | . | false |
| atmos-version | The version of atmos to install if install-atmos is true | latest | false |
| default-branch | The default branch to use for the base ref. | ${{ github.event.repository.default\_branch }} | false |
| deploy | A flag to indicate if a deployment should be triggered. If false, a preview will be triggered. | false | false |
| github-token | A GitHub token for running the spacelift-io/setup-spacectl action | N/A | true |
| head-ref | The head ref to checkout. If not provided, the head default branch is used. | N/A | false |
| install-atmos | Whether to install atmos | true | false |
| install-jq | Whether to install jq | false | false |
| install-spacectl | Whether to install spacectl | true | false |
| install-terraform | Whether to install terraform | true | false |
| jq-force | Whether to force the installation of jq | true | false |
| jq-version | The version of jq to install if install-jq is true | 1.6 | false |
| spacectl-version | The version of spacectl to install if install-spacectl is true | latest | false |
| spacelift-api-key-id | The SPACELIFT\_API\_KEY\_ID | N/A | false |
| spacelift-api-key-secret | The SPACELIFT\_API\_KEY\_SECRET | N/A | false |
| spacelift-endpoint | The Spacelift endpoint. For example, https://unicorn.app.spacelift.io | N/A | false |
| terraform-version | The version of terraform to install if install-terraform is true | latest | false |
| trigger-method | The method to use to trigger the Spacelift stack. Valid values are `comment` and `spacectl` | comment | false |


<!-- markdownlint-restore -->

