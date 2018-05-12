---
title: "terraform-aws-named-subnets"
description: "Terraform module for named [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html) provisioning."
---
# Terraform AWS Named Subnets



|                  |                                                                                                                                                                    |  |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-named-subnets                                                                                                          |  |
| Terraform Module | terraform-aws-named-subnets                                                                                                                                        |  |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-named-subnets.svg)](https://github.com/cloudposse/terraform-aws-named-subnets/releases) |  |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-named-subnets.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-named-subnets)    |  |


# Usage

## Example 1

Simple example, with private and public subnets in one Availability Zone:

##### HCL
```hcl
module "vpc" {
  source     = "git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master"
  namespace  = "${var.namespace}"
  name       = "vpc"
  stage      = "${var.stage}"
  cidr_block = "${var.cidr_block}"
}

locals {
  public_cidr_block  = "${cidrsubnet(module.vpc.vpc_cidr_block, 1, 0)}"
  private_cidr_block = "${cidrsubnet(module.vpc.vpc_cidr_block, 1, 1)}"
}

module "public_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["web1", "web2", "web3"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.public_cidr_block}"
  type              = "public"
  igw_id            = "${module.vpc.igw_id}"
  availability_zone = "us-east-1a"
}

module "private_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["kafka", "cassandra", "zookeeper"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.private_cidr_block}"
  type              = "private"
  availability_zone = "us-east-1a"
  ngw_id            = "${module.public_subnets.ngw_id}"
}
```

## Example 2

Simple example, with `ENI` as default route gateway for private subnets

##### HCL
```hcl
resource "aws_network_interface" "default" {
  subnet_id         = "${module.us_east_1b_public_subnets.subnet_ids[0]}"
  source_dest_check = "false"
  tags              = "${module.network_interface_label.id}
}

module "us_east_1b_private_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.us_east_1b_private_cidr_block}"
  type              = "private"
  availability_zone = "us-east-1b"
  eni_id            = "${aws_network_interface.default.id}"
  attributes        = ["us-east-1b"]
}
```


## Example 3

Full example, with private and public subnets in two Availability Zones for High Availability:

##### HCL
```hcl
module "vpc" {
  source     = "git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master"
  namespace  = "${var.namespace}"
  name       = "vpc"
  stage      = "${var.stage}"
  cidr_block = "${var.cidr_block}"
}

locals {
  us_east_1a_public_cidr_block  = "${cidrsubnet(module.vpc.vpc_cidr_block, 2, 0)}"
  us_east_1a_private_cidr_block = "${cidrsubnet(module.vpc.vpc_cidr_block, 2, 1)}"
  us_east_1b_public_cidr_block  = "${cidrsubnet(module.vpc.vpc_cidr_block, 2, 2)}"
  us_east_1b_private_cidr_block = "${cidrsubnet(module.vpc.vpc_cidr_block, 2, 3)}"
}

module "us_east_1a_public_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["apples", "oranges", "grapes"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.us_east_1a_public_cidr_block}"
  type              = "public"
  igw_id            = "${module.vpc.igw_id}"
  availability_zone = "us-east-1a"
  attributes        = ["us-east-1a"]
}

module "us_east_1a_private_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.us_east_1a_private_cidr_block}"
  type              = "private"
  availability_zone = "us-east-1a"
  ngw_id            = "${module.us_east_1a_public_subnets.ngw_id}"
  attributes        = ["us-east-1a"]
}

module "us_east_1b_public_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["apples", "oranges", "grapes"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.us_east_1b_public_cidr_block}"
  type              = "public"
  igw_id            = "${module.vpc.igw_id}"
  availability_zone = "us-east-1b"
  attributes        = ["us-east-1b"]
}

module "us_east_1b_private_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.us_east_1b_private_cidr_block}"
  type              = "private"
  availability_zone = "us-east-1b"
  ngw_id            = "${module.us_east_1b_public_subnets.ngw_id}"
  attributes        = ["us-east-1b"]
}

resource "aws_network_interface" "default" {
  subnet_id         = "${module.us_east_1b_public_subnets.subnet_ids[0]}"
  source_dest_check = "false"
  tags              = "${module.network_interface_label.id}
}

module "us_east_1b_private_subnets" {
  source            = "git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master"
  namespace         = "${var.namespace}"
  stage             = "${var.stage}"
  name              = "${var.name}"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = "${module.vpc.vpc_id}"
  cidr_block        = "${local.us_east_1b_private_cidr_block}"
  type              = "private"
  availability_zone = "us-east-1b"
  eni_id            = "${aws_network_interface.default.id}"
  attributes        = ["us-east-1b"]
}
```

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Important" %}}
You must use only one type of device for a default route gateway per route table. `ENI` or `NGW`
{{% /dialog %}}

# Inputs

| Name                          | Default                                                                                                | Description                                                                                                                                         | Required |
|:------------------------------|:-------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| `namespace`                   |                                                                                                        | Namespace (_e.g._ `cp` or `cloudposse`)                                                                                                             | Yes      |
| `type`                        | `private`                                                                                              | Type of subnets (`private` or `public`)                                                                                                             | No       |
| `vpc_id`                      |                                                                                                        | VPC ID where subnets are created (_e.g._ `vpc-aceb2723`)                                                                                            | Yes      |
| `cidr_block`                  |                                                                                                        | Base CIDR block which is divided into subnet CIDR blocks (_e.g._ `10.0.0.0/24`)                                                                     | No       |
| `igw_id`                      |                                                                                                        | Internet Gateway ID which is used as a default route in public route tables (_e.g._ `igw-9c26a123`)                                                 | Yes      |
| `ngw_id`                      |                                                                                                        | NAT Gateway ID which is used as a default route in private route tables (_e.g._ `igw-9c26a123`)                                                     | Yes      |
| `eni_id`                      |                                                                                                        | An ID of a network interface which is used as a default route in private route tables (_e.g._ `eni-9c26a123`)                                       | Yes      |
| `public_network_acl_id`       |                                                                                                        | ID of Network ACL which is added to the public subnets. If empty, a new ACL will be created                                                         | No       |
| `private_network_acl_id`      |                                                                                                        | ID of Network ACL which is added to the private subnets. If empty, a new ACL will be created                                                        | No       |
| `public_network_acl_egress`   | see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf) | Egress rules which will be added to the new Public Network ACL                                                                                      | No       |
| `public_network_acl_ingress`  | see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf) | Ingress rules which will be added to the new Public Network ACL                                                                                     | No       |
| `stage`                       |                                                                                                        | Stage (_e.g._ `prod`, `dev`, `staging`)                                                                                                             | Yes      |
| `private_network_acl_egress`  | see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf) | Egress rules which will be added to the new Private Network ACL                                                                                     | No       |
| `private_network_acl_ingress` | see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf) | Ingress rules which will be added to the new Private Network ACL                                                                                    | No       |
| `enabled`                     | `true`                                                                                                 | Set to `false` to prevent the module from creating any resources                                                                                    | No       |
| `nat_enabled`                 | `true`                                                                                                 | Set to `false` if NAT Gateway is not required in `public` subnet                                                                                    | No       |
| `name`                        |                                                                                                        | Application or solution name (_e.g._ `myapp`)                                                                                                       | Yes      |
| `delimiter`                   | `-`                                                                                                    | Delimiter to use between `name`, `namespace`, `stage`, `attributes`                                                                                 | No       |
| `attributes`                  | `[]`                                                                                                   | Additional attributes (_e.g._ `policy` or `role`)                                                                                                   | No       |
| `tags`                        | `{}`                                                                                                   | Additional tags  (_e.g._ `map("BusinessUnit","XYZ")`                                                                                                | No       |
| `subnet_names`                |                                                                                                        | List of subnet names (_e.g._ `["kafka", "cassandra", "zookeeper"]`)                                                                                 | Yes      |
| `max_subnets`                 | `16`                                                                                                   | Maximum number of subnets that can be created. This variable is being used for CIDR blocks calculation. MUST be greater than length of `names` list | No       |
| `availability_zone`           |                                                                                                        | Availability Zone where subnets are created (_e.g._ `us-east-1a`)                                                                                   | Yes      |

# Outputs

| Name               | Description                           |
|:-------------------|:--------------------------------------|
| `ngw_id`           | NAT Gateway ID                        |
| `ngw_private_ip`   | Private IP address of the NAT Gateway |
| `ngw_public_ip`    | Public IP address of the NAT Gateway  |
| `route_table_ids`  | Route Table IDs                       |
| `subnet_ids`       | Subnet IDs                            |
| `named_subnet_ids` | Map of subnet names to subnet IDs     |
