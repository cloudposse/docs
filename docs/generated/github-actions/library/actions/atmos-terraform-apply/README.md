---
title: atmos-terraform-apply
sidebar_label: atmos-terraform-apply
sidebar_class_name: command
description: |-
  This Github Action is used to run Terraform apply for a single, Atmos-supported component with a saved planfile in S3 and DynamoDB.
tags:
  - github-action
  - atmos
  - terraform

custom_edit_url: https://github.com/cloudposse/github-action-atmos-terraform-apply/blob/main/README.yaml
---

# GitHub Action: `atmos-terraform-apply`
This Github Action is used to run Terraform apply for a single, Atmos-supported component with a saved planfile in S3 and DynamoDB.




## Introduction

This Github Action is used to run Terraform apply for a single, Atmos-supported component with a saved planfile in S3 and DynamoDB.

Before running this action, first create and store a planfile with the companion action, [github-action-atmos-terraform-plan](https://github.com/cloudposse/github-action-atmos-terraform-plan).

For more, see [Atmos GitHub Action Integrations](https://atmos.tools/integrations/github-actions/atmos-terraform-apply)



## Usage

### Prerequisites

This GitHub Action requires AWS access for two different purposes. This action will attempt to first pull a Terraform planfile from a S3 Bucket with metadata in a DynamoDB table with one role. 
Then the action will run `terraform apply` against that component with another role. We recommend configuring 
[OpenID Connect with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) 
to allow GitHub to assume roles in AWS and then deploying both a Terraform Apply role and a Terraform State role. 
For Cloud Posse documentation on setting up GitHub OIDC, see our [`github-oidc-provider` component](https://docs.cloudposse.com/components/library/aws/github-oidc-provider/).

In order to retrieve Terraform Plan Files (not to be confused with Terraform State files, e.g. `tfstate`), we configure an S3 Bucket to store plan files and a DynamoDB table to track plan metadata. Both need to be deployed before running
this action. For more on setting up those components, see the [`gitops` component](https://docs.cloudposse.com/components/library/aws/gitops/). This action will then use the [github-action-terraform-plan-storage](https://github.com/cloudposse/github-action-terraform-plan-storage) action to update these resources.

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

In this example, the action is triggered when certain events occur, such as a manual workflow dispatch or the opening, synchronization, or reopening of a pull request, specifically on the main branch. It specifies specific permissions related to assuming roles in AWS. Within the "apply" job, the "component" and "stack" are hardcoded (`foobar` and `plat-ue2-sandbox`). In practice, these are usually derived from another action. 

> [!TIP] 
We recommend combining this action with the [`affected-stacks`](https://atmos.tools/integrations/github-actions/affected-stacks) GitHub Action inside a matrix to plan all affected stacks in parallel.

```yaml
  name: github-action-atmos-terraform-apply

  on:
    workflow_dispatch:
    pull_request:
      types:
        - closed
      branches:
        - main

  # These permissions are required for GitHub to assume roles in AWS
  permissions:
    id-token: write
    contents: read

  jobs:
    apply:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-atmos-terraform-apply
          uses: cloudposse/github-action-atmos-terraform-apply@v2
          with:
            component: "foobar"
            stack: "plat-ue2-sandbox"
            atmos-config-path: ./rootfs/usr/local/etc/atmos/
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
  - name: github-action-atmos-terraform-apply
    uses: cloudposse/github-action-atmos-terraform-apply@v2
    with:
      component: "foobar"
      stack: "plat-ue2-sandbox"
      atmos-config-path: ./rootfs/usr/local/etc/atmos/
      atmos-version: 1.63.0
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
  - name: github-action-atmos-terraform-apply
    uses: cloudposse/github-action-atmos-terraform-apply@v1
    with:
      component: "foobar"
      stack: "plat-ue2-sandbox"
      atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml
```

### Migrating from `v0` to `v1`

1. `v1` drops the `component-path` variable and instead fetches if directly from the [`atmos.yaml` file](https://atmos.tools/cli/configuration/) automatically. Simply remove the `component-path` argument from your invocations of the `cloudposse/github-action-atmos-terraform-apply` action.
2. `v1` moves most of the `inputs` to the Atmos GitOps config path `./.github/config/atmos-gitops.yaml`. Simply create this file, transfer your settings to it, then remove the corresponding arguments from your invocations of the `cloudposse/github-action-atmos-terraform-apply` action.

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


If you want the same behavior in `v1` as in `v0` you should create config `./.github/config/atmos-gitops.yaml` with the same variables as in `v0` inputs.

```yaml
- name: github-action-atmos-terraform-apply
  uses: cloudposse/github-action-atmos-terraform-apply@v1
  with:
    atmos-gitops-config-path: ./.github/config/atmos-gitops.yaml
    component: "foobar"
    stack: "plat-ue2-sandbox"
```

Which would produce the same behavior as in `v0`, doing this:

```yaml
- name: github-action-atmos-terraform-apply
  uses: cloudposse/github-action-atmos-terraform-apply@v0
  with:
    component: "foobar"
    stack: "plat-ue2-sandbox"
    component-path: "components/terraform/s3-bucket"
    terraform-apply-role: "arn:aws:iam::111111111111:role/acme-core-gbl-identity-gitops"
    terraform-state-bucket: "acme-core-ue2-auto-gitops"
    terraform-state-role: "arn:aws:iam::999999999999:role/acme-core-ue2-auto-gitops-gha"
    terraform-state-table: "acme-core-ue2-auto-gitops"
    aws-region: "us-east-2"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| atmos-config-path | The path to the atmos.yaml file | N/A | true |
| atmos-version | The version of atmos to install | >= 1.63.0 | false |
| branding-logo-image | Branding logo image url | https://cloudposse.com/logo-300x69.svg | false |
| branding-logo-url | Branding logo url | https://cloudposse.com/ | false |
| component | The name of the component to apply. | N/A | true |
| debug | Enable action debug mode. Default: 'false' | false | false |
| infracost-api-key | Infracost API key | N/A | false |
| sha | Commit SHA to apply. Default: github.sha | ${{ github.event.pull\_request.head.sha }} | true |
| stack | The stack name for the given component. | N/A | true |
| token | Used to pull node distributions for Atmos from Cloud Posse's GitHub repository. Since there's a default, this is typically not supplied by the user. When running this action on github.com, the default value is sufficient. When running on GHES, you can pass a personal access token for github.com if you are experiencing rate limiting. | ${{ github.server\_url == 'https://github.com' && github.token \|\| '' }} | false |


## Outputs

| Name | Description |
|------|-------------|
| status | Apply Status. Either 'succeeded' or 'failed' |
<!-- markdownlint-restore -->
