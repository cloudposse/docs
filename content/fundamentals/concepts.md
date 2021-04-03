---
title: "Concepts"
description: "Learn more about the core concepts and domain model that make up the SweetOps methodology."
weight: 3
---

SweetOps is built on top of a number of high-level concepts and terminology that are critical to understanding prior to getting started. In this document, we break down these concepts to help you get a leg up prior to going through your first tutorial.

## Components

Components are opinionated, self-contained units of infrastructure as code that solve one, specific problem or use-case. SweetOps has two flavors of components:

1. **Terraform:** Stand-alone root modules that implement some piece of your infrastructure. For example, typical components might be an EKS cluster, RDS cluster, EFS filesystem, S3 bucket, DynamoDB table, etc. You can find the [full library of SweetOps Terraform components on GitHub](https://github.com/cloudposse/terraform-aws-components).
1. **Helmfiles**: Stand-alone, applications deployed using `helmfile` to Kubernetes. For example, typical helmfiles might deploy the DataDog agent, cert-manager controller, nginx-ingress controller, etc. Similarly, the [full library of SweetOps Helmfile components is on GitHub](https://github.com/cloudposse/helmfiles).

One important distinction about components that is worth noting: components are opinionated "root" modules that typically call other child modules. Components are the building-blocks of your infrastructure. This is where you define all the business logic for how to provision some common piece of infrastructure like ECR repos or EKS clusters. Our convention is only stick components in the `components/terraform` directory and to use `modules/` when referring to child modules intended to be called by other components. We do not recommend consuming one terraform component inside of another as that would defeat the purpose; each component is intended to be a loosely coupled unit of IaC with its own lifecycle.

## Stacks

Stacks are a way to express the complete infrastructure needed for an environment using a standard YAML configuration format that has been developed by SweetOps. Stacks consist of components and the variables inputs into those components. For example, you configure a stack for each AWS account and then reference the components which comprise that stack. The more modular the components, the easier it is to quickly define a stack without writing any new code.

Here is an example stack defined for a Dev environment in the us-west-2 region:

```yaml
# Filename: stacks/uw2-dev.yaml
import:
  - eks/eks-defaults

vars:
  stage: dev

terraform:
  vars: {}

helmfile:
  vars:
    account_number: "1234567890"

components:
  terraform:

    dns-delegated:
      vars:
        request_acm_certificate: true
        zone_config:
          - subdomain: dev
            zone_name: example.com

    vpc:
      vars:
        cidr_block: "10.122.0.0/18"

    eks:
      vars:
        cluster_kubernetes_version: "1.19"
        region_availability_zones: ["us-west-2b", "us-west-2c", "us-west-1d"]
        public_access_cidrs: ["72.107.0.0/24"]

    aurora-postgres:
      vars:
        instance_type: db.r4.large
        cluster_size: 2

    mq-broker:
      vars:
        apply_immediately: true
        auto_minor_version_upgrade: true
        deployment_mode: "ACTIVE_STANDBY_MULTI_AZ"
        engine_type: "ActiveMQ"

  helmfile:

    external-dns:
      vars:
        installed: true

    datadog:
      vars:
        installed: true
        datadogTags:
          - "env:uw2-dev"
          - "region:us-west-2"
          - "stage:dev"
```

Great, so what can you do with a stack? Stacks are meant to be a language and tool agnostic way to describe infrastructure, but how to use the stack configuration is up to you. SweetOps provides the following ways to utilize stacks today:

1. [atmos](https://github.com/cloudposse/atmos): atmos is a command-line tool that enables CLI-driven stack utilization and supports workflows around `terraform`, `helmfile`, and many other commands.
1. [Terraform Cloud](https://www.terraform.io/docs/cloud/index.html): By using the [terraform-tfe-cloud-infrastructure-automation module](https://github.com/cloudposse/terraform-tfe-cloud-infrastructure-automation) you can provision Terraform Cloud workspaces for each component in your stack using Continuous Delivery and GitOps.
1. [Spacelift](https://spacelift.io/): By using the [terraform-spacelift-cloud-infrastructure-automation module](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation) you can provision Spacelift stacks (our industry loves this word, huh?) for each component in your stack using Continuous Delivery and GitOps.

## Catalogs

Catalogs in SweetOps are collections of sharable and reusable configurations. These are typically YAML configurations that can be imported and provide solid baselines to configure security, monitoring, or other 3rd party tooling. Catalogs enable an organization to codify their best practices of configuration and share them. SweetOps provides many catlaogs to get you started.

Today SweetOps provides a couple important catalogs:

1. [DataDog Monitors](https://github.com/cloudposse/terraform-datadog-monitor/tree/master/catalog/monitors): Quickly bootstrap your SRE efforts by utilizing some of these best practice DataDog application monitors.
1. [AWS Config Rules](https://github.com/cloudposse/terraform-aws-config/tree/master/catalog): Quickly bootstrap your AWS compliance efforts by utilizing hundreds of [AWS Config](https://aws.amazon.com/config/) rules that automate security checks against many common services.
1. [AWS Service Control Policies](https://github.com/cloudposse/terraform-aws-service-control-policies/tree/master/catalog): define what permissions in your organization you want to permit or deny in member accounts.

In the future, you're likely to see additional open-source catalogs for OPA rules and tools to make sharing configurations even easier. But it is important to note that how you use catalogs is really up to you to define, and the best catalogs will be specific to your organization.

## Primary vs Delegated

Primary vs Delegated is a common implementation pattern in SweetOps. This is most easily described when looking at the example of domain and DNS usage in a mutli-account AWS organization: SweetOps takes the approach that the root domain (e.g. `example.com`) is owned by a **primary** AWS account where the apex zone resides. Subdomains on that domain (e.g. `dev.example.com`) are then **delegated** to the other AWS accounts via an `NS` record on the primary hosted zone which points to the delegated hosted zone's name servers.

You can see examples of this pattern in the [dns-primary](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/dns-primary) / [dns-delegated](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/dns-delegated) and [iam-primary-roles](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/iam-primary-roles) / [iam-delegated-roles](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/iam-delegated-roles) components.

## Docker Based Toolbox (aka Geodesic)

In the landscape of developing infrastructure, there are dozens of tools that we all need on our personal machines to do our jobs. In SweetOps, instead of having you install each tool individually, we use Docker to package all of these tools into one convenient image that you can use as your infrastructure automation toolbox. We call it [Geodesic]({{< relref "reference/tools.md#geodesic" >}}) and we use it as our DevOps automation shell and as the base Docker image for all of our DevOps tooling.

Geodesic is a DevOps Linux Distribution packaged as a Docker image that provides users the ability to utilize `atmos`, `terraform`, `kubectl`, `helmfile`, the AWS CLI, and many other popular tools that compromise the SweetOps methodology without having to invoke a dozen `install` commands to get started. It's intended to be used as an interactive cloud automation shell, a base image, or in CI/CD workflows to ensure that all systems are running the same set of versioned, easily accessible tools.

<!-- TODO: Link to How-to on "Using Geodesic" once created. -->

## Vendoring

Vendoring is a strategy of importing external dependencies into a local source tree or VCS. Many languages (e.g. NodeJS) support the concept. However, there are many other tools which do not address how to do vendoring.

There are a few reasons to do vendoring. Sometimes the tools we use do not support importing external sources. Other times, we need to make sure to have full-control over the lifecycle or versioning of some code in case the external dependencies go away.

Our current approach to vendoring of thirdparty software dependencies is to use [vendir](https://github.com/vmware-tanzu/carvel-vendir) when needed.

Example use-cases for Vendoring:

1. Terraform is one situation where it’s needed. While terraform supports child modules pulled from remote sources, components (aka root modules) cannot be pulled from remotes.
1. GitHub Actions do not currently support importing remote workflows. Using `vendir` we can easily import remote workflows.

## Generators

Generators in SweetOps are the pattern of producing code or configuration when existing tools have shortcomings that cannot be addressed through standard IaC. This is best explained through our use-cases for generators today:

1. In order to deploy AWS Config rules to every region enabled in an AWS Account, we need to specify a provider block and consume a compliance child module for each region. Unfortunately, [Terraform does not currently support the ability loop over providers](https://github.com/hashicorp/terraform/issues/19932), which results in needing to manually create these provider blocks for each region that we're targeting. On top of that, not every organization uses the same types of accounts so a hardcoded solution is not easily shared. Therefore, to avoid tedious manual work we use the generator pattern to create the `.tf` files which specify a provider block for each module and the corresponding AWS Config child module.
1. Many tools for AWS work best when profiles have been configured in the AWS Configuration file (`~/.aws/config`). If we’re working with dozens of accounts, keeping this file current on each developer's machine is error prone and tedious. Therefore we use a generator to build this configuration based on the accounts enabled.
1. Terraform backends do not support interpolation. Therefore, we define the backend configuration in our YAML stack configuration and use `atmos` as our generator to build the backend configuration files for all components.
