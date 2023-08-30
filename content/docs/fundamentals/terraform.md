---
title: "Terraform"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1186234654/Terraform
sidebar_position: 130
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/tools/terraform.md
---

import ReactPlayer from 'react-player'

# Terraform

For the most part, we assume users have a solid grasp of `terraform`. Cloud Posse has adopted a number of conventions for how we work with `terraform` that we document here. Review [our opinionated public “best practices” as it relates to terraform](/reference/best-practices/terraform-best-practices/).

We use [Atmos](/reference-architecture/fundamentals/tools/atmos) together with [Stacks](/reference-architecture/fundamentals/tools/stacks) to call [Components](/components) that provision infrastructure with `terraform`.

:::caution
Be aware of [Terraform Environment Variables](https://www.terraform.io/docs/cli/config/environment-variables.html) that can alter the behavior of `terraform` when run outside of what you see in `atmos` or `geodesic`. These are also helpful to change default behavior as well, such as by setting the `TF_DATA_DIR`.

:::

## How-to Guides

- [How to Upgrade or Install Versions of Terraform](/reference-architecture/how-to-guides/upgrades/how-to-upgrade-or-install-versions-of-terraform)
- [How to Manage Terraform Dependencies in Micro-service Repositories](/reference-architecture/how-to-guides/tutorials/how-to-manage-terraform-dependencies-in-micro-service-repositori)
- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)
- [How to Use Terraform Remote State](/reference-architecture/how-to-guides/tutorials/how-to-use-terraform-remote-state)
- [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform)
- [How to support GovCloud and Other AWS Partitions with Terraform](/reference-architecture/how-to-guides/tutorials/how-to-support-govcloud-and-other-aws-partitions-with-terraform)

## Architectural Design Records

- [Proposed: Use Strict Provider Pinning in Components](/reference-architecture/reference/adrs/proposed-use-strict-provider-pinning-in-components)
- [Use Basic Provider Block for Root-level Components](/reference-architecture/reference/adrs/use-basic-provider-block-for-root-level-components)
- [Use Terraform Provider Block with compatibility for Role ARNs and Profiles](/reference-architecture/reference/adrs/use-terraform-provider-block-with-compatibility-for-role-arns-an)
- [Use Spacelift for GitOps with Terraform](/reference-architecture/reference/adrs/use-spacelift-for-gitops-with-terraform)
- [Use SSM over ASM for Infrastructure](/reference-architecture/reference/adrs/use-ssm-over-asm-for-infrastructure)
- [Proposed: Use Defaults for Components](/reference-architecture/reference/adrs/proposed-use-defaults-for-components)

## Conventions

### Mixins

