---
title: "terraform-datadog-aws-integration"
excerpt: "Terraform Module for integration DataDog with AWS"
---
# Terraform Datadog AWS Integration


[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-datadog-integration",
    "1-1": "terraform-datadog-aws-integration",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-datadog-aws-integration.svg)](https://github.com/cloudposse/terraform-datadog-aws-integration/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-datadog-aws-integration.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-datadog-aws-integration)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage
[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "At the moment the module supports `RDS integration only`. It will be modified as necessary to integrate the needful services."
}
[/block]
Include this module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"datadog_aws_integration\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-datadog-aws-integration.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "3-3": "No",
    "4-3": "No",
    "5-3": "Yes",
    "6-3": "No",
    "7-3": "Yes",
    "7-2": "List of AWS Services to integration with the DataDog service (e.g EC2, RDS, Billing ...)",
    "6-2": "Datadog’s AWS account ID",
    "5-2": "External Id of the DataDog service",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "[]",
    "4-1": "{}",
    "5-1": "``",
    "6-1": "`464622532012`",
    "7-1": "[]",
    "0-0": "namespace",
    "1-0": "stage",
    "2-0": "name",
    "3-0": "attributes",
    "4-0": "tags",
    "5-0": "datadog_external_id",
    "6-0": "datadog_aws_account_id",
    "7-0": "integrations"
  },
  "cols": 4,
  "rows": 8
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-1": "Name of AWS IAM Role associated with creating integration",
    "0-0": "`role`"
  },
  "cols": 2,
  "rows": 1
}
[/block]