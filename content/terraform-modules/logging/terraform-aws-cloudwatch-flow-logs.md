---
title: terraform-aws-cloudwatch-flow-logs
description: >-
  Terraform module for enabling [`flow
  logs`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html)
  for `vpc` and `subnets`.
---

# Terraform AWS CloudWatch Flow Logs

|                  |                                                                                                                                                                                  |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs>                                                                                                               |
| Terraform Module | terraform-aws-cloudwatch-flow-logs                                                                                                                                               |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudwatch-flow-logs.svg)](https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-flow-logs.svg)](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-flow-logs)                  |

# Usage

## HCL

```hcl
module "flow_logs" {
  source    = "git::https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs.git?ref=master"
  vpc_id    = "${var.vpc_id}"
  namespace = "${var.namespace}"
  stage     = "${var.stage}"
}
```

# Variables

| Name                  | Default                                | Description                                                                                             | Required |
|:----------------------|:---------------------------------------|:--------------------------------------------------------------------------------------------------------|:---------|
| `namespace`           |                                        | Namespace (e.g. `cp` or `cloudposse`)                                                                   | Yes      |
| `region`              |                                        | AWS region e.g. `us-central-1`                                                                          | No       |
| `retention_in_days`   | `30`                                   | Number of days you want to retain log events in the log group                                           | No       |
| `traffic_type`        | `ALL`                                  | Type of traffic to capture. Valid values: ACCEPT,REJECT, ALL                                            | No       |
| `shard_count`         | `1`                                    | Number of shards that the stream will use                                                               | No       |
| `retention_period`    | `48`                                   | Length of time data records are accessible after they are added to the stream                           | No       |
| `shard_level_metrics` | `[ "IncomingBytes", "OutgoingBytes",]` | List of shard-level CloudWatch metrics which can be enabled for the stream                              | No       |
| `encryption_type`     | `NONE`                                 | GUID for the customer-managed KMS key to use for encryption. The only acceptable values are NONE or KMS | No       |
| `kms_key_id`          |                                        | ID of KMS key                                                                                           | No       |
| `filter_pattern`      | `"[]"`                                 | Valid CloudWatch Logs filter pattern for subscribing to a filtered stream of log events                 | No       |
| `enabled`             | `true`                                 | Set to false to prevent the module from creating anything                                               | No       |
| `stage`               |                                        | Stage (e.g. `prod`, `dev`, `staging`)                                                                   | Yes      |
| `name`                |                                        | Name (e.g. `bastion` or `db`)                                                                           | No       |
| `delimiter`           | `-`                                    | Delimiter to be used between `name`, `namespace`, `stage`, etc.                                         | No       |
| `attributes`          | `[]`                                   | Additional attributes (e.g. `policy` or `role`)                                                         | No       |
| `tags`                | `{}`                                   | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                                       | No       |
| `vpc_id`              |                                        | ID of VPC                                                                                               | Yes      |
| `subnet_ids`          | `[]`                                   | IDs of subnets                                                                                          | No       |
| `eni_ids`             | `[]`                                   | IDs of ENIs                                                                                             | No       |

# Outputs

| Name                  | Description                |
|:----------------------|:---------------------------|
| `log_group_arn`       | ARN of the log group       |
| `eni_flow_ids`        | Flow Log IDs of ENIs       |
| `subnet_flow_ids`     | Flow Log IDs of subnets    |
| `vpc_flow_id`         | Flow Log IDs of VPC        |
| `kinesis_arn`         | ARN of Stream              |
| `kinesis_id`          | Stream ID                  |
| `kinesis_name`        | Stream name                |
| `kinesis_shard_count` | Count of Shards for Stream |