Terraform does not natively support the object-oriented concepts of multiple inheritances or [mixins](https://en.wikipedia.org/wiki/Mixin), but we can simulate by using convention. For our purposes, we define a mixin in terraform as a controlled way of adding functionality to modules. When a mixin file is dropped into a folder of a module, the code in the mixin starts to interact with the code in the module. A module can have as many mixins as needed. Since terraform does not directly, we instead use a convention of exporting what we want to reuse.

We achieve this currently using something we call an `export` in our terraform modules, which publish some reusable terraform code that we copy verbatim into modules as needed. We use this pattern with our `terraform-null-label` using the `context.tf` file pattern (See below). We also use this pattern in our `terraform-aws-security-group` module with the [https://github.com/cloudposse/terraform-aws-security-group/blob/main/exports/security-group-variables.tf](https://github.com/cloudposse/terraform-aws-security-group/blob/main/exports/security-group-variables.tf).

To follow this convention, create an `export/` folder with the mixin files you wish to export to other modules. Then simply copy them over (E.g. with `curl`). We recommend calling the installed files something `.mixin.tf` so it’s clear it's an external asset.

### Resource Factories

Resource Factories provide a custom declarative interface for defining multiple resources using YAML and then terraform for implementing the business logic. Most of our new modules are developed using this pattern so we can decouple the architecture requirements from the implementation.

See [https://medium.com/google-cloud/resource-factories-a-descriptive-approach-to-terraform-581b3ebb59c](https://medium.com/google-cloud/resource-factories-a-descriptive-approach-to-terraform-581b3ebb59c) for a related discussion.

To better support this pattern, we implemented native support for deep merging in terraform using our [https://github.com/cloudposse/terraform-provider-utils](https://github.com/cloudposse/terraform-provider-utils) provider as well as implemented a module to standardize how we use YAML configurations [https://github.com/cloudposse/terraform-yaml-config](https://github.com/cloudposse/terraform-yaml-config).

Examples of modules using Resource Factory convention:

- [https://github.com/cloudposse/terraform-aws-service-control-policies](https://github.com/cloudposse/terraform-aws-service-control-policies)

- [https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation)

- [https://github.com/cloudposse/terraform-datadog-platform](https://github.com/cloudposse/terraform-datadog-platform)

- [https://github.com/cloudposse/terraform-opsgenie-incident-management](https://github.com/cloudposse/terraform-opsgenie-incident-management)

- [https://github.com/cloudposse/terraform-aws-config](https://github.com/cloudposse/terraform-aws-config)

### Naming Conventions (and the `terraform-null-label` Module)

Naming things is hard. We’ve made it easier by defining a programmatically consistent naming convention, which we use in everything we provision.  It is designed to generate consistent human-friendly names and tags for resources. We implement this using a terraform module which accepts a number of standardized inputs and produces an output with the fully disambiguate ID. This module establishes the common interface we use in all of our terraform modules in the Cloud Posse ecosystem. Use `terraform-null-label` to implement a strict naming convention. We use it in all of our [Components](/components) and export something we call the `context.tf` pattern.

[https://github.com/cloudposse/terraform-null-label](https://github.com/cloudposse/terraform-null-label)

Here’s video from our [https://cloudposse.atlassian.net/wiki/spaces/CP/pages/1170014234](https://cloudposse.atlassian.net/wiki/spaces/CP/pages/1170014234) where we talk about it.

<ReactPlayer
    url='https://www.youtube.com/watch?v=V2b5F6jt6tQ'
    width={"800px"}
    height={"450px"}
    controls={true} />

There are 6 inputs considered "labels" or "ID elements" (because the labels are used to construct the ID):

1. `namespace`

2. `tenant`

3. `environment`

4. `stage`

5. `name`

6. `attributes`

This module generates IDs using the following convention by default: `{namespace}-{environment}-{stage}-{name}-{attributes}`. However, it is highly configurable. The delimiter (e.g. `-`) is configurable. Each label item is optional (although you must provide at least one).

#### Tenants

`tenants` are a Cloud Posse construct used to describe a collection of accounts within an Organizational Unit (OU). An OU may have multiple tenants, and each tenant may have multiple AWS accounts.  For example, the `platform` OU might have two tenants named `dev` and `prod`. The `dev` tenant can contain accounts for the `staging`, `dev`, `qa`, and `sandbox` environments, while the `prod` tenant only has one account for the `prod` environment.

By separating accounts into these logical groupings, we can organize accounts at a higher level, follow AWS Well-Architected Framework recommendations, and enforce environment boundaries easily.

### The `context.tf` Mixin Pattern

Cloud Posse Terraform modules all share a common `context` object that is meant to be passed from module to module. A `context` object is a single object that contains all the input values for `terraform-null-label` and every `cloudposse/terraform-*` module uses it to ensure a common interface to all of our modules. By convention, we install this file as `context.tf` which is why we call it the `context.tf` pattern. By default, we always provide an instance of it accessible via `module.this`, which makes it always easy to get your _context._ 🙂

Every input value can also be specified individually by name as a standard Terraform variable, and the value of those variables, when set to something other than `null`, will override the value in the context object. In order to allow chaining of these objects, where the context object input to one module is transformed and passed on to the next module, all the variables default to `null` or empty collections.

<ReactPlayer
    url='https://www.youtube.com/watch?v=V2b5F6jt6tQ&t=6s'
    width={"800px"}
    height={"450px"}
    controls={true} />

### Stacks and Components

We use [Stacks](/reference-architecture/fundamentals/tools/stacks) to define and organize configurations. We place terraform “root” modules in the `components/terraform` directory (e.g. `components/terraform/s3-bucket`). Then we define one or more catalog archetypes for using the component (e.g. `catalog/s3-bucket/logs.yaml` and `catalog/s3-bucket/artifacts`).

### Atmos CLI

We predominantly call `terraform` from `atmos`, however, by design all of our infrastructure code runs without any task runners. This is in contrast to tools like `terragrunt` that manipulate the state of infrastructure code at run time.

See [How to use Atmos](/reference-architecture/how-to-guides/tutorials/how-to-use-atmos)

## FAQ

### How to upgrade Terraform?

See [How to Switch Versions of Terraform](/reference-architecture/how-to-guides/tutorials/how-to-switch-versions-of-terraform) for a more complete guide.

TL;DR:

- Note the version you want to use

- Make sure the version is available in [cloudposse/packages](https://github.com/cloudposse/packages/pulls?q=terraform) to see if the version desired is in a merged PR for terraform

- Make sure the version is available in Spacelift by editing an existing stack and see if the new version is available

- Update Terraform in `Dockerfile`

- Update Terraform in `.github/workflows/pre-commit.yaml` github action

- Update Terraform in `components/terraform/spacelift/default.auto.tfvars`

### How to use `context.tf`?

Copy this file from `https://github.com/cloudposse/terraform-null-label/blob/master/exports/context.tf` and then place it in your Terraform module to automatically get Cloud Posse's standard configuration inputs suitable for passing to Cloud Posse modules.

```
curl -sL https://raw.githubusercontent.com/cloudposse/terraform-null-label/master/exports/context.tf -o context.tf
```

Modules should access the whole context as `module.this.context` to get the input variables with nulls for defaults, for example `context = module.this.context`, and access individual variables as `module.this.<var>`, with final values filled in.

[https://github.com/cloudposse/terraform-null-label/blob/master/exports/context.tf](https://github.com/cloudposse/terraform-null-label/blob/master/exports/context.tf)

For example, when using defaults, `module.this.context.delimiter` will be `null`, and `module.this.delimiter` will be `-` (hyphen).

:::caution
ONLY EDIT THIS FILE IN [http://github.com/cloudposse/terraform-null-label](http://github.com/cloudposse/terraform-null-label) . All other instances of this file should be a copy of that one.

:::

## Learning Resources

If you’re new to terraform, here are a number of resources to check out:

- [https://learn.hashicorp.com/terraform](https://learn.hashicorp.com/terraform) are the official classes produced by HashiCorp

- [https://acloudguru.com/search?s=terraform](https://acloudguru.com/search?s=terraform)

- [https://www.pluralsight.com/courses/terraform-getting-started](https://www.pluralsight.com/courses/terraform-getting-started)

- [https://www.youtube.com/watch?v=wgzgVm7Sqlk](https://www.youtube.com/watch?v=wgzgVm7Sqlk)

## Troubleshooting

### **Prompt**: `Do you want to migrate all workspaces to "s3"?`

If you get this message, it means you have local state (e.g. a `terraform.tfstate` file) which has not been published to the S3 backend. This happens typically when the backend was not defined (e.g. `backend.tf.json`) prior to running `terraform init`.

:::caution
**WARNING**
This will overwrite any state currently in S3 for this component. If you were not expecting the state to be completely new, this prompt is unexpected. Working with any existing component shouldn't involve migrating a workspace and further investigation is warranted.

:::

As far as I know, this shouldn't involve migrating a workspace, since this state should be completely new. Should I say yes? Is this just a misleading warning? or indicative that I'm about to mess something up?

## Reference

- [AWS Region Codes](/reference-architecture/reference/aws/aws-region-codes)
- [Structure of Terraform S3 State Backend Bucket](/reference-architecture/reference/structure-of-terraform-s3-state-backend-bucket)


