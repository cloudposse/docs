---
title: terraform-aws-cloudwatch-logs
description: >-
  Terraform module for creation of CloudWatch Log Streams and Log Groups for use
  with Fluentd.
---

# Terraform AWS CloudWatch Logs

|                  |                                                                                                                                                                        |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-cloudwatch-logs>                                                                                                          |
| Terraform Module | terraform-aws-cloudwatch-logs                                                                                                                                          |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudwatch-logs.svg)](https://github.com/cloudposse/terraform-aws-cloudwatch-logs/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-logs.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-logs)    |

# Usage

## HCL

```hcl
module "cloudwatch_log" {
  namespace    = "${var.namespace}"
  stage        = "${var.stage}"
  stream_names = ["kafka-instance-1", "kafka-instance-2"]
}
```

# Input

| Name                   | Default      | Description                                                     |
|:-----------------------|:-------------|:----------------------------------------------------------------|
| additional_permissions | []           | Additional permissions granted to assumed role                  |
| trusted_roles          | []           | Roles allow to assume role                                      |
| attributes             | []           | Additional attributes (e.g. `policy` or `role`)                 |
| delimiter              | "-"          | Delimiter to be used between `name`, `namespace`, `stage`, etc. |
| name                   | ""           | Name (e.g. `bastion` or `db`)                                   |
| namespace              | **REQUIRED** | Namespace (e.g. `cp` or `cloudposse`)                           |
| retention_in_days      | "30"         | Number of days you want to retain log events in the log group   |
| stage                  | **REQUIRED** | Stage (e.g. `prod`, `dev`, `staging`)                           |
| stream_names           | []           | Names of streams                                                |
| tags                   | {}           | Additional tags (e.g. map(`BusinessUnit`,`XYZ`)                 |

# Output

| Name              | Description            |
|:------------------|:-----------------------|
| assumed_role_arn  | ARN of role to assume  |
| assumed_role_name | Name of role to assume |
| log_group_arn     | ARN of the log group   |
| log_group_name    | Name of log group      |
| policy_arn        | ARN of role to assume  |
| policy_name       | Name of role to assume |
| stream_arns       | ARN of the log stream  |
