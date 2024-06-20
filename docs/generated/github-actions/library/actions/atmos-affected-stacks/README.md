---
title: atmos-affected-stacks
sidebar_label: atmos-affected-stacks
sidebar_class_name: command
description: |-
  A GitHub Action to get a list of affected atmos stacks for a pull request
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-atmos-affected-stacks/blob/main/README.yaml
---

# GitHub Action: `atmos-affected-stacks`
A GitHub Action to get a list of affected atmos stacks for a pull request




## Introduction

This is a GitHub Action to get a list of affected atmos stacks for a pull request. It optionally installs 
`atmos` and `jq` and runs `atmos describe affected` to get the list of affected stacks. It provides the 
raw list of affected stacks as an output as well as a matrix that can be used further in GitHub action jobs.



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
> **Please note!** This GitHub Action only works with `atmos >= 1.63.0`. If you are using `atmos < 1.63.0` please use `v2` version of this action.    

### Workflow example

```yaml
  name: github-action-atmos-affected-stacks
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - id: affected
          uses: cloudposse/github-action-atmos-affected-stacks@v3
          with:
            atmos-config-path: ./rootfs/usr/local/etc/atmos/
            atmos-version: 1.63.0
            nested-matrices-count: 1

      outputs:
        affected: ${{ steps.affected.outputs.affected }}
        matrix: ${{ steps.affected.outputs.matrix }}

    atmos-plan:
      needs: ["atmos-affected"]
      if: ${{ needs.atmos-affected.outputs.has-affected-stacks == 'true' }}
      name: github-action-atmos-affected-stacks
      runs-on: ['self-hosted']
      strategy:
        max-parallel: 10
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(needs.atmos-affected.outputs.matrix) }}
      ## Avoid running the same stack in parallel mode (from different workflows)
      concurrency:
        group: ${{ matrix.stack_slug }}
        cancel-in-progress: false
      steps:
        - name: github-action-atmos-affected-stacks
          uses: cloudposse/github-action-atmos-terraform-plan@v1
          with:
            component: ${{ matrix.component }}
            stack: ${{ matrix.stack }}
```
  
### Migrating from `v2` to `v3`

The notable changes in `v3` are:

- `v3` works only with `atmos >= 1.63.0`
- `v3` drops `install-terraform` input because terraform is not required for affected stacks call
- `v3` drops `atmos-gitops-config-path` input and the `./.github/config/atmos-gitops.yaml` config file. Now you have to use GitHub Actions environment variables to specify the location of the `atmos.yaml`.

The following configuration fields now moved to GitHub action inputs with the same names

|         name            |
|-------------------------|
| `atmos-version`         |
| `atmos-config-path`     |


The following configuration fields moved to the `atmos.yaml` configuration file.

|         name             |    YAML path in `atmos.yaml`                    |
|--------------------------|-------------------------------------------------|
| `aws-region`             | `integrations.github.gitops.artifact-storage.region`     | 
| `terraform-state-bucket` | `integrations.github.gitops.artifact-storage.bucket`     |
| `terraform-state-table`  | `integrations.github.gitops.artifact-storage.table`      |
| `terraform-state-role`   | `integrations.github.gitops.artifact-storage.role`       |
| `terraform-plan-role`    | `integrations.github.gitops.role.plan`          |
| `terraform-apply-role`   | `integrations.github.gitops.role.apply`         |
| `terraform-version`      | `integrations.github.gitops.terraform-version`  |
| `enable-infracost`       | `integrations.github.gitops.infracost-enabled`  |
| `sort-by`                | `integrations.github.gitops.matrix.sort-by`     |
| `group-by`               | `integrations.github.gitops.matrix.group-by`    |


For example, to migrate from `v2` to `v3`, you should have something similar to the following in your `atmos.yaml`: 

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
  - id: affected
    uses: cloudposse/github-action-atmos-affected-stacks@v3
    with:
      atmos-config-path: ./rootfs/usr/local/etc/atmos/
      atmos-version: 1.63.0
``` 

This corresponds to the `v2` configuration (deprecated) below.

The `v2` configuration file `./.github/config/atmos-gitops.yaml` looked like this:
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

And the `v2` GitHub Action Workflow looked like this.

`.github/workflows/main.yaml`
```yaml
  - id: affected
    uses: cloudposse/github-action-atmos-affected-stacks@v2
    with:
      atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml
```
 
  
### Migrating from `v1` to `v2`

`v2` moves most of the `inputs` to the Atmos GitOps config path `./.github/config/atmos-gitops.yaml`. Simply create this file, transfer your settings to it, then remove the corresponding arguments from your invocations of the `cloudposse/github-action-atmos-affected-stacks` action.

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


If you want the same behavior in `v2` as in `v1` you should create config `./.github/config/atmos-gitops.yaml` with the same variables as in `v1` inputs.

```yaml
  - name: github-action-atmos-affected-stacks
    uses: cloudposse/github-action-atmos-affected-stacks@v2
    id: affected
    with:
      atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml
      nested-matrices-count: 1
```

Which would produce the same behavior as in `v1`, doing this:

```yaml
  - name: github-action-atmos-affected-stacks
    uses: cloudposse/github-action-atmos-affected-stacks@v1
    id: affected
    with:
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
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| atmos-config-path | The path to the atmos.yaml file | N/A | true |
| atmos-include-spacelift-admin-stacks | Whether to include the Spacelift admin stacks of affected stacks in the output | false | false |
| atmos-version | The version of atmos to install | >= 1.63.0 | false |
| base-ref | The base ref to checkout. If not provided, the head default branch is used. | N/A | false |
| default-branch | The default branch to use for the base ref. | ${{ github.event.repository.default\_branch }} | false |
| head-ref | The head ref to checkout. If not provided, the head default branch is used. | ${{ github.sha }} | false |
| install-atmos | Whether to install atmos | true | false |
| install-jq | Whether to install jq | false | false |
| jq-force | Whether to force the installation of jq | true | false |
| jq-version | The version of jq to install if install-jq is true | 1.6 | false |
| nested-matrices-count | Number of nested matrices that should be returned as the output (from 1 to 3) | 2 | false |


## Outputs

| Name | Description |
|------|-------------|
| affected | The affected stacks |
| has-affected-stacks | Whether there are affected stacks |
| matrix | The affected stacks as matrix structure suitable for extending matrix size workaround (see README) |
<!-- markdownlint-restore -->

