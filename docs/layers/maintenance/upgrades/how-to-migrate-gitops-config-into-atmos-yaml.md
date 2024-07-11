---
title: "Upgrade GitOps V2 config"
sidebar_position: 100
---

# How to Move `atmos-gitops-config.yaml` to `atmos.yaml`

## Problem
We want to reduce config files related to GitOps in the `infrastructure` repository and move the `atmos-gitops-config.yaml` file to `atmos.yaml`.

## Solution

:::tip
TL;DR Create the changes according to the [Move atmos-gitops-config.yaml to atmos.yaml](https://github.com/cloudposse-examples/infra-demo-gitops/pull/6) PR.

Set [GitHub action variables](https://github.com/cloudposse-examples/infra-demo-gitops/settings/variables/actions) `ATMOS_VERSION` and `ATMOS_CONFIG_PATH`

| variable name       | value                           |
|---------------------|---------------------------------|
| `ATMOS_VERSION`     | `1.63.0`                        |
| `ATMOS_CONFIG_PATH` | `./rootfs/usr/local/etc/atmos/` |

:::

### Updating

Create changes following the [Move atmos-gitops-config.yaml to atmos.yaml](https://github.com/cloudposse-examples/infra-demo-gitops/pull/6) PR as an example.

The following configuration fields now moved to [GitHub action variables](https://github.com/cloudposse-examples/infra-demo-gitops/settings/variables/actions) `ATMOS_VERSION` and `ATMOS_CONFIG_PATH`

|         name            | variable name       | value                                       |
|-------------------------|---------------------|---------------------------------------------|
| `atmos-version`         | `ATMOS_VERSION`     | `1.63.0` |
| `atmos-config-path`     | `ATMOS_CONFIG_PATH` | `./rootfs/usr/local/etc/atmos/`             |

The following configuration fields moved to the `atmos.yaml` configuration file.

|         name             | YAML path in `atmos.yaml`                            |
|--------------------------|------------------------------------------------------|
| `aws-region`             | `integrations.github.gitops.artifact-storage.region` |
| `terraform-state-bucket` | `integrations.github.gitops.artifact-storage.bucket` |
| `terraform-state-table`  | `integrations.github.gitops.artifact-storage.table`  |
| `terraform-state-role`   | `integrations.github.gitops.artifact-storage.role`   |
| `terraform-plan-role`    | `integrations.github.gitops.role.plan`               |
| `terraform-apply-role`   | `integrations.github.gitops.role.apply`              |
| `terraform-version`      | `integrations.github.gitops.terraform-version`       |
| `enable-infracost`       | `integrations.github.gitops.infracost-enabled`       |
| `sort-by`                | `integrations.github.gitops.matrix.sort-by`          |
| `group-by`               | `integrations.github.gitops.matrix.group-by`         |


For example, to migrate to the new version, you should have something similar to the following in your `atmos.yaml`:

`./rootfs/usr/local/etc/atmos/atmos.yaml`
```yaml
# ... your existing configuration
integrations:
  github:
    gitops:
      terraform-version: 1.4.5
      infracost-enabled: False
      artifact-storage:
        region: us-east-1
        bucket: acme-core-use1-auto-gitops
        table: acme-core-use1-auto-gitops-plan-storage
        role: arn:aws:iam::111111111111:role/acme-core-use1-auto-gha-iam-gitops-gha
      role:
        plan: arn:aws:iam::222222222222:role/acme-core-gbl-identity-gitops
        apply: arn:aws:iam::222222222222:role/acme-core-gbl-identity-gitops
      matrix:
        sort-by: .stack_slug
        group-by: .stack_slug | split("-") | [.[0], .[2]] | join("-")
```

This corresponds to the previous configuration `./.github/config/atmos-gitops.yaml` file (deprecated) like this:

```yaml
atmos-version: 1.63.0
atmos-config-path: ./rootfs/usr/local/etc/atmos/
terraform-state-bucket: acme-core-use1-auto-gitops
terraform-state-table: acme-core-use1-auto-gitops-plan-storage
terraform-state-role: arn:aws:iam::111111111111:role/acme-core-use1-auto-gha-iam-gitops-gha
terraform-plan-role: arn:aws:iam::222222222222:role/acme-core-gbl-identity-gitops
terraform-apply-role: arn:aws:iam::222222222222:role/acme-core-gbl-identity-gitops
terraform-version: 1.4.5
aws-region: us-east-1
enable-infracost: False
sort-by: .stack_slug
group-by: .stack_slug | split("-") | [.[0], .[2]] | join("-")
```
