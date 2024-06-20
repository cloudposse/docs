---
title: atmos-terraform-drift-remediation
sidebar_label: atmos-terraform-drift-remediation
sidebar_class_name: command
description: |-
  This Github Action is used to remediate drift
tags:
  - github-action
  - atmos
  - terraform

custom_edit_url: https://github.com/cloudposse/github-action-atmos-terraform-drift-remediation/blob/main/README.yaml
---

# GitHub Action: `atmos-terraform-drift-remediation`
This Github Action is used to remediate drift




## Introduction

This action is used for drift remediation.

There is another companion action [github-action-atmos-terraform-drift-detection](https://github.com/cloudposse/github-action-atmos-terraform-drift-detection).



## Usage

### Config

The action expects the atmos configuration file `atmos.yaml` to be present in the repository.
The config should have the following structure:

```yaml
integrations:
  github:
    gitops:
      terraform-version: 1.5.2
      infracost-enabled: false
      artifact-storage:
        region: us-east-2
        bucket: cptest-core-ue2-auto-gitops
        table: cptest-core-ue2-auto-gitops-plan-storage
        role: arn:aws:iam::xxxxxxxxxxxx:role/cptest-core-ue2-auto-gitops-gha
      role:
        plan: arn:aws:iam::yyyyyyyyyyyy:role/cptest-core-gbl-identity-gitops
        apply: arn:aws:iam::yyyyyyyyyyyy:role/cptest-core-gbl-identity-gitops
      matrix:
        sort-by: .stack_slug
        group-by: .stack_slug | split("-") | [.[0], .[2]] | join("-")
```

> [!IMPORTANT]
> **Please note!** This GitHub Action only works with `atmos >= 1.63.0`. If you are using `atmos < 1.63.0` please use `v1` version of this action.    

### Workflow example

In this example drift will be remediated when user sets label `apply` to an issue.

```yaml
name: github-action-atmos-terraform-drift-remediation
run-name: github-action-atmos-terraform-drift-remediation

on:
  issues:
    types:
      - labeled
      - closed

permissions:
  id-token: write
  contents: read

jobs:
  remediate-drift:
    runs-on: ubuntu-latest
    name: github-action-atmos-terraform-drift-remediation
    if: |
      github.event.action == 'labeled' &&
      contains(join(github.event.issue.labels.*.name, ','), 'apply')
    steps:
      - name: github-action-atmos-terraform-drift-remediation
        uses: cloudposse/github-action-atmos-terraform-drift-remediation@v1
        with:
          issue-number: ${{ github.event.issue.number }}
          action: remediate
          atmos-config-path: ./rootfs/usr/local/etc/atmos/

  discard-drift:
    runs-on: ubuntu-latest
    name: github-action-atmos-terraform-drift-remediation
    if: |
      github.event.action == 'closed' &&
      !contains(join(github.event.issue.labels.*.name, ','), 'remediated')
    steps:
      - name: github-action-atmos-terraform-drift-remediation
        uses: cloudposse/github-action-atmos-terraform-drift-remediation@v1
        with:
          issue-number: ${{ github.event.issue.number }}
          action: discard
          atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml    
```


### Migrating from `v1` to `v2`

The notable changes in `v2` are:

- `v2` works only with `atmos >= 1.63.0`
- `v2` drops `install-terraform` input because terraform is not required for affected stacks call
- `v2` drops `atmos-gitops-config-path` input and the `./.github/config/atmos-gitops.yaml` config file. Now you have to use GitHub Actions environment variables to specify the location of the `atmos.yaml`.

The following configuration fields now moved to GitHub action inputs with the same names

|         name            |
|-------------------------|
| `atmos-version`         |
| `atmos-config-path`     |


The following configuration fields moved to the `atmos.yaml` configuration file.

|              name        |    YAML path in `atmos.yaml`                    |
|--------------------------|-------------------------------------------------|
| `aws-region`             | `integrations.github.gitops.artifact-storage.region`     | 
| `terraform-state-bucket` | `integrations.github.gitops.artifact-storage.bucket`     |
| `terraform-state-table`  | `integrations.github.gitops.artifact-storage.table`      |
| `terraform-state-role`   | `integrations.github.gitops.artifact-storage.role`       |
| `terraform-plan-role`    | `integrations.github.gitops.role.plan`          |
| `terraform-apply-role`   | `integrations.github.gitops.role.apply`         |
| `terraform-version`      | `integrations.github.gitops.terraform-version`  |
| `enable-infracost`       |  `integrations.github.gitops.infracost-enabled` |
| `sort-by`                |  `integrations.github.gitops.matrix.sort-by`    |
| `group-by`               |  `integrations.github.gitops.matrix.group-by`   |


For example, to migrate from `v1` to `v2`, you should have something similar to the following in your `atmos.yaml`:

`./.github/config/atmos.yaml`
```yaml
# ... your existing configuration

integrations:
  github:
    gitops:
      terraform-version: 1.5.2
      infracost-enabled: false
      artifact-storage:
        region: us-east-2
        bucket: cptest-core-ue2-auto-gitops
        table: cptest-core-ue2-auto-gitops-plan-storage
        role: arn:aws:iam::xxxxxxxxxxxx:role/cptest-core-ue2-auto-gitops-gha
      role:
        plan: arn:aws:iam::yyyyyyyyyyyy:role/cptest-core-gbl-identity-gitops
        apply: arn:aws:iam::yyyyyyyyyyyy:role/cptest-core-gbl-identity-gitops
      matrix:
        sort-by: .stack_slug
        group-by: .stack_slug | split("-") | [.[0], .[2]] | join("-")
```

`.github/workflows/main.yaml`
```yaml
- name: github-action-atmos-terraform-drift-remediation
  uses: cloudposse/github-action-atmos-terraform-drift-remediation@v2
  with:
    issue-number: ${{ github.event.issue.number }}
    action: remediate
    atmos-config-path: ./rootfs/usr/local/etc/atmos/  
``` 

This corresponds to the `v1` configuration (deprecated) below.

The `v1` configuration file `./.github/config/atmos-gitops.yaml` looked like this:
```yaml
atmos-version: 1.45.3
atmos-config-path: ./rootfs/usr/local/etc/atmos/
terraform-state-bucket: cptest-core-ue2-auto-gitops
terraform-state-table: cptest-core-ue2-auto-gitops
terraform-state-role: arn:aws:iam::xxxxxxxxxxxx:role/cptest-core-ue2-auto-gitops-gha
terraform-plan-role: arn:aws:iam::yyyyyyyyyyyy:role/cptest-core-gbl-identity-gitops
terraform-apply-role: arn:aws:iam::yyyyyyyyyyyy:role/cptest-core-gbl-identity-gitops
terraform-version: 1.5.2
aws-region: us-east-2
enable-infracost: false
sort-by: .stack_slug
group-by: .stack_slug | split("-") | [.[0], .[2]] | join("-")  
```

And the `v1` GitHub Action Workflow looked like this.

`.github/workflows/main.yaml`
```yaml
- name: github-action-atmos-terraform-drift-remediation
  uses: cloudposse/github-action-atmos-terraform-drift-remediation@v1
  with:
    issue-number: ${{ github.event.issue.number }}
    action: remediate
    atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml    
```




### Migrating from `v0` to `v1`

1.  `v2` drops the `component-path` variable and instead fetches if directly from the [`atmos.yaml` file](https://atmos.tools/cli/configuration/) automatically. Simply remove the `component-path` argument from your invocations of the `cloudposse/github-action-atmos-terraform-plan` action.
2.  `v2` moves most of the `inputs` to the Atmos GitOps config path `./.github/config/atmos-gitops.yaml`. Simply create this file, transfer your settings to it, then remove the corresponding arguments from your invocations of the `cloudposse/github-action-atmos-terraform-plan` action.  

|         name             |
|--------------------------|
| `atmos-version`          |
| `atmos-config-path`      |
| `terraform-state-bucket` |
| `terraform-state-table`  |
| `terraform-state-role`   |
| `terraform-plan-role`    |
| `terraform-apply-role`   |
| `terraform-version`      |
| `aws-region`             |
| `enable-infracost`       |


If you want the same behavior in `v1`  as in`v0` you should create config `./.github/config/atmos-gitops.yaml` with the same variables as in `v0` inputs.

```yaml
  - name: github-action-atmos-terraform-drift-remediation
    uses: cloudposse/github-action-atmos-terraform-drift-remediation@v1
    with:
      issue-number: ${{ github.event.issue.number }}
      action: remediate
      atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml  
```

 Which would produce the same behavior as in `v0`, doing this:

```yaml
  - name: github-action-atmos-terraform-drift-remediation
    uses: cloudposse/github-action-atmos-terraform-drift-remediation@v0
    with:
      issue-number: ${{ github.event.issue.number }}
      action: remediate
      atmos-config-path: "${{ github.workspace }}/rootfs/usr/local/etc/atmos/"
      terraform-plan-role: "arn:aws:iam::111111111111:role/acme-core-gbl-identity-gitops"
      terraform-state-bucket: "acme-core-ue2-auto-gitops"
      terraform-state-role: "arn:aws:iam::999999999999:role/acme-core-ue2-auto-gitops-gha"
      terraform-state-table: "acme-core-ue2-auto-gitops"
      aws-region: "us-east-2"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| action | Drift remediation action. One of ['remediate', 'discard'] | remediate | false |
| atmos-config-path | The path to the atmos.yaml file | N/A | true |
| atmos-version | The version of atmos to install | >= 1.63.0 | false |
| debug | Enable action debug mode. Default: 'false' | false | false |
| issue-number | Issue Number | N/A | true |
| token | Used to pull node distributions for Atmos from Cloud Posse's GitHub repository. Since there's a default, this is typically not supplied by the user. When running this action on github.com, the default value is sufficient. When running on GHES, you can pass a personal access token for github.com if you are experiencing rate limiting. | ${{ github.server\_url == 'https://github.com' && github.token \|\| '' }} | false |


<!-- markdownlint-restore -->

