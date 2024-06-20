---
title: atmos-terraform-select-components
sidebar_label: atmos-terraform-select-components
sidebar_class_name: command
description: |-
  GitHub Action that outputs list of Atmos components by jq query
tags:
  - github-action
  - atmos
  - terraform

custom_edit_url: https://github.com/cloudposse/github-action-atmos-terraform-select-components/blob/main/README.yaml
---

# GitHub Action: `atmos-terraform-select-components`
GitHub Action that outputs list of Atmos components by jq query




## Introduction

GitHub Action that outputs list of Atmos components by jq query.

For example following query will fetch components that have in settings set `github.actions_enabled: true`:

```
.value.settings.github.actions_enabled // false
```

Output of this action is a list of basic component information. For example:

```json
[
  {
  "stack": "plat-ue2-sandbox",
  "component": "test-component-01",
  "stack_slug": "plat-ue2-sandbox-test-component-01",
  "component_path": "components/terraform/s3-bucket"
  }
]
```



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

### GitHub Actions Workflow Example

In following GitHub workflow example first job will filter components that have settings `github.actions_enabled: true` and then in following job `stack_slug` will be printed to stdout.

```yaml
  jobs:
    selected-components:
      runs-on: ubuntu-latest
      name: github-action-atmos-terraform-select-components
      outputs:
        matrix: ${{ steps.components.outputs.matrix }}
      steps:
        - name: github-action-atmos-terraform-select-components
          id: components
          uses: cloudposse/github-action-atmos-terraform-select-components@v2
          with:
            atmos-config-path: "${{ github.workspace }}/rootfs/usr/local/etc/atmos/"
            jq-query: 'to_entries[] | .key as $parent | .value.components.terraform | to_entries[] | select(.value.settings.github.actions_enabled // false) | [$parent, .key] | join(",")'

    print-stack-slug:
      runs-on: ubuntu-latest
      needs:
        - selected-components
      if: ${{ needs.selected-components.outputs.matrix != '{"include":[]}' }}
      strategy:
        matrix: ${{ fromJson(needs.selected-components.outputs.matrix) }}
      name: github-action-atmos-terraform-select-components
      steps:
        - name: github-action-atmos-terraform-select-components
          run:
            echo "${{ matrix.stack_slug }}"
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
- name: github-action-atmos-terraform-select-components
  id: components
  uses: cloudposse/github-action-atmos-terraform-select-components@v2
  with:
    atmos-config-path: ./rootfs/usr/local/etc/atmos/
    jq-query: 'to_entries[] | .key as $parent | .value.components.terraform | to_entries[] | select(.value.settings.github.actions_enabled // false) | [$parent, .key] | join(",")'
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
- name: github-action-atmos-terraform-select-components
  id: components
  uses: cloudposse/github-action-atmos-terraform-select-components@v1
  with:
    atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml
    jq-query: 'to_entries[] | .key as $parent | .value.components.terraform | to_entries[] | select(.value.settings.github.actions_enabled // false) | [$parent, .key] | join(",")'

```


### Migrating from `v0` to `v1`

1. `v1` replaces the `jq-query` input parameter with a new parameter called `selected-filter` to simplify the query for end-users.
  Now you need to specify only the part used inside of the `select(...)` function of the `jq-query`.  

2.`v1` moves most of the `inputs` to the Atmos GitOps config path `./.github/config/atmos-gitops.yaml`. Simply create this file, transfer your settings to it, then remove the corresponding arguments from your invocations of the `cloudposse/github-action-atmos-terraform-select-components` action.

|         name             |
|--------------------------|
| `atmos-version`          |
| `atmos-config-path`      |


If you want the same behavior in `v2` as in `v1` you should create config `./.github/config/atmos-gitops.yaml` with the same variables as in `v0` inputs.

```yaml
  - name: github-action-atmos-terraform-select-components
    id: components
    uses: cloudposse/github-action-atmos-terraform-select-components@v1
    with:
      atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml
      select-filter: '.settings.github.actions_enabled // false'
```

Which would produce the same behavior as in `v2`, doing this:

```yaml
  - name: github-action-atmos-terraform-select-components
    id: components
    uses: cloudposse/github-action-atmos-terraform-select-components@v0
    with:
      atmos-config-path: "${{ github.workspace }}/rootfs/usr/local/etc/atmos/"
      jq-query: 'to_entries[] | .key as $parent | .value.components.terraform | to_entries[] | select(.value.settings.github.actions_enabled // false) | [$parent, .key] | join(",")'
```

Please note that the `atmos-gitops-config-path` is not the same file as the `atmos-config-path`.








