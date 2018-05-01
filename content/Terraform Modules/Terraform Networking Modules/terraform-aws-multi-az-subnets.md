---
title: "terraform-aws-multi-az-subnets"
excerpt: "Terraform module for multi-AZ [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html) provisioning."
---
# Terraform AWS Multi AZ Subnets
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-multi-az-subnets",
    "1-1": "terraform-aws-multi-az-subnets",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-jenkins.svg)](https://github.com/cloudposse/tterraform-aws-multi-az-subnets/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-multi-az-subnets.svg)](https://travis-ci.org/cloudposse/terraform-aws-multi-az-subnets)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The module creates private or public subnets in the provided Availability Zones.

The public subnets are routed to the Internet Gateway specified by `var.igw_id`.

`nat_gateway_enabled` flag controls the creation of NAT Gateways in public subnets.

The private subnets are routed to the NAT Gateways provided in the `var.az_ngw_ids` map.


# Usage

[block:code]
{
  "codes": [
    {
      "code": "module \"vpc\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}\n\nlocals {\n  public_cidr_block  = \"${cidrsubnet(module.vpc.vpc_cidr_block, 1, 0)}\"\n  private_cidr_block = \"${cidrsubnet(module.vpc.vpc_cidr_block, 1, 1)}\"\n}\n\nmodule \"public_subnets\" {\n  source              = \"git::https://github.com/cloudposse/terraform-aws-multi-az-subnets.git?ref=master\"\n  namespace           = \"${var.namespace}\"\n  stage               = \"${var.stage}\"\n  name                = \"${var.name}\"\n  availability_zones  = [\"us-east-1a\", \"us-east-1b\", \"us-east-1c\"]\n  vpc_id              = \"${module.vpc.vpc_id}\"\n  cidr_block          = \"${local.public_cidr_block}\"\n  type                = \"public\"\n  igw_id              = \"${module.vpc.igw_id}\"\n  nat_gateway_enabled = \"true\"\n}\n\nmodule \"private_subnets\" {\n  source              = \"git::https://github.com/cloudposse/terraform-aws-multi-az-subnets.git?ref=master\"\n  namespace           = \"${var.namespace}\"\n  stage               = \"${var.stage}\"\n  name                = \"${var.name}\"\n  availability_zones  = [\"us-east-1a\", \"us-east-1b\", \"us-east-1c\"]\n  vpc_id              = \"${module.vpc.vpc_id}\"\n  cidr_block          = \"${local.private_cidr_block}\"\n  type                = \"private\"\n\n  # Map of AZ names to NAT Gateway IDs that was created in \"public_subnets\" module\n  az_ngw_ids          = \"${module.public_subnets.az_ngw_ids}\"\n\n  # Need to explicitly provide the count since Terraform currently can't use dynamic count on computed resources from different modules\n  # https://github.com/hashicorp/terraform/issues/10857\n  # https://github.com/hashicorp/terraform/issues/12125\n  # https://github.com/hashicorp/terraform/issues/4149\n  az_ngw_count = 3\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-0": "`namespace`",
    "0-1": "``",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "0-3": "Yes",
    "1-0": "`stage`",
    "1-1": "``",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "1-3": "Yes",
    "2-0": "`name`",
    "2-1": "``",
    "2-2": "Application or solution name (_e.g._ `myapp`)",
    "2-3": "Yes",
    "3-0": "`delimiter`",
    "3-1": "`-`",
    "3-2": "Delimiter to use between `name`, `namespace`, `stage`, `attributes`",
    "3-3": "No",
    "4-0": "`attributes`",
    "4-1": "`[]`",
    "4-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "4-3": "No",
    "5-0": "`tags`",
    "5-1": "`{}`",
    "5-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "5-3": "No",
    "6-0": "`max_subnets`",
    "6-1": "`16`",
    "6-2": "Maximum number of subnets that can be created. This variable is used for CIDR blocks calculation. MUST be greater than the length of `availability_zones` list",
    "6-3": "Yes",
    "7-0": "`availability_zones`",
    "7-1": "[]",
    "7-2": "List of Availability Zones (e.g. `[\"us-east-1a\", \"us-east-1b\", \"us-east-1c\"]`)",
    "7-3": "Yes",
    "8-0": "`type`",
    "8-1": "`private`",
    "8-2": "Type of subnets to create (`private` or `public`)",
    "8-3": "Yes",
    "9-0": "`vpc_id`",
    "9-1": "``",
    "9-2": "VPC ID where subnets are created (_e.g._ `vpc-aceb2723`)",
    "9-3": "Yes",
    "10-0": "`cidr_block`",
    "10-1": "``",
    "10-2": "Base CIDR block which is divided into subnet CIDR blocks (_e.g._ `10.0.0.0/24`)",
    "10-3": "No",
    "11-0": "`igw_id`",
    "11-1": "``",
    "11-2": "Only for public subnets. Internet Gateway ID which is used as a default route when creating public subnets (_e.g._ `igw-9c26a123`)",
    "11-3": "Yes",
    "12-0": "`public_network_acl_id`",
    "12-1": "``",
    "12-2": "ID of Network ACL which is added to the public subnets. If empty, a new ACL will be created",
    "12-3": "No",
    "13-0": "`private_network_acl_id`",
    "13-1": "``",
    "13-2": "ID of Network ACL which is added to the private subnets. If empty, a new ACL will be created",
    "13-3": "No",
    "14-0": "`public_network_acl_egress`",
    "14-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf)",
    "15-0": "`public_network_acl_ingress`",
    "16-0": "`private_network_acl_egress`",
    "18-0": "`enabled`",
    "17-0": "`private_network_acl_ingress`",
    "15-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf)",
    "16-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf)",
    "17-1": "see [variables.tf](https://github.com/cloudposse/terraform-aws-multi-az-subnets/blob/master/variables.tf)",
    "18-1": "`true`",
    "14-2": "Egress rules which are added to the new Public Network ACL",
    "15-2": "Ingress rules which are added to the new Public Network ACL",
    "16-2": "Egress rules which are added to the new Private Network ACL",
    "17-2": "Ingress rules which are added to the new Private Network ACL",
    "18-2": "Set to `false` to prevent the module from creating any resources",
    "19-0": "`nat_gateway_enabled`",
    "19-1": "`true`",
    "19-2": "Flag to enable/disable NAT Gateways creation in public subnets",
    "20-0": "`az_ngw_ids`",
    "20-1": "{}",
    "21-0": "`az_ngw_count`",
    "21-1": "0",
    "20-2": "Map of AZ names to NAT Gateway IDs which are used as default routes when creating private subnets. Only for private subnets",
    "21-2": "Count of items in the `az_ngw_ids` map. Needs to be explicitly provided since Terraform currently can't use dynamic count on computed resources from different modules. https://github.com/hashicorp/terraform/issues/10857",
    "14-3": "No",
    "15-3": "No",
    "16-3": "No",
    "17-3": "No",
    "18-3": "No",
    "19-3": "No",
    "20-3": "No",
    "21-3": "No"
  },
  "cols": 4,
  "rows": 22
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "az_subnet_ids",
    "1-0": "az_route_table_ids",
    "2-0": "az_ngw_ids",
    "2-1": "Map of AZ names to NAT Gateway IDs (only for public subnets)",
    "1-1": "Map of AZ names to Route Table IDs",
    "0-1": "Map of AZ names to subnet IDs"
  },
  "cols": 2,
  "rows": 3
}
[/block]