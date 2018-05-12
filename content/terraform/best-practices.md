---
title: "Terraform Best Practices"
description: ""
slug: "terraform-best-practices"
tags:
  - "Best Practices"
  - "Terraform"
---
![Terraform](/assets/08bcd99-terraform.png)

# Use Git Workflow

## Infrastructure as Code

Infrastructure as Code is essential for managing change control and as a system of record for disaster recovery. Configuration is a form of Intellectual Property. Without the code, you don’t own the IP.

## Feature Branches

Recommend using a consistent naming convention for branch names by all developers. Using a convention will help developers to navigate branches.

## Pull Requests

Pull Requests should express `## what` changed and `## why` it changed (e.g. business justification). This forces contributors to be clear about what is happening and makes it easier for others to follow along.

Attach a `terraform plan` against current master as a comment to all PRs.

## Code Reviews

## Tagging

For the same reason we tag/release regular software projects, we should practice the same rigor around infrastructure.

## Releases

For the same reason we release regular software projects, we should practice the same rigor around infrastructure. The release should include release notes where significant changes went out or a specific upgrade path is required.

## CI/CD

Using `atlantis` it’s possible to introduce the standard CI/CD process to manage infrastructure rollouts. As it relates to terraform, the integration test should involve a “make plan” and a merge to master or other symbolic branch triggers a `make apply`. Consider using `atlantis` as part of the workflow.


# Language

## Use terraform linting

Linting helps to ensure a consistent code formatting, improves code quality and catches common errors with syntax.

Run `terraform fmt` before committing all code. Use a `pre-commit` hook to do this automatically. See [Terraform Tips & Tricks]({{< relref "terraform/tips-tricks.md" >}})

## Use strings for all booleans and boolean comparisons

It is recommended for now to specify boolean values for variables as the strings `"true"`
and `"false"`, to avoid some caveats in the conversion process. The observed uses of booleans will not trigger the edge-cases, but please refer to footnote for details.

Read more:  https://www.terraform.io/docs/configuration/variables.html#booleans

## Use cidr math interpolation functions for network calculations

This reduces the barrier to entry for others to contribute and reduces likelihood of human error

Read more: https://www.terraform.io/docs/configuration/interpolation.html#cidrsubnet-iprange-newbits-netnum-

## Use `.editorconfig` in all repos for consistent whitespace

## Use version pinning on all providers

## Use `locals` or `data` sources to baptize opaque resource IDs


# Variables

## Use description field for all inputs

## Use sane defaults where applicable

## Use empty variables for all secrets

# Outputs

## Use description field for all outputs

## Use well formatted, snake case or hyphenated output names

# State

## Use remote state

## Use Terraform to create state bucket

This requires a two-phased approach, whereby you first provision the bucket without the remote state enabled. Then enable remote state (e.g. `s3 {}`) and import remote state by simply rerunning `terraform init`. We recommend this strategy because it promotes use of one tool for the job and makes it easier to define requirements and use consistent tooling.

Using the [`terraform-aws-tfstate-backend`](https://github.com/cloudposse/terraform-aws-tfstate-backend) module it is easy to provision state buckets.

## Use backend with support for state locking

We recommend using the S3 backend with DynamoDB for state locking.

**Pro Tip:** Using the [`terraform-aws-tfstate-backend`](https://github.com/cloudposse/terraform-aws-tfstate-backend) this can be easily implemented.

https://www.terraform.io/docs/backends/types/s3.html

## Use strict enforcement of version of `terraform` cli

Terraform state is incompatible between versions of cli. We suggest using a container to promote the use of identical tooling for all devs.

**Pro Tip:**  Use [`geodesic`](https://github.com/cloudposse/geodesic) to manage all `terraform` interactions

## Use `terraform` cli to set backend parameters

Promote reusability of a root module across accounts by not hardcoding backend requirements. Instead, use terraform cli to set the current context.

```hcl
terraform {
  required_version = ">= 0.11.2"

  backend "s3" {}
}
```

**Pro Tip:** Use [`init-terraform`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/init-terraform) in [Geodesic](/geodesic)

## Use one bucket per environment or stage

We recommend not commingling state in the same bucket. This could cause state to get overridden or compromised. Note, state contains cached values of all outputs. Where ever possible, keep stages 100% isolated with physical barriers (separate buckets, separate organizations)

**Pro Tip:** Using the [`terraform-aws-tfstate-backend`](https://github.com/cloudposse/terraform-aws-tfstate-backend) to easily provision buckets for each stage.

## Use Versioning on State Bucket

## Use Encryption at Rest on State Bucket

## Use `.gitignore` to exclude terraform state files, state directory backups and core dumps

```
.terraform
.terraform.tfstate.lock.info
*.tfstate
*.tfstate.backup
```
## Use `.dockerigore` to exclude terraform statefiles from builds

Example:
```
**/.terraform*
```
# Root Module

# Data Sources

# Resources

# AWS Specific

# Naming Conventions

# DNS Infrastructure

# Module Design

# Module Usage
