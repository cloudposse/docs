---
title: aws-cloudwatch-flow-logs
sidebar_label: aws-cloudwatch-flow-logs
sidebar_class_name: command
description: |-
  Terraform module for enabling [`flow logs`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html) for `vpc` and `subnets`.
tags:
  - aws
  - terraform
  - terraform-modules
  - logging
  - cloudwatch-logs
  - vpc-flow-logs
  - ec2
  - secops

custom_edit_url: https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs/edit/master/README.md
---

# Component: `aws-cloudwatch-flow-logs`
Terraform module for enabling [`flow logs`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html) for `vpc` and `subnets`.






## Usage

```terraform
module "flow_logs" {
  source    = "git::https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs.git?ref=master"
  vpc_id    = "${var.vpc_id}"
  namespace = "${var.namespace}"
  stage     = "${var.stage}"
}
```






## Makefile Targets
```
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```
## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| attributes | Additional attributes (e.g. `policy` or `role`) | list | `<list>` | no |
| delimiter | Delimiter to be used between `name`, `namespace`, `stage`, etc. | string | `-` | no |
| enabled | Set to false to prevent the module from creating anything | string | `true` | no |
| encryption_type | GUID for the customer-managed KMS key to use for encryption. The only acceptable values are NONE or KMS | string | `NONE` | no |
| eni_ids | IDs of ENIs | list | `<list>` | no |
| filter_pattern | Valid CloudWatch Logs filter pattern for subscribing to a filtered stream of log events | string | `[version, account, eni, source, destination, srcport, destport, protocol, packets, bytes, windowstart, windowend, action, flowlogstatus]` | no |
| kms_key_id | ID of KMS key | string | `` | no |
| name | Name  (e.g. `bastion` or `db`) | string | `` | no |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | - | yes |
| region | AWS region | string | `` | no |
| retention_in_days | Number of days you want to retain log events in the log group | string | `30` | no |
| retention_period | Length of time data records are accessible after they are added to the stream | string | `48` | no |
| shard_count | Number of shards that the stream will use | string | `1` | no |
| shard_level_metrics | List of shard-level CloudWatch metrics which can be enabled for the stream | list | `<list>` | no |
| stage | Stage (e.g. `prod`, `dev`, `staging`) | string | - | yes |
| subnet_ids | IDs of subnets | list | `<list>` | no |
| tags | Additional tags (e.g. map(`BusinessUnit`,`XYZ`) | map | `<map>` | no |
| traffic_type | Type of traffic to capture. Valid values: ACCEPT,REJECT, ALL | string | `ALL` | no |
| vpc_id | ID of VPC | string | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| eni_flow_ids | Flow Log IDs of ENIs |
| kinesis_arn | Kinesis Stream ARN |
| kinesis_id | Kinesis Stream ID |
| kinesis_name | Kinesis Stream name |
| kinesis_shard_count | Kinesis Stream Shard count |
| log_group_arn | ARN of the log group |
| subnet_flow_ids | Flow Log IDs of subnets |
| vpc_flow_id | VPC Flow Log ID |



