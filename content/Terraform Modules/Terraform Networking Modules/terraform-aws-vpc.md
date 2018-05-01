---
title: "terraform-aws-vpc"
excerpt: "Terraform module that defines a VPC with Internet Gateway."
---
# Terraform AWS VPC


[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-vpc",
    "1-1": "terraform-aws-vpc",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-vpc.svg)](https://github.com/cloudposse/terraform-aws-vpc/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-vpc.svg)](https://travis-ci.org/cloudposse/terraform-aws-vpc)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

## Quick Start Example
[block:code]
{
  "codes": [
    {
      "code": "module \"vpc\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

## Full Example

Here's a complete example using [`terraform-aws-dynamic-subnets`](https://github.com/cloudposse/terraform-aws-dynamic-subnets.git).
[block:code]
{
  "codes": [
    {
      "code": "module \"vpc\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-vpc.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}\n\nmodule \"dynamic_subnets\" {\n  source             = \"git::https://github.com/cloudposse/terraform-aws-dynamic-subnets.git?ref=master\"\n  availability_zones = \"${var.availability_zones}\"\n  namespace          = \"${var.namespace}\"\n  name               = \"${var.name}\"\n  stage              = \"${var.stage}\"\n  region             = \"${var.region}\"\n  vpc_id             = \"${module.vpc.vpc_id}\"\n  igw_id             = \"${module.vpc.igw_id}\"\n  cidr_block         = \"${module.vpc.vpc_cidr_block}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
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
    "0-2": "Requests an Amazon-provided IPv6 CIDR block with a /56 prefix length for the VPC",
    "0-1": "`false`",
    "1-1": "`10.0.0.0/16`",
    "2-1": "`false`",
    "3-1": "`false`",
    "4-1": "`true`",
    "5-1": "`true`",
    "6-1": "``",
    "7-1": "``",
    "8-1": "``",
    "9-1": "``",
    "10-1": "`[]`",
    "11-1": "`{}`",
    "12-1": "`-`",
    "12-2": "Delimiter to be used between `name`, `namespace`, `stage`, etc.",
    "11-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "10-2": "Additional attributes (e.g. `policy` or `role`)",
    "9-2": "Name  (e.g. `bastion` or `db`)",
    "8-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "7-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "6-2": "A tenancy option for instances launched into the VPC",
    "5-2": "A boolean flag to enable/disable DNS support in the VPC",
    "4-2": "A boolean flag to enable/disable DNS hostnames in the VPC",
    "3-2": "A boolean flag to enable/disable ClassicLink DNS Support for the VPC",
    "2-2": "A boolean flag to enable/disable ClassicLink for the VPC",
    "1-2": "CIDR for the VPC",
    "12-3": "No",
    "11-3": "No",
    "10-3": "No",
    "9-3": "Yes",
    "8-3": "Yes",
    "7-3": "Yes",
    "6-3": "No",
    "5-3": "No",
    "4-3": "No",
    "3-3": "No",
    "2-3": "No",
    "1-3": "No",
    "0-3": "No",
    "0-0": "`assign_generated_ipv6_cidr_block`",
    "1-0": "`cidr_block`",
    "2-0": "`enable_classiclink`",
    "3-0": "`enable_classiclink_dns_support`",
    "4-0": "`enable_dns_hostnames`",
    "5-0": "`enable_dns_support`",
    "6-0": "`instance_tenancy`",
    "7-0": "`namespace`",
    "8-0": "`stage`",
    "9-0": "`name`",
    "10-0": "`attributes`",
    "11-0": "`tags`",
    "12-0": "`delimiter`"
  },
  "cols": 4,
  "rows": 13
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-1": "The ID of the Internet Gateway",
    "1-1": "The IPv6 CIDR block",
    "2-1": "The CIDR block of the VPC",
    "3-1": "The ID of the network ACL created by default on VPC creation",
    "4-1": "The ID of the route table created by default on VPC creation",
    "5-1": "The ID of the security group created by default on VPC creation",
    "6-1": "The ID of the VPC",
    "7-1": "The association ID for the IPv6 CIDR block",
    "8-1": "The ID of the main route table associated with this VPC.",
    "8-0": "`vpc_main_route_table_id`",
    "7-0": "`vpc_ipv6_association_id`",
    "6-0": "`vpc_id`",
    "5-0": "`vpc_default_security_group_id`",
    "4-0": "`vpc_default_route_table_id`",
    "3-0": "`vpc_default_network_acl_id`",
    "2-0": "`vpc_cidr_block`",
    "1-0": "`ipv6_cidr_block`",
    "0-0": "`igw_id`"
  },
  "cols": 2,
  "rows": 9
}
[/block]