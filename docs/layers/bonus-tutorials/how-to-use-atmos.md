---
title: "Use Atmos"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176338474/How+to+use+Atmos
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-use-atmos.md
---

# How to use Atmos

## Getting Started

To use [Atmos](/fundamentals/atmos) we recommend interacting with the `atmos` command via `geodesic`.

:::info
Run all the following commands in the geodesic container from the Project root. e.g the _infrastructure_ repository. To run the geodesic shell run `make run` from the project root.

:::

The following assumes `<component>` is a folder that exists in `<ProjectDir>/components/terraform/`that contains .tf files to be applied.
e.g. `ecr`, `dns-primary`, `accounts` are examples of **components**.

And that a `<stack>` is the name of a stack that exists in `<ProjectDir/stacks/` with `.yaml` not included.
e.g. `gbl-security`, `uw2-audit` are examples of **stacks**

## Terraform

#### terraform plan

```
atmos terraform plan <component> -s <stack>
```

#### terraform apply

```
atmos terraform apply <component> -s <stack>
```

#### terraform destroy

```
atmos terraform destroy <component> -s <stack>
```

#### terraform force-unlock

```
cd components/terraform/<component>
terraform force-unlock -force <LockID>
cd ../../../
```

#### terraform apply -auto-approve
This command is used for planning and applying in the same command.

```
atmos terraform deploy <component> -s <stack>
```

## Related Guides

- [How to use Spacectl](/reference-architecture/how-to-guides/integrations/spacelift/how-to-use-spacectl)
- [How to Scale Spacelift Runners](/reference-architecture/how-to-guides/integrations/spacelift/how-to-scale-spacelift-runners)
- [How to Upgrade Atmos](/reference-architecture/how-to-guides/upgrades/how-to-upgrade-atmos)
- [How to Upgrade or Install Versions of Terraform](/reference-architecture/how-to-guides/upgrades/how-to-upgrade-or-install-versions-of-terraform)
- [How to Manage Terraform Dependencies in Micro-service Repositories](/reference-architecture/how-to-guides/tutorials/how-to-manage-terraform-dependencies-in-micro-service-repositori)
- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)
- [How to Use Terraform Remote State](/reference-architecture/how-to-guides/tutorials/how-to-use-terraform-remote-state)
- [How to Manage Explicit Component Dependencies with Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/how-to-manage-explicit-component-dependencies-with-spacelift)
- [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform)
- [How to support GovCloud and Other AWS Partitions with Terraform](/reference-architecture/how-to-guides/tutorials/how-to-support-govcloud-and-other-aws-partitions-with-terraform)
- [How to Sign Up for Spacelift](/reference-architecture/how-to-guides/integrations/spacelift)
- [How to Enable Spacelift Drift Detection](/reference-architecture/how-to-guides/integrations/spacelift/how-to-enable-spacelift-drift-detection)
- [How to Use Multiple Infrastructure Repositories with Spacelift?](/reference-architecture/how-to-guides/integrations/spacelift/how-to-use-multiple-infrastructure-repositories-with-spacelift)
- [How to terraform non-AWS infrastructure?](/reference-architecture/how-to-guides/tutorials/how-to-terraform-non-aws-infrastructure)
- [How to use Atmos](/reference-architecture/how-to-guides/tutorials/how-to-use-atmos)

