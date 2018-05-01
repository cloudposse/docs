---
title: "terraform-aws-dynamodb"
excerpt: "Terraform module to provision a DynamoDB table with autoscaling."
---
# Terraform AWS DynamoDB
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-dynamodb",
    "1-1": "terraform-aws-dynamodb",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-dynamodb.svg)](https://github.com/cloudposse/terraform-aws-dynamodb/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-dynamodb.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-dynamodb)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

Autoscaler scales up/down the provisioned IOPS for the DynamoDB table based on the load.

# Usage

Include this module in your existing terraform code:

[block:code]
{
  "codes": [
    {
      "code": "module \"dynamodb_table\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-dynamodb.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "12-3": "No",
    "13-3": "No",
    "16-3": "No",
    "15-3": "No",
    "14-3": "No",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name  (_e.g._ `app` or `cluster`)",
    "3-2": "DynamoDB table Hash Key",
    "4-2": "DynamoDB table Range Key",
    "5-2": "DynamoDB table TTL attribute",
    "0-0": "`namespace`",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "``",
    "4-1": "``",
    "5-1": "``",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`hash_key`",
    "4-0": "`range_key`",
    "5-0": "`ttl_attribute`",
    "6-0": "`enable_encryption`",
    "7-0": "`attributes`",
    "8-0": "`tags`",
    "9-0": "`delimiter`",
    "10-0": "`autoscale_write_target`",
    "11-0": "`autoscale_read_target`",
    "12-0": "`autoscale_min_read_capacity`",
    "13-0": "`autoscale_max_read_capacity`",
    "14-0": "`autoscale_min_write_capacity`",
    "15-0": "`autoscale_max_write_capacity`",
    "16-0": "`enable_autoscaler`",
    "16-1": "`true`",
    "15-1": "`20`",
    "13-1": "`20`",
    "14-1": "`5`",
    "12-1": "`5`",
    "11-1": "`10`",
    "10-1": "`10`",
    "9-1": "`-`",
    "8-1": "`{}`",
    "7-1": "`[]`",
    "6-1": "`true`",
    "6-2": "Enable DynamoDB server-side encryption",
    "7-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "8-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "9-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "10-2": "The target value for DynamoDB write autoscaling",
    "11-2": "The target value for DynamoDB read autoscaling",
    "12-2": "DynamoDB autoscaling min read capacity",
    "13-2": "DynamoDB autoscaling max read capacity",
    "14-2": "DynamoDB autoscaling min write capacity",
    "15-2": "DynamoDB autoscaling max write capaci",
    "16-2": "Flag to enable/disable DynamoDB autoscaling"
  },
  "cols": 4,
  "rows": 17
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`table_id`",
    "1-0": "`table_arn`",
    "2-0": "`table_name`",
    "2-1": "DynamoDB table name",
    "1-1": "DynamoDB table ARN",
    "0-1": "DynamoDB table ID"
  },
  "cols": 2,
  "rows": 3
}
[/block]