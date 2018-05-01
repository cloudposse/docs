---
title: "terraform-aws-cloudtrail"
excerpt: "Terraform module to provision an AWS [CloudTrail](https://aws.amazon.com/cloudtrail/)."
---
# Terraform AWS CloudTrail
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cloudtrail",
    "1-1": "terraform-aws-cloudtrail ",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudtrail.svg)](https://github.com/cloudposse/terraform-aws-cloudtrail/release)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudtrail.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudtrail)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The module accepts an encrypted S3 bucket with versioning to store CloudTrail logs.

The bucket could be from the same AWS account or from a different account.

This is useful if an organization uses a number of separate AWS accounts to isolate the Audit environment from other environments (production, staging, development).

In this case, you create CloudTrail in the production environment (production AWS account), 
while the S3 bucket to store the CloudTrail logs is created in the Audit AWS account, restricting access to the logs only to the users/groups from the Audit account.


# Usage

Include this module in your existing terraform code.

[block:code]
{
  "codes": [
    {
      "code": "module \"cloudtrail\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-cloudtrail.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "To create an S3 bucket for CloudTrail logs, use [terraform-aws-cloudtrail-s3-bucket](https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket) module.\nIt creates an S3 bucket and an IAM policy to allow CloudTrail logs.",
  "title": "NOTE"
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "module \"cloudtrail\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-cloudtrail.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}\n\nmodule \"cloudtrail_s3_bucket\" {\n  source    = \"git::https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket.git?ref=master\"\n  namespace = \"cp\"\n  stage     = \"dev\"\n  name      = \"cluster\"\n  region    = \"us-east-1\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-cloudtrail/examples/complete).


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
    "5-3": "No",
    "6-3": "No",
    "10-3": "Yes",
    "9-3": "No",
    "8-3": "No",
    "7-3": "No",
    "10-2": "S3 bucket name for CloudTrail logs",
    "9-2": "Enable logging for the trail. Logs will be stored in the S3 bucket",
    "8-2": "Specifies whether the trail is created in the current region or in all regions",
    "7-2": "Specifies whether the trail is publishing events from global services such as IAM to the log files",
    "6-2": "Specifies whether log file integrity validation is enabled. Creates signed digest for validated contents of logs",
    "5-2": "Delimiter to be used between `namespace`, `stage`, `name` and `attributes`",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "3-2": "Additional attributes (e.g. `logs`)",
    "2-2": "Name  (e.g. `cluster` or `app`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "`[]`",
    "4-1": "`{}`",
    "5-1": "`-`",
    "6-1": "`true`",
    "7-1": "`false`",
    "8-1": "`false`",
    "9-1": "`true`",
    "10-1": "``",
    "10-0": "`s3_bucket_name`",
    "9-0": "`enable_logging`",
    "8-0": "`is_multi_region_trail`",
    "7-0": "`include_global_service_events`",
    "6-0": "`enable_log_file_validation`",
    "5-0": "`delimiter`",
    "4-0": "`tags`",
    "3-0": "`attributes`",
    "2-0": "`name`",
    "1-0": "`stage`",
    "0-0": "`namespace`"
  },
  "cols": 4,
  "rows": 11
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`cloudtrail_id`",
    "1-0": "`cloudtrail_home_region`",
    "2-0": "`cloudtrail_arn`",
    "2-1": "The Amazon Resource Name of the trail",
    "1-1": "The region in which the trail was created",
    "0-1": "The name of the trail"
  },
  "cols": 2,
  "rows": 3
}
[/block]