---
title: terraform-aws-vpc-peering
description: Terraform module to create a peering connection between two VPCs
---

# Terraform AWS VPC Peering

|                  |                                                                                                                                                                |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-vpc-peering>                                                                                                      |
| Terraform Module | terraform-aws-vpc-peering                                                                                                                                      |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-vpc-peering.svg)](https://github.com/cloudposse/terraform-aws-vpc-peering/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-vpc-peering.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-vpc-peering)    |

![AWS Web Console Screenshot of VPC Peering Connection](/assets/82718b8-vpc-peering.png)

# Usage

## HCL

```hcl
module "vpc_peering" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-vpc-peering.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
Both the acceptor and requestor VPCs must have subnets associated with route tables
{{% /dialog %}}

# Variables

| Name                                        | Default | Description                                                                                                                 | Required |
|:--------------------------------------------|:--------|:----------------------------------------------------------------------------------------------------------------------------|:---------|
| `namespace`                                 | ``      | Namespace (_e.g._ `cp` or `cloudposse`)                                                                                     | Yes      |
| `auto_accept`                               | `true`  | Automatically accept the peering (both VPCs need to be in the same AWS account)                                             | No       |
| `acceptor_allow_remote_vpc_dns_resolution`  | `true`  | Allow acceptor VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the requestor VPC | No       |
| `requestor_allow_remote_vpc_dns_resolution` | `true`  | Allow requestor VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the acceptor VPC | No       |
| `stage`                                     | ``      | Stage (_e.g._ `prod`, `dev`, `staging`)                                                                                     | Yes      |
| `name`                                      | ``      | Name (_e.g._ `app` or `cluster`)                                                                                            | Yes      |
| `requestor_vpc_id`                          | ``      | Requestor VPC ID                                                                                                            | Yes      |
| `acceptor_vpc_id`                           | ``      | Acceptor VPC ID                                                                                                             | Yes      |
| `attributes`                                | `[]`    | Additional attributes (_e.g._ `policy` or `role`)                                                                           | No       |
| `tags`                                      | `{}`    | Additional tags (_e.g._ `map("BusinessUnit","XYZ")`                                                                         | No       |
| `delimiter`                                 | `-`     | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`                                                 | No       |
| `enabled`                                   | `true`  | Set to `false` to prevent the module from creating or accessing any resources                                               | No       |

{{% dialog type="important" icon="fa fa-exclamation-triangle" title="Important" %}}
When enabled, the DNS resolution features (`acceptor_allow_remote_vpc_dns_resolution` and `requestor_allow_remote_vpc_dns_resolution`) require that VPCs participating in the peering must have support for the DNS hostnames enabled. This can be done using the [`enable_dns_hostnames`](https://www.terraform.io/docs/providers/aws/r/vpc.html#enable_dns_hostnames) attribute in the `aws_vpc` resource.

Read more: [www.terraform.io/docs/providers/aws/r/vpc_peering.html](https://www.terraform.io/docs/providers/aws/r/vpc_peering.html#allow_remote_vpc_dns_resolution)
{{% /dialog %}}


# Outputs

| Name            | Description                                      |
|:----------------|:-------------------------------------------------|
| `connection_id` | VPC peering connection ID                        |
| `accept_status` | The status of the VPC peering connection request |
