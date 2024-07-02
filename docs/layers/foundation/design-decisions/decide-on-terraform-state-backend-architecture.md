---
title: "Decide on Terraform State Backend Architecture"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1290633369/REFARCH-522+-+Decide+on+Terraform+State+Backend+Architecture
sidebar_position: 100
refarch_id: REFARCH-522
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/decide-on-terraform-state-backend-architecture.md
---

# Decide on Terraform State Backend Architecture

## Context and Problem Statement

We need someplace to store the terraform state. Multiple options exist (e.g. Vault, Terraform Enterprise, GitLab, Spacelift), but the only one we’ll focus on right now is using S3. The terraform state may contain secrets, which is unavoidable for certain kinds of resources (e.g. master credentials for RDS clusters). For this reason, it is advisable for companies with security and compliance requirements to segment their state backends to make it easier to control with IAM who has access to what.

While on the other hand adding multiple state backends is good from a security perspective, on the other it unnecessarily complicates the architecture for companies that do not need the added layer of security.

## Considered Options

We’ll use the [https://github.com/cloudposse/terraform-aws-tfstate-backend](https://github.com/cloudposse/terraform-aws-tfstate-backend) module to provision the state backends. This module already follows all standard best practices around private ACLs, encryption, versioning, locking, etc. Now we need to consider the options for how many buckets to manage.

This decision is reversible but very tedious to change down the road. Therefore, we recommend doing what suits the long-term objectives of your company.

Anyone who should be able to run `terraform` locally will need read/write access to a state bucket.

### Option 1: Single Bucket  (Recommended for Companies without Compliance Requirements )

:::tip
Our Recommendation is to use Option 1 because it’s the least complicated to maintain.  Additionally, if you have a small team, there won’t be a distinction between those who have or do not have access to the bucket.

:::

#### Pros

- Single bucket to manage and protect

#### Cons

- Anyone doing terraform will need access to all state and can modify that state

### Option 2: Hierarchical State Buckets

In this model, there will be one primary bucket that manages the state of all the other state buckets. But based on the number of segments you need, there will be multiple buckets that maintain the state for all the resources therein.

As part of this decision, we’ll need to decide on what those segments are (e.g. `admin`, `restricted`, `unrestricted`, `security`; or one state bucket per account) for your use-case.

#### Pros

- It’s easier to secure who can access a state bucket when there are more buckets

#### Cons

- With more buckets, it’s more to oversee

- Remote state lookups need to be aware of which bucket, account and IAM role is required to access the bucket

## References

- Links to any research, ADRs or related Jiras


