---
title: "terraform-aws-vpc-peering"
excerpt: "Terraform module to create a peering connection between two VPCs"
---
# Terraform AWS VPC Peering
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-vpc-peering",
    "1-1": "terraform-aws-vpc-peering",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-vpc-peering.svg)](https://github.com/cloudposse/terraform-aws-vpc-peering/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-vpc-peering.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-vpc-peering)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/82718b8-vpc-peering.png",
        "vpc-peering.png",
        2096,
        418,
        "#eaedf0"
      ]
    }
  ]
}
[/block]
# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"vpc_peering\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-vpc-peering.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "Both the acceptor and requestor VPCs must have subnets associated with route tables"
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
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "Yes",
    "5-3": "No",
    "6-3": "No",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "10-3": "No",
    "11-3": "No",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name  (_e.g._ `app` or `cluster`)",
    "3-2": "Requestor VPC ID",
    "4-2": "Acceptor VPC ID",
    "5-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "6-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "7-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "8-2": "Set to `false` to prevent the module from creating or accessing any resources",
    "9-2": "Automatically accept the peering (both VPCs need to be in the same AWS account)",
    "10-2": "Allow acceptor VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the requestor VPC",
    "11-2": "Allow requestor VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the acceptor VPC",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "``",
    "4-1": "``",
    "5-1": "`[]`",
    "6-1": "`{}`",
    "7-1": "`-`",
    "8-1": "`true`",
    "9-1": "`true`",
    "10-1": "`true`",
    "11-1": "`true`",
    "11-0": "`requestor_allow_remote_vpc_dns_resolution`",
    "10-0": "`acceptor_allow_remote_vpc_dns_resolution`",
    "9-0": "`auto_accept`",
    "8-0": "`enabled`",
    "7-0": "`delimiter`",
    "6-0": "`tags`",
    "5-0": "`attributes`",
    "4-0": "`acceptor_vpc_id`",
    "3-0": "`requestor_vpc_id`",
    "2-0": "`name`",
    "1-0": "`stage`",
    "0-0": "`namespace`"
  },
  "cols": 4,
  "rows": 12
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "When enabled, the DNS resolution features (`acceptor_allow_remote_vpc_dns_resolution` and `requestor_allow_remote_vpc_dns_resolution`)\nrequire that VPCs participating in the peering must have support for the DNS hostnames enabled.\nThis can be done using the [`enable_dns_hostnames`](https://www.terraform.io/docs/providers/aws/r/vpc.html#enable_dns_hostnames) attribute in the `aws_vpc` resource.\n\n[www.terraform.io/docs/providers/aws/r/vpc_peering.html](https://www.terraform.io/docs/providers/aws/r/vpc_peering.html#allow_remote_vpc_dns_resolution)"
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "1-0": "`accept_status`",
    "0-0": "`connection_id`",
    "0-1": "VPC peering connection ID",
    "1-1": "The status of the VPC peering connection request"
  },
  "cols": 2,
  "rows": 2
}
[/block]