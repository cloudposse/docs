---
title: "terraform-aws-cloudwatch-flow-logs"
excerpt: "Terraform module for enabling [`flow logs`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/flow-logs.html) for `vpc` and `subnets`."
---
# Terraform AWS CloudWatch Flow Logs
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs",
    "1-1": "terraform-aws-cloudwatch-flow-logs ",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudwatch-flow-logs.svg)](https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-flow-logs.svg)](https://travis-ci.org/cloudposse/terraform-aws-cloudwatch-flow-logs)"
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
      "code": "module \"flow_logs\" {\n  source    = \"git::https://github.com/cloudposse/terraform-aws-cloudwatch-flow-logs.git?ref=master\"\n  vpc_id    = \"${var.vpc_id}\"\n  namespace = \"${var.namespace}\"\n  stage     = \"${var.stage}\"\n}",
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
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`delimiter`",
    "4-0": "`attributes`",
    "5-0": "`tags`",
    "6-0": "`vpc_id`",
    "7-0": "`subnet_ids`",
    "8-0": "`eni_ids`",
    "9-0": "`region`",
    "10-0": "`retention_in_days`",
    "11-0": "`traffic_type`",
    "12-0": "`shard_count`",
    "13-0": "`retention_period`",
    "14-0": "`shard_level_metrics`",
    "15-0": "`encryption_type`",
    "16-0": "`kms_key_id`",
    "17-0": "`filter_pattern`",
    "18-0": "`enabled`",
    "18-1": "`true`",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "`-`",
    "4-1": "`[]`",
    "7-1": "`[]`",
    "8-1": "`[]`",
    "5-1": "`{}`",
    "6-1": "``",
    "9-1": "``",
    "10-1": "`30`",
    "11-1": "`ALL`",
    "12-1": "`1`",
    "13-1": "`48`",
    "14-1": "`[ \"IncomingBytes\", \"OutgoingBytes\",]`",
    "15-1": "`NONE`",
    "16-1": "``",
    "17-1": "`\"[]\"`",
    "18-2": "Set to false to prevent the module from creating anything",
    "17-2": "Valid CloudWatch Logs filter pattern for subscribing to a filtered stream of log events",
    "16-2": "ID of KMS key",
    "15-2": "GUID for the customer-managed KMS key to use for encryption. The only acceptable values are NONE or KMS",
    "14-2": "List of shard-level CloudWatch metrics which can be enabled for the stream",
    "13-2": "Length of time data records are accessible after they are added to the stream",
    "12-2": "Number of shards that the stream will use",
    "11-2": "Type of traffic to capture. Valid values: ACCEPT,REJECT, ALL",
    "10-2": "Number of days you want to retain log events in the log group",
    "9-2": "AWS region e.g. `us-central-1`",
    "8-2": "IDs of ENIs",
    "7-2": "IDs of subnets",
    "6-2": "ID of VPC",
    "5-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "4-2": "Additional attributes (e.g. `policy` or `role`)",
    "3-2": "Delimiter to be used between `name`, `namespace`, `stage`, etc.",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "0-3": "Yes",
    "1-3": "Yes",
    "6-3": "Yes",
    "5-3": "No",
    "4-3": "No",
    "3-3": "No",
    "2-3": "No",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "10-3": "No",
    "11-3": "No",
    "12-3": "No",
    "13-3": "No",
    "14-3": "No",
    "15-3": "No",
    "16-3": "No",
    "17-3": "No",
    "18-3": "No"
  },
  "cols": 4,
  "rows": 19
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`log_group_arn`",
    "1-0": "`eni_flow_ids`",
    "2-0": "`subnet_flow_ids`",
    "3-0": "`vpc_flow_id`",
    "4-0": "`kinesis_arn`",
    "5-0": "`kinesis_id`",
    "6-0": "`kinesis_name`",
    "7-0": "`kinesis_shard_count`",
    "7-1": "Count of Shards for Stream",
    "6-1": "Stream name",
    "5-1": "Stream ID",
    "4-1": "ARN of Stream",
    "3-1": "Flow Log IDs of VPC",
    "2-1": "Flow Log IDs of subnets",
    "1-1": "Flow Log IDs of ENIs",
    "0-1": "ARN of the log group"
  },
  "cols": 2,
  "rows": 8
}
[/block]