---
title: "terraform-aws-named-subnets"
excerpt: "Terraform module for named [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html) provisioning."
---
# Terraform AWS Named Subnets 


[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-named-subnets",
    "1-1": "terraform-aws-named-subnets",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-named-subnets.svg)](https://github.com/cloudposse/terraform-aws-named-subnets/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-named-subnets.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-named-subnets)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

## Example 1
 
Simple example, with private and public subnets in one Availability Zone:
[block:code]
{
  "codes": [
    {
      "code": "module \"vpc\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master\"\n  namespace  = \"${var.namespace}\"\n  name       = \"vpc\"\n  stage      = \"${var.stage}\"\n  cidr_block = \"${var.cidr_block}\"\n}\n\nlocals {\n  public_cidr_block  = \"${cidrsubnet(module.vpc.vpc_cidr_block, 1, 0)}\"\n  private_cidr_block = \"${cidrsubnet(module.vpc.vpc_cidr_block, 1, 1)}\"\n}\n\nmodule \"public_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"web1\", \"web2\", \"web3\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.public_cidr_block}\"\n  type              = \"public\"\n  igw_id            = \"${module.vpc.igw_id}\"\n  availability_zone = \"us-east-1a\"\n}\n\nmodule \"private_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"kafka\", \"cassandra\", \"zookeeper\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.private_cidr_block}\"\n  type              = \"private\"\n  availability_zone = \"us-east-1a\"\n  ngw_id            = \"${module.public_subnets.ngw_id}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
## Example 2

Simple example, with `ENI` as default route gateway for private subnets
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_network_interface\" \"default\" {\n  subnet_id         = \"${module.us_east_1b_public_subnets.subnet_ids[0]}\"\n  source_dest_check = \"false\"\n  tags              = \"${module.network_interface_label.id}\n}\n\nmodule \"us_east_1b_private_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"charlie\", \"echo\", \"bravo\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.us_east_1b_private_cidr_block}\"\n  type              = \"private\"\n  availability_zone = \"us-east-1b\"\n  eni_id            = \"${aws_network_interface.default.id}\"\n  attributes        = [\"us-east-1b\"]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

## Example 3

Full example, with private and public subnets in two Availability Zones for High Availability:
[block:code]
{
  "codes": [
    {
      "code": "module \"vpc\" {\n  source     = \"git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master\"\n  namespace  = \"${var.namespace}\"\n  name       = \"vpc\"\n  stage      = \"${var.stage}\"\n  cidr_block = \"${var.cidr_block}\"\n}\n\nlocals {\n  us_east_1a_public_cidr_block  = \"${cidrsubnet(module.vpc.vpc_cidr_block, 2, 0)}\"\n  us_east_1a_private_cidr_block = \"${cidrsubnet(module.vpc.vpc_cidr_block, 2, 1)}\"\n  us_east_1b_public_cidr_block  = \"${cidrsubnet(module.vpc.vpc_cidr_block, 2, 2)}\"\n  us_east_1b_private_cidr_block = \"${cidrsubnet(module.vpc.vpc_cidr_block, 2, 3)}\"\n}\n\nmodule \"us_east_1a_public_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"apples\", \"oranges\", \"grapes\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.us_east_1a_public_cidr_block}\"\n  type              = \"public\"\n  igw_id            = \"${module.vpc.igw_id}\"\n  availability_zone = \"us-east-1a\"\n  attributes        = [\"us-east-1a\"]\n}\n\nmodule \"us_east_1a_private_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"charlie\", \"echo\", \"bravo\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.us_east_1a_private_cidr_block}\"\n  type              = \"private\"\n  availability_zone = \"us-east-1a\"\n  ngw_id            = \"${module.us_east_1a_public_subnets.ngw_id}\"\n  attributes        = [\"us-east-1a\"]\n}\n\nmodule \"us_east_1b_public_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"apples\", \"oranges\", \"grapes\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.us_east_1b_public_cidr_block}\"\n  type              = \"public\"\n  igw_id            = \"${module.vpc.igw_id}\"\n  availability_zone = \"us-east-1b\"\n  attributes        = [\"us-east-1b\"]\n}\n\nmodule \"us_east_1b_private_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"charlie\", \"echo\", \"bravo\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.us_east_1b_private_cidr_block}\"\n  type              = \"private\"\n  availability_zone = \"us-east-1b\"\n  ngw_id            = \"${module.us_east_1b_public_subnets.ngw_id}\"\n  attributes        = [\"us-east-1b\"]\n}\n\nresource \"aws_network_interface\" \"default\" {\n  subnet_id         = \"${module.us_east_1b_public_subnets.subnet_ids[0]}\"\n  source_dest_check = \"false\"\n  tags              = \"${module.network_interface_label.id}\n}\n\nmodule \"us_east_1b_private_subnets\" {\n  source            = \"git::https://github.com/cloudposse/terraform-aws-named-subnets.git?ref=master\"\n  namespace         = \"${var.namespace}\"\n  stage             = \"${var.stage}\"\n  name              = \"${var.name}\"\n  subnet_names      = [\"charlie\", \"echo\", \"bravo\"]\n  vpc_id            = \"${module.vpc.vpc_id}\"\n  cidr_block        = \"${local.us_east_1b_private_cidr_block}\"\n  type              = \"private\"\n  availability_zone = \"us-east-1b\"\n  eni_id            = \"${aws_network_interface.default.id}\"\n  attributes        = [\"us-east-1b\"]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "IMPORTANT",
  "body": "You must use only one type of device for a default route gateway per route table. `ENI` or `NGW`"
}
[/block]
# Inputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "Yes",
    "7-3": "No",
    "8-3": "Yes",
    "9-3": "No",
    "10-3": "Yes",
    "11-3": "No",
    "12-3": "Yes",
    "13-3": "Yes",
    "14-3": "Yes",
    "15-3": "No",
    "16-3": "No",
    "17-3": "No",
    "18-3": "No",
    "19-3": "No",
    "20-3": "No",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Application or solution name (_e.g._ `myapp`)",
    "3-2": "Delimiter to use between `name`, `namespace`, `stage`, `attributes`",
    "4-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "5-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "6-2": "List of subnet names (_e.g._ `[\"kafka\", \"cassandra\", \"zookeeper\"]`)",
    "7-2": "Maximum number of subnets that can be created. This variable is being used for CIDR blocks calculation. MUST be greater than length of `names` list",
    "8-2": "Availability Zone where subnets are created (_e.g._ `us-east-1a`)",
    "9-2": "Type of subnets (`private` or `public`)",
    "10-2": "VPC ID where subnets are created (_e.g._ `vpc-aceb2723`)",
    "11-2": "Base CIDR block which is divided into subnet CIDR blocks (_e.g._ `10.0.0.0/24`)",
    "12-2": "Internet Gateway ID which is used as a default route in public route tables (_e.g._ `igw-9c26a123`)",
    "13-2": "NAT Gateway ID which is used as a default route in private route tables (_e.g._ `igw-9c26a123`)",
    "14-2": "An ID of a network interface which is used as a default route in private route tables (_e.g._ `eni-9c26a123`)",
    "15-2": "ID of Network ACL which is added to the public subnets. If empty, a new ACL will be created",
    "16-2": "ID of Network ACL which is added to the private subnets. If empty, a new ACL will be created",
    "17-2": "Egress rules which will be added to the new Public Network ACL",
    "18-2": "Ingress rules which will be added to the new Public Network ACL",
    "19-2": "Egress rules which will be added to the new Private Network ACL",
    "20-2": "Ingress rules which will be added to the new Private Network ACL",
    "21-2": "Set to `false` to prevent the module from creating any resources",
    "22-2": "Set to `false` if NAT Gateway is not required in `public` subnet",
    "21-3": "No",
    "22-3": "No",
    "22-1": "`true`",
    "21-1": "`true`",
    "20-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf)",
    "19-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf)",
    "18-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf)",
    "17-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-named-subnets/blob/master/variables.tf)",
    "16-1": "``",
    "15-1": "``",
    "14-1": "``",
    "13-1": "``",
    "12-1": "``",
    "11-1": "``",
    "10-1": "``",
    "9-1": "`private`",
    "8-1": "``",
    "7-1": "`16`",
    "6-1": "``",
    "5-1": "`{}`",
    "4-1": "`[]`",
    "3-1": "`-`",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`delimiter`",
    "4-0": "`attributes`",
    "5-0": "`tags`",
    "6-0": "`subnet_names`",
    "7-0": "`max_subnets`",
    "8-0": "`availability_zone`",
    "9-0": "`type`",
    "10-0": "`vpc_id`",
    "11-0": "`cidr_block`",
    "12-0": "`igw_id`",
    "13-0": "`ngw_id`",
    "14-0": "`eni_id`",
    "15-0": "`public_network_acl_id`",
    "16-0": "`private_network_acl_id`",
    "17-0": "`public_network_acl_egress`",
    "18-0": "`public_network_acl_ingress`",
    "19-0": "`private_network_acl_egress`",
    "20-0": "`private_network_acl_ingress`",
    "21-0": "`enabled`",
    "22-0": "`nat_enabled`"
  },
  "cols": 4,
  "rows": 23
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`ngw_id`",
    "0-1": "NAT Gateway ID",
    "1-0": "`ngw_private_ip`",
    "1-1": "Private IP address of the NAT Gateway",
    "2-0": "`ngw_public_ip`",
    "2-1": "Public IP address of the NAT Gateway",
    "3-0": "`route_table_ids`",
    "3-1": "Route Table IDs",
    "4-0": "`subnet_ids`",
    "4-1": "Subnet IDs",
    "5-0": "`named_subnet_ids`",
    "5-1": "Map of subnet names to subnet IDs"
  },
  "cols": 2,
  "rows": 6
}
[/block]