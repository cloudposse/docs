---
title: "Concepts"
description: "Learn more about the core concepts and domain model that make up the SweetOps methodology."
weight: 3
---

SweetOps is built on top of a number of high-level concepts and terminology that are critical to understand prior to getting started. In this document, we break down these concepts to help you get a leg up prior to going through your first tutorial.

## Layers
![4 Layers of Infrastructure](https://lucid.app/publicSegments/view/dc705e05-cf3e-4e03-9029-acd8c4b4812f/image.png)

SweetOps breaks down cloud infrastructure into 4 discrete layers:

1. **Foundational**: Your AWS Accounts, VPCs, IAM, and DNS architecture.
1. **Platform**: Your EKS / ECS Clusters, Load Balancers, IAM Service Accounts, and Certificates.
1. **Shared Services**: Your CI/CD pipelines, BeyondCorp solution, and Monitoring and Logging tooling.
1. **Application**: Your Backend and Frontend Applications.

We delineate between these layers as they have different lifecylces and tools that are responsible for managing them (e.g. Terraform is great for building your Foundational layer, but is not a good solution to manage your Application layer). It's also important to note that as you proceed down the layers, each layer is more likely to change over time: You won't frequently change your AWS VPCs in your Foundational layer or rebuild EKS clusters in your Platform layer, but you might add HashiCorp Vault to your Shared Services to increase your security posture or add a new API microservice to your Application layer.

## Components

Components are opinionated, self-contained units of infrastructure as code that solve one, specific problem. SweetOps has two flavors of components:

1. **Terraform:** Stand-alone root modules that implement some piece of your infrastructure. For example, typical components might be an EKS cluster, RDS cluster, EFS filesystem, S3 bucket, DynamoDB table, etc. You can find the [full library of SweetOps Terraform components on GitHub](https://github.com/cloudposse/terraform-aws-components).
1. **Helmfiles**: Stand-alone, applications deployed using `helmfile` and deployed to Kubernetes. For example, typical helmfiles might deploy the DataDog agent, cert-manager controller, nginx-ingress controller, etc. Similarly, the [full library of SweetOps Helmfile components is on GitHub](https://github.com/cloudposse/helmfiles).

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
        region_availability_zones: ["us-east-1b", "us-east-1c", "us-east-1d"]
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
1. [Terraform Cloud](https://www.terraform.io/docs/cloud/index.html): By using the [terraform-tfe-cloud-infrastructure-automation module](https://github.com/cloudposse/terraform-tfe-cloud-infrastructure-automation) you can provision Terraform Cloud workspaces for each component in your stack.
1. [Spacelift](https://spacelift.io/): By using the [terraform-spacelift-cloud-infrastructure-automation module](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation) you can provision Spacelift stacks (our industry loves this word, huh?) for each component in your stack.

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

## Docker Based Infrastructure Development

In the landscape of developing infrastructure, there are dozens of tools that we all need on our personal machines to do our jobs. In SweetOps, instead of having you install each tool individually, we use Docker to package all of these tools into one image that you can use as your infrastructure automation toolbox: [Geodesic]({{< relref "reference/tools.md#geodesic" >}}). We use `geodesic` as the base Docker image of our `Dockerfile` for all our DevOps tooling.

Geodesic is a DevOps Linux Distribution packaged as a Docker image that provides users the ability to utilize atmos, terraform, kubectl, helmfile, AWS CLI, and many other popular tools that compromise the SweetOps methodology without having to invoke a dozen `install` commands to get started. It's intended to be used as an interactive cloud automation shell, a base image, or in CI / CD scripting to ensure that all systems are running the same set of versioned, easily accessible tools.

<!-- TODO: Link to How-to on "Using Geodesic" once created. -->

