---
title: setup-atmos
sidebar_label: setup-atmos
sidebar_class_name: command
description: |-
  Install atmos for use in GitHub Actions
tags:
  - github-action
  - atmos

custom_edit_url: https://github.com/cloudposse/github-action-setup-atmos/blob/main/README.yaml
---

# GitHub Action: `setup-atmos`
Install atmos for use in GitHub Actions




## Introduction

This repo contains a GitHub Action to setup [atmos](https://github.com/cloudposse/atmos) for use in GitHub Actions. It 
installs the specified version of atmos and adds it to the `PATH` so it can be used in subsequent steps. In addition, 
it optionally installs a wrapper script that will capture the `stdout`, `stderr`, and `exitcode` of the `atmos` 
command and make them available to subsequent steps via outputs of the same name.



## Usage

```yaml
steps:
  - uses: hashicorp/setup-terraform@v2
  
  - name: github-action-setup-atmos
    uses: cloudposse/github-action-setup-atmos@v2
````

To install a specific version of atmos, set the `version` input:

```yaml
steps:
  - uses: hashicorp/setup-terraform@v2

  - name: github-action-setup-atmos
    uses: cloudposse/github-action-setup-atmos@v2
    with:
      version: 0.15.0
````

The wrapper script installation can be skipped by setting the `install-wrapper` input to `false`:

```yaml
steps:
  - uses: hashicorp/setup-terraform@v2

  - name: github-action-setup-atmos
    uses: cloudposse/github-action-setup-atmos@v2
    with:
      install-wrapper: false
````

Subsequent steps of the GitHub action can use the wrapper scipt to capture the `stdout`, `stderr`, and `exitcode` if 
the wrapper script was installed:

```yaml
steps:
  - uses: hashicorp/setup-terraform@v2

  - name: github-action-setup-atmos
    uses: cloudposse/github-action-setup-atmos@v2
    with:
      install-wrapper: true

  - name: github-action-setup-atmos
    id: atmos
    run: atmos terraform plan

  - run: echo ${{ steps.atmos.outputs.stdout }}
  - run: echo ${{ steps.atmos.outputs.stderr }}
  - run: echo ${{ steps.atmos.outputs.exitcode }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| atmos-version | Version Spec of the version to use. Examples: 1.x, 10.15.1, >=10.15.0. | latest | false |
| install-wrapper | Flag to indicate if the wrapper script will be installed to wrap subsequent calls of the `atmos` binary and expose its STDOUT, STDERR, and exit code as outputs named `stdout`, `stderr`, and `exitcode` respectively. Defaults to `true`. | true | false |
| token | Used to pull atmos distributions from Cloud Posse's GitHub repository. Since there's a default, this is typically not supplied by the user. When running this action on github.com, the default value is sufficient. When running on GHES, you can pass a personal access token for github.com if you are experiencing rate limiting. | ${{ github.server\_url == 'https://github.com' && github.token \|\| '' }} | false |


## Outputs

| Name | Description |
|------|-------------|
| atmos-version | The installed atmos version. |
<!-- markdownlint-restore -->

