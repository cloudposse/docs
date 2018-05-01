---
title: "terraform-aws-cloudwatch-logs"
excerpt: "Terraform module for creation of CloudWatch Log Streams and Log Groups for use with Fluentd."
---
# Terraform AWS CloudWatch Logs
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cloudwatch-logs",
    "1-1": "terraform-aws-cloudwatch-logs",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudwatch-logs.svg)](https://github.com/cloudposse/terraform-aws-cloudwatch-logs/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-logs.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-logs)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"cloudwatch_log\" {\n  namespace    = \"${var.namespace}\"\n  stage        = \"${var.stage}\"\n  stream_names = [\"kafka-instance-1\", \"kafka-instance-2\"]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Input
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "additional_permissions",
    "0-1": "[]",
    "0-2": "Additional permissions granted to assumed role",
    "1-0": "attributes",
    "1-1": "[]",
    "1-2": "Additional attributes (e.g. `policy` or `role`)",
    "2-0": "delimiter",
    "3-0": "name",
    "4-0": "namespace",
    "5-0": "retention_in_days",
    "6-0": "stage",
    "7-0": "stream_names",
    "8-0": "tags",
    "9-0": "trusted_roles",
    "9-1": "[]",
    "8-1": "{}",
    "7-1": "[]",
    "6-1": "__REQUIRED__",
    "5-1": "\"30\"",
    "4-1": "__REQUIRED__",
    "3-1": "\"\"",
    "2-1": "\"-\"",
    "2-2": "Delimiter to be used between `name`, `namespace`, `stage`, etc.",
    "3-2": "Name  (e.g. `bastion` or `db`)",
    "4-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "5-2": "Number of days you want to retain log events in the log group",
    "6-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "7-2": "Names of streams",
    "8-2": "Additional tags (e.g. map(`BusinessUnit`,`XYZ`)",
    "9-2": "Roles allow to assume role"
  },
  "cols": 3,
  "rows": 10
}
[/block]
# Output
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "assumed_role_arn",
    "1-0": "assumed_role_name",
    "2-0": "log_group_arn",
    "3-0": "log_group_name",
    "4-0": "policy_arn",
    "5-0": "policy_name",
    "6-0": "stream_arns",
    "6-1": "ARN of the log stream",
    "5-1": "Name of role to assume",
    "4-1": "ARN of role to assume",
    "3-1": "Name of log group",
    "2-1": "ARN of the log group",
    "1-1": "Name of role to assume",
    "0-1": "ARN of role to assume"
  },
  "cols": 2,
  "rows": 7
}
[/block]