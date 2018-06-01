---
title: "Geodesic Module"
description: "Geodesic modules are Git repositories that extend the Geodesic base docker image and contain all Infrastructure as Code."
---
{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
⇠ Select one of these pages to learn more about the topic.
{{% /dialog %}}

Geodesic modules are used to logically organize infrastructure as code by leveraging git repositories. We're able to keep code extremely DRY, while at the same time incredibly maintaining modularity and stability. We accomplish this by leveraging a few common patterns:

- Docker inheritance
- Multi-stage Docker Builds
- Terraform Root modules
- Terraform Modules
- Polyrepos

We prefer the polyrepo approach to the monorepo approach when it comes in infrastructure. Git repositories allow us to surgically tag/version parts of infrastructure.


For example, we often prescribe organizing repositories by AWS organization. For the purpose of documentation, we'll use `cloudposse.co` as the example organization.

# Reference Architectures

## root.cloudposse.co

The `root.cloudposse.co` module represents your organization's "root" or "top level" AWS account. This is typically your billing organization and handles IAM user account provisioning.

## prod.cloudposse.co

The `prod.cloudposse.co` module represents your organization's "production infrastructure". It's a subaccount (organization) of the `root.cloudposse.co`

## staging.cloudposse.co

The `staging.cloudposse.co` module represents your organization's "staging infrastructure".  Typically, we treat this as a "pre-production" environment, which means it should remain stable. This environment gives developers access to a "production-like" environment, without the consequences, risks and liaiblities of actually operating in production.

## dev.cloudposse.co

The `dev.cloudposse.co` module represents your organization's "development infrastructure". This module is used as a sandbox environment where developers and test the waters and get familiar with AWS. We prescribe that organizations give all developers "Administrator" level privileges to this account in order to give them an unfettered opporutnity at developing infrastructure.

## audit.cloudposse.co

The `audit.cloudposse.co` module represents your organization's "audit logs infrastructure".  By leveraging our `terraform-root-modules`, we make it exceptionally easy to ship CloudTrail logs from all your organizations to one central, highly restrictive organization whose sole purpose is to provide a tamper-proof, encrypted, system of record for infrastructure logs with [lifecycle policies].

## testing.cloudposse.co

The `testing.cloudposse.co` module represents an organization used for continuous integration testing of infrastructure code. By provisioning a separate, dedicated organization for this we are able to silo testing infrastructure so it doesn't pollute or in any way impact other environments.
