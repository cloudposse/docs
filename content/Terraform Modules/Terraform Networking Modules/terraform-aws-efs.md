---
title: "terraform-aws-efs"
excerpt: "Terraform module to provision an AWS [`EFS`](https://aws.amazon.com/efs/) Network File System."
---
# Terraform AWS EFS
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-efs",
    "1-1": "terraform-aws-efs",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-efs.svg)](https://github.com/cloudposse/terraform-aws-efs/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-efs.svg)](https://travis-ci.org/cloudposse/terraform-aws-efs)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

Include this repository as a module in your existing terraform code:

[block:code]
{
  "codes": [
    {
      "code": "module \"efs\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-efs.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "0-0": "namespace",
    "1-0": "stage",
    "2-0": "name",
    "3-0": "security_groups",
    "4-0": "aws_region",
    "5-0": "vpc_id",
    "6-0": "subnets",
    "7-0": "availability_zones",
    "8-0": "zone_id",
    "9-0": "attributes",
    "10-0": "tags",
    "11-0": "delimiter",
    "0-1": "`global`",
    "1-1": "`default`",
    "2-1": "`app`",
    "3-1": "`[]`",
    "4-1": "__REQUIRED__",
    "5-1": "__REQUIRED__",
    "6-1": "__REQUIRED__",
    "7-1": "__REQUIRED__",
    "8-1": "__REQUIRED__",
    "9-1": "`[]`",
    "10-1": "`{}`",
    "11-1": "`-`",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name (_e.g._ `app` or `wordpress`)",
    "3-2": "AWS security group IDs to allow to connect to the EFS",
    "4-2": "AWS region ID",
    "5-2": "AWS VPC ID",
    "6-2": "AWS subnet IDs",
    "7-2": "Availability Zone IDs",
    "8-2": "Route53 dns zone ID",
    "9-2": "Additional attributes (e.g. `policy` or `role`)",
    "10-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "11-2": "Delimiter to be used between `name`, `namespace`, `stage`, etc."
  },
  "cols": 3,
  "rows": 12
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "id",
    "1-0": "host",
    "2-0": "mount_target_ids",
    "3-0": "mount_target_ips",
    "3-1": "List of IPs of the EFS mount targets (one per Availability",
    "2-1": "List of IDs of the EFS mount targets (one per Availability Zone)",
    "1-1": "Assigned DNS-record for the EFS",
    "0-1": "EFS id"
  },
  "cols": 2,
  "rows": 4
}
[/block]