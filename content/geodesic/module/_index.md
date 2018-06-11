---
title: "Geodesic Module"
description: "Geodesic modules are Git repositories that extend the Geodesic base docker image and contain all Infrastructure as Code."
---
{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
⇠ Select one of these pages to learn more about the topic.
{{% /dialog %}}

We believe that infrastructure as code should be treated just like all other code: tested, bundled into artifacts and automatically deployed. This is what `geodesic` solves. A geodesic module is a docker container/image which contains all the Infrastructure as Code necessary to provsion logically related IaaS resources (e.g. AWS Organizations, IAM Roles/Permissions, CDNs, S3 Buckets, Kubernetes Clusters, etc).

For example, when we need to provision resources using `terraform`, we'll build a docker container that inherits from the `geodesic` base image and `COPY` all the `*.tf` code into the image on `docker build`. Now we can run that container to provision infrastructure anywhere we have `docker` installed (for example from CI/CD systems), without needing to configure, version and maintain a bunch of native tools. In practice, we use geodesic modules to bundle terraform code, kops manifests, ansible code, and more.

Geodesic modules are used to logically organize infrastructure as code by leveraging git repositories. We're able to keep code extremely DRY, while at the same time incredibly maintaining modularity and stability. We accomplish this by leveraging a few common patterns:

- [Docker inheritance]({{< relref "tools/docker/best-practices.md#inheritance" >}})
- [Multi-stage Docker Builds]({{< relref "tools/docker/best-practices.md#multi-stage-builds" >}})
- [Terraform Root modules]({{< relref "terraform-modules/root/_index.md" >}})
- [Terraform Modules](/terraform-modules/)
- [Polyrepos]({{< relref "glossary/polyrepo.md" >}}) to logically organize infrastructure. Use modules to capture/import business logic.

We prefer the polyrepo approach to the monorepo approach when it comes in infrastructure. Git repositories allow us to surgically tag/version infrastructure code that represents some kind of business logic.

For example, we often prescribe organizing repositories by AWS organization. For the purpose of documentation, we'll use `cloudposse.co` as the example organization.

# Reference Architectures

## root.cloudposse.co

The [`root.cloudposse.co`](https://github.com/cloudposse/root.cloudposse.co) module represents an organization's "root" or "top level" AWS account. This is typically your billing organization and handles IAM user account provisioning.

It should also use the `terraform` resource  [`aws_organizations_organization`](https://www.terraform.io/docs/providers/aws/r/organizations_organization.html) and [organizations_account](https://www.terraform.io/docs/providers/aws/r/organizations_account.html) to provision all the subaccounts within the root organization.

## prod.cloudposse.co

The [`prod.cloudposse.co`](https://github.com/cloudposse/prod.cloudposse.co) module represents an organization's "production infrastructure". It's a subaccount of the [`root.cloudposse.co`](https://github.com/cloudposse/root.cloudposse.co).

## staging.cloudposse.co

The [`staging.cloudposse.co`](https://github.com/cloudposse/staging.cloudposse.co) module represents an organization's "staging infrastructure".  Typically, we treat this as a "pre-production" environment, which means it should remain stable and treated as though it were a real production environment. This environment gives developers access to a "production-like" environment, without the consequences, risks and liaiblities of actually operating in production.

## dev.cloudposse.co

The [`dev.cloudposse.co`](https://github.com/cloudposse/dev.cloudposse.co) module represents an organization's "development infrastructure". This module is used as a sandbox environment where developers and test the waters and get familiar with AWS. We prescribe that organizations give all developers "Administrator" level privileges to this account where developers may test the waters.

## audit.cloudposse.co

The [`audit.cloudposse.co`](https://github.com/cloudposse/audit.cloudposse.co) module represents an organization's "audit logs infrastructure".  By leveraging our [`terraform-aws-cloudtrail`](https://github.com/cloudposse/terraform-aws-cloudtrail) and [`terraform-aws-cloudtrail-s3-bucket`](https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket)  modules, we make it exceptionally easy to ship CloudTrail logs from all your organizations to one central, highly restrictive organization whose sole purpose is to provide a tamper-proof, encrypted, system of record for infrastructure logs with [lifecycle rules]({{< relref "terraform/tips-tricks.md#s3-bucket-lifecycle-rules" >}}).

We provide an example invocation of this pattern in our [`terraform-root-modules`](https://github.com/cloudposse/terraform-root-modules/tree/0.1.5/aws/cloudtrail)

## testing.cloudposse.co

The [`testing.cloudposse.co`](https://github.com/cloudposse/testing.cloudposse.co) module represents an organizational unit used for continuous integration and testing of infrastructure code. By provisioning a separate, dedicated organizational unit (or just account) for this we are able to silo testing infrastructure so it doesn't pollute or in any way impact other environments.
