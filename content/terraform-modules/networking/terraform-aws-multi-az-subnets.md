---
title: terraform-aws-multi-az-subnets
description: >-
  Terraform module for multi-AZ
  [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html)
  provisioning.
---

# Terraform AWS Multi AZ Subnets

|                  |                                                                                                                                                                  |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-multi-az-subnets>                                                                                                   |
| Terraform Module | terraform-aws-multi-az-subnets                                                                                                                                   |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-jenkins.svg)](https://github.com/cloudposse/terraform-aws-multi-az-subnets/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-multi-az-subnets.svg)](https://travis-ci.org/cloudposse/terraform-aws-multi-az-subnets)          |

The module creates private or public subnets in the provided Availability Zones.

The public subnets are routed to the Internet Gateway specified by `var.igw_id`.

`nat_gateway_enabled` flag controls the creation of NAT Gateways in public subnets.

The private subnets are routed to the NAT Gateways provided in the `var.az_ngw_ids` map.

# Usage

## HCL

```hcl
module "vpc" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}

locals {
  public_cidr_block  = "${cidrsubnet(module.vpc.vpc_cidr_block, 1, 0)}"
  private_cidr_block = "${cidrsubnet(module.vpc.vpc_cidr_block, 1, 1)}"
}

module "public_subnets" {
  source              = "git::https://github.com/cloudposse/terraform-aws-multi-az-subnets.git?ref=master"
  namespace           = "${var.namespace}"
  stage               = "${var.stage}"
  name                = "${var.name}"
  availability_zones  = ["us-east-1a", "us-east-1b", "us-east-1c"]
  vpc_id              = "${module.vpc.vpc_id}"
  cidr_block          = "${local.public_cidr_block}"
  type                = "public"
  igw_id              = "${module.vpc.igw_id}"
  nat_gateway_enabled = "true"
}

module "private_subnets" {
  source              = "git::https://github.com/cloudposse/terraform-aws-multi-az-subnets.git?ref=master"
  namespace           = "${var.namespace}"
  stage               = "${var.stage}"
  name                = "${var.name}"
  availability_zones  = ["us-east-1a", "us-east-1b", "us-east-1c"]
  vpc_id              = "${module.vpc.vpc_id}"
  cidr_block          = "${local.private_cidr_block}"
  type                = "private"

  # Map of AZ names to NAT Gateway IDs that was created in "public_subnets" module
  az_ngw_ids          = "${module.public_subnets.az_ngw_ids}"

  # Need to explicitly provide the count since Terraform currently can't use dynamic count on computed resources from different modules
  # https://github.com/hashicorp/terraform/issues/10857
  # https://github.com/hashicorp/terraform/issues/12125
  # https://github.com/hashicorp/terraform/issues/4149
  az_ngw_count = 3
}
```

# Variables

| Name                          |                                                  Default                                                  | Description                                                                                                                                                                                                                 | Required |
|:------------------------------|:---------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|
| `namespace`                   |                                                    ``                                                     | Namespace (_e.g._ `cp` or `cloudposse`)                                                                                                                                                                                     |   Yes    |
| `stage`                       |                                                    ``                                                     | Stage (_e.g._ `prod`, `dev`, `staging`)                                                                                                                                                                                     |   Yes    |
| `name`                        |                                                    ``                                                     | Application or solution name (_e.g._ `myapp`)                                                                                                                                                                               |   Yes    |
| `delimiter`                   |                                                    `-`                                                    | Delimiter to use between `name`, `namespace`, `stage`, `attributes`                                                                                                                                                         |    No    |
| `attributes`                  |                                                   `[]`                                                    | Additional attributes (_e.g._ `policy` or `role`)                                                                                                                                                                           |    No    |
| `tags`                        |                                                   `{}`                                                    | Additional tags  (_e.g._ `map("BusinessUnit","XYZ")`                                                                                                                                                                        |    No    |
| `max_subnets`                 |                                                   `16`                                                    | Maximum number of subnets that can be created. This variable is used for CIDR blocks calculation. MUST be greater than the length of `availability_zones` list                                                              |   Yes    |
| `availability_zones`          |                                                    []                                                     | List of Availability Zones (e.g. `["us-east-1a", "us-east-1b", "us-east-1c"]`)                                                                                                                                              |   Yes    |
| `type`                        |                                                 `private`                                                 | Type of subnets to create (`private` or `public`)                                                                                                                                                                           |   Yes    |
| `vpc_id`                      |                                                    ``                                                     | VPC ID where subnets are created (_e.g._ `vpc-aceb2723`)                                                                                                                                                                    |   Yes    |
| `cidr_block`                  |                                                    ``                                                     | Base CIDR block which is divided into subnet CIDR blocks (_e.g._ `10.0.0.0/24`)                                                                                                                                             |    No    |
| `igw_id`                      |                                                    ``                                                     | Only for public subnets. Internet Gateway ID which is used as a default route when creating public subnets (_e.g._ `igw-9c26a123`)                                                                                          |   Yes    |
| `public_network_acl_id`       |                                                    ``                                                     | ID of Network ACL which is added to the public subnets. If empty, a new ACL will be created                                                                                                                                 |    No    |
| `private_network_acl_id`      |                                                    ``                                                     | ID of Network ACL which is added to the private subnets. If empty, a new ACL will be created                                                                                                                                |    No    |
| `public_network_acl_egress`   | see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf) | Egress rules which are added to the new Public Network ACL                                                                                                                                                                  |    No    |
| `public_network_acl_ingress`  | see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf) | Ingress rules which are added to the new Public Network ACL                                                                                                                                                                 |    No    |
| `private_network_acl_egress`  | see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf) | Egress rules which are added to the new Private Network ACL                                                                                                                                                                 |    No    |
| `private_network_acl_ingress` | see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf) | Ingress rules which are added to the new Private Network ACL                                                                                                                                                                |    No    |
| `enabled`                     |                                                  `true`                                                   | Set to `false` to prevent the module from creating any resources                                                                                                                                                            |    No    |
| `nat_gateway_enabled`         |                                                  `true`                                                   | Flag to enable/disable NAT Gateways creation in public subnets                                                                                                                                                              |    No    |
| `az_ngw_ids`                  |                                                    {}                                                     | Map of AZ names to NAT Gateway IDs which are used as default routes when creating private subnets. Only for private subnets                                                                                                 |    No    |
| `az_ngw_count`                |                                                     0                                                     | Count of items in the `az_ngw_ids` map. Needs to be explicitly provided since Terraform currently can't use dynamic count on computed resources from different modules. https://github.com/hashicorp/terraform/issues/10857 |    No    |


# Outputs

| Name               | Description                                                  |
|:-------------------|:-------------------------------------------------------------|
| az_subnet_ids      | Map of AZ names to subnet IDs                                |
| az_route_table_ids | Map of AZ names to Route Table IDs                           |
| az_ngw_ids         | Map of AZ names to NAT Gateway IDs (only for public subnets) |
