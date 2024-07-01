---
title: "Decide on Terraform Configuration Pattern for Application Repositories"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1264746925/REFARCH-514+-+Decide+on+Terraform+Configuration+Pattern+for+Application+Repositories
sidebar_position: 100
refarch_id: REFARCH-514
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-terraform-configuration-pattern-for-application-reposi.md
---

# Decide on Terraform Configuration Pattern for Application Repositories

## Context and Problem Statement

The infrastructure monorepo that exists within an organization is responsible for configuring the core infrastructure of the organization: AWS accounts, VPCs, Kubernetes clusters, Route53, etc. However, AWS resources and/or other dependencies specific to a single application — such as a single S3 bucket — is not in the scope of the infrastructure monorepo, and should be managed externally, such that developers responsible for the application in question can manage its dependencies via infrastructure-as-code.

## Considered Options

### In-repo Terraform

A Terraform configuration can be placed within the application repository and automated using `atmos`. This Terraform configuration requires the `infra-state.mixin.tf` mixin in order to be able to read the state of components in the infrastructure monorepo, for example from the `eks` component.

#### Implementation

This implementation is described in detail in the following guide: [How to Manage Terraform Dependencies in Micro-service Repositories](/reference-architecture/how-to-guides/tutorials/how-to-manage-terraform-dependencies-in-micro-service-repositori) .

#### Scope

The Terraform configuration within the application repository should have resources pertaining specifically to that application, specifically for the regional stack configured by `atmos` (see previous section). This includes:

- An IAM Role for a ServiceAccount for that application (see: [IRSA](https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html))

- An S3 bucket for the application

- An SNS topic for the application

- etc.

These Terraform resources are not limited to the AWS provider. Other valid types of resources include:

- LaunchDarkly Feature Flags

- Datadog Monitors

## References

- [How to Manage Terraform Dependencies in Micro-service Repositories](/reference-architecture/how-to-guides/tutorials/how-to-manage-terraform-dependencies-in-micro-service-repositori)


