---
title: aws-components
sidebar_label: aws-components
sidebar_class_name: command
description: |-
  This is a collection of reusable Terraform components and blueprints for provisioning reference architectures.
tags:
  - terraform
  - terraform-modules
  - aws
  - components
  - terraform-components
  - root
  - geodesic
  - reference-implementation
  - reference-architecture

custom_edit_url: https://github.com/cloudposse/terraform-aws-components/edit/master/README.md
---

# Component: `aws-components`
This is a collection of reusable Terraform components and blueprints for provisioning reference architectures.




## Introduction

In this repo you'll find real-world examples of how we've implemented various common patterns using our [terraform modules](https://cpco.io/terraform-modules) for our customers.

The component catalog captures the business logic, opinions, best practices and non-functional requirements.

It's from this catalog that other developers in your organization will pick and choose from anytime they need to deploy some new capability.

These components make a lot of assumptions about how we've configured our environments. That said, they can still serve as an excellent reference for others.

## Deprecations

Terraform components which are no longer actively maintained are now in the `deprecated/` folder.

Many of these deprecated components are used in our old reference architectures.

We intend to eventually delete, but are leaving them for now in the repo.

## Using `pre-commit` Hooks

This repository uses [pre-commit](https://pre-commit.com/) and [pre-commit-terraform](https://github.com/antonbabenko/pre-commit-terraform) to enforce consistent Terraform code and documentation. This is accomplished by triggering hooks during `git commit` to block commits that don't pass checks (E.g. format, and module documentation). You can find the hooks that are being executed in the [`.pre-commit-config.yaml`](.pre-commit-config.yaml) file.

You can install [pre-commit](https://pre-commit.com/) and this repo's pre-commit hooks on a Mac machine by running the following commands:

```bash
brew install pre-commit gawk terraform-docs coreutils
pre-commit install --install-hooks
```

Then run the following command to rebuild the docs for all Terraform components:

```bash
make rebuild-docs
```



## Usage

See each component's README directory for usage.

| Component | Description |
|-----------|-------------|
|[account](./modules/account) | Provisions the full account hierarchy along with Organizational Units (OUs). |
|[account-map](./modules/account-map) | Provisions information only: it simply populates Terraform state with data (account ids, groups, and roles) that other root modules need via outputs. |
|[account-settings](./modules/account-settings) | Provisions account level settings: IAM password policy, AWS Account Alias, and EBS encryption. |
|[cloudtrail](./modules/cloudtrail) | Provisions cloudtrail auditing in an individual account. |
|[cloudtrail-bucket](./modules/cloudtrail-bucket) | Provisions a bucket for storing cloudtrail logs for auditing purposes. |
|[datadog-integration](./modules/datadog-integration) | Provisions a DataDog <=> AWS integration. |
|[datadog-monitor](./modules/datadog-monitor) | Provisions global DataDog monitors. |
|[dms](./modules/dms) | Provisions AWS DMS resources: DMS IAM roles, DMS endpoints, DMS replication instances, DMS replication tasks. |
|[dns-delegated](./modules/dns-delegated) | Provisions a DNS zone which delegates nameservers to the DNS zone in the primary DNS account. |
|[dns-primary](./modules/dns-primary) | Provisions the primary DNS zones into an AWS account. |
|[ecr](./modules/ecr) | Provisions repositories, lifecycle rules, and permissions for streamlined ECR usage. |
|[efs](./modules/efs) | Provisions an [EFS](https://aws.amazon.com/efs/) Network File System with KMS encryption-at-rest. |
|[eks](./modules/eks) | Provisions an end-to-end EKS Cluster, including managed node groups and [spotinst ocean](https://spot.io/products/ocean/) node pools. |
|[eks-iam](./modules/eks-iam) | Provisions specific [IAM roles for Kubernetes Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html). |
|[iam-delegated-roles](./modules/iam-delegated-roles) | Provisions all delegated user and system IAM roles. |
|[iam-primary-roles](./modules/iam-primary-roles) | Provisions all primary user and system roles into the centralized identity account. |
|[sso](./modules/sso) | Provisions SAML metadata into AWS IAM as new SAML providers. |
|[tfstate-backend](./modules/tfstate-backend) | Provisions an S3 Bucket and DynamoDB table that follow security best practices for usage as a Terraform backend. |
|[transit-gateway](./modules/transit-gateway) | Provisions an AWS Transit Gateway to connect various account separated VPCs through a central hub. |
|[vpc](./modules/vpc) | Provisions a VPC and corresponing Subnets. |






<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  rebuild-docs                        Rebuild README for all Terraform components
  rebuild-mixins-docs                 Rebuild README for Terraform Mixins
  upstream-component                  Upstream a given component

```
<!-- markdownlint-restore -->
<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

No providers.

## Modules

No modules.

## Resources

No resources.

## Inputs

No inputs.

## Outputs

No outputs.
<!-- markdownlint-restore -->


