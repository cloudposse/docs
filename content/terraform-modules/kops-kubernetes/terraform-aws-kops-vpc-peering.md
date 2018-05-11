---
title: terraform-aws-kops-vpc-peering
description: >-
  Terraform module to create a peering connection between a backing services VPC
  and a VPC created by [Kops](https://github.com/kubernetes/kops).
---

# Terraform AWS Kops VPC Peering

|                  |                                                                                                                                                                          |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-kops-vpc-peering>                                                                                                           |
| Terraform Module | terraform-aws-kops-vpc-peering                                                                                                                                           |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-vpc-peering.svg)](https://github.com/cloudposse/terraform-aws-kops-vpc-peering/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-vpc-peering.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-vpc-peering)    |

The module depends on the following Terraform modules

- [terraform-aws-kops-metadata]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-metadata.md" >}}) - to lookup resources within a Kops cluster
- [terraform-aws-vpc-peering]({{< relref "terraform-modules/networking/terraform-aws-vpc-peering.md" >}}) - to create a peering connection between two VPCs

# Usage

## HCL

```hcl
module "kops_vpc_peering" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-kops-vpc-peering.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
The backing services VPC must have subnets associated with route tables.
{{% /dialog %}}

# Variables

| Name                                               | Default   | Description                                                                                                                          | Required |
|:---------------------------------------------------|:----------|:-------------------------------------------------------------------------------------------------------------------------------------|:---------|
| `namespace`                                        |           | Namespace (_e.g._ `cp` or `cloudposse`)                                                                                              | Yes      |
| `tags`                                             | `{}`      | Additional tags (_e.g._ `map("BusinessUnit","XYZ")`                                                                                  | No       |
| `delimiter`                                        | `-`       | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`                                                          | No       |
| `enabled`                                          | `true`    | Set to `false` to prevent the module from creating or accessing any resources                                                        | No       |
| `auto_accept`                                      | `true`    | Automatically accept the peering (both VPCs need to be in the same AWS account)                                                      | No       |
| `backing_services_allow_remote_vpc_dns_resolution` | `true`    | Allow the backing services VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the `Kops` VPC | No       |
| `stage`                                            |           | Stage (_e.g._ `prod`, `dev`, `staging`)                                                                                              | Yes      |
| `name`                                             |           | Name (_e.g._ `app` or `cluster`)                                                                                                     | Yes      |
| `backing_services_vpc_id`                          | ``        | Backing services VPC ID                                                                                                              | Yes      |
| `dns_zone`                                         |           | Name of the Kops DNS zone                                                                                                            | Yes      |
| `bastion_name`                                     | `bastion` | Bastion server subdomain name in the `Kops` DNS zone                                                                                 | Yes      |
| `masters_name`                                     | `masters` | K8s masters subdomain name in the `Kops` DNS zone                                                                                    | Yes      |
| `nodes_name`                                       | `nodes`   | K8s nodes subdomain name in the `Kops` DNS zone                                                                                      | Yes      |
| `attributes`                                       | `[]`      | Additional attributes (_e.g._ `policy` or `role`)                                                                                    | No       |

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
When enabled, the DNS resolution feature (`backing_services_allow_remote_vpc_dns_resolution`) require that the backing services VPC must have support for the DNS hostnames enabled.

This can be done using the [`enable_dns_hostnames`](https://www.terraform.io/docs/providers/aws/r/vpc.html#enable_dns_hostnames) attribute in the `aws_vpc` resource.

Read more: [www.terraform.io/docs/providers/aws/r/vpc_peering.html](https://www.terraform.io/docs/providers/aws/r/vpc_peering.html#allow_remote_vpc_dns_resolution)
{{% /dialog %}}

# Outputs

| Name            | Description                                      |
|:----------------|:-------------------------------------------------|
| `connection_id` | VPC peering connection ID                        |
| `accept_status` | The status of the VPC peering connection request |
| `kops_vpc_id`   | Kops VPC ID                                      |
