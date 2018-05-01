---
title: "terraform-aws-dynamodb-autoscaler"
excerpt: "Terraform module to provision DynamoDB autoscaler."
---
# Terraform AWS DynamoDB Autoscaler
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler",
    "1-1": "terraform-aws-dynamodb-autoscaler",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-dynamodb-autoscaler.svg)](https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-dynamodb-autoscaler.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-dynamodb-autoscaler)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

Autoscaler scales up/down the provisioned IOPS for a DynamoDB table based on the load.

# Usage

Include this module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"dynamodb_autoscaler\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "14-3": "No",
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`dynamodb_table_name`",
    "4-0": "`dynamodb_table_arn`",
    "5-0": "`attributes`",
    "6-0": "`tags`",
    "7-0": "`delimiter`",
    "8-0": "`autoscale_write_target`",
    "9-0": "`autoscale_read_target`",
    "10-0": "`autoscale_min_read_capacity`",
    "11-0": "`autoscale_max_read_capacity`",
    "12-0": "`autoscale_min_write_capacity`",
    "13-0": "`autoscale_max_write_capacity`",
    "14-0": "`enabled`",
    "14-1": "`true`",
    "13-1": "`20`",
    "11-1": "`20`",
    "12-1": "`5`",
    "10-1": "`5`",
    "9-1": "`10`",
    "8-1": "`10`",
    "7-1": "`-`",
    "6-1": "`{}`",
    "5-1": "`[]`",
    "4-1": "``",
    "3-1": "``",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name  (_e.g._ `app` or `cluster`)",
    "3-2": "DynamoDB table name",
    "4-2": "DynamoDB table ARN",
    "5-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "6-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "7-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "8-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "9-2": "The target value for DynamoDB read autoscaling",
    "10-2": "DynamoDB autoscaling min read capacity",
    "11-2": "DynamoDB autoscaling max read capacity",
    "12-2": "DynamoDB autoscaling min write capacity",
    "13-2": "DynamoDB autoscaling max write capacity",
    "14-2": "Set to false to prevent the module from creating any resources"
  },
  "cols": 4,
  "rows": 15
}
[/block]