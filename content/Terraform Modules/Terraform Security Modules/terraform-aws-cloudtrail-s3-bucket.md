---
title: "terraform-aws-cloudtrail-s3-bucket"
excerpt: "Terraform module to provision an S3 bucket with built-in policy to allow [CloudTrail](https://aws.amazon.com/cloudtrail/) [logs (https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-and-data-events-with-cloudtrail.html)."
---
# Terraform AWS CloudTrail S3 Bucket
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket",
    "1-1": "terraform-aws-cloudtrail-s3-bucket",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudtrail-s3-bucket.svg)](https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudtrail-s3-bucket.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudtrail-s3-bucket)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

This is useful if an organization uses a number of separate AWS accounts to isolate the Audit environment from other environments (production, staging, development).

In this case, you create CloudTrail in the production environment (production AWS account), 
while the S3 bucket to store the CloudTrail logs is created in the Audit AWS account, restricting access to the logs only to the users/groups from the Audit account.


# Features

The module supports the following features.

1. Forced [server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) at rest for the S3 bucket
2. S3 bucket [versioning](https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html) to easily recover from both unintended user actions and application failures
3. S3 bucket is protected from deletion if it's not empty ([force_destroy](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html#force_destroy) set to `false`)


# Usage

Include this module in your existing terraform code:

[block:code]
{
  "codes": [
    {
      "code": "module \"s3_bucket\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "3-0": "`region`",
    "4-0": "`attributes`",
    "5-0": "`tags`",
    "6-0": "`delimiter`",
    "7-0": "`acl`",
    "7-1": "`log-delivery-write`",
    "6-1": "`-`",
    "5-1": "`{}`",
    "4-1": "`[]`",
    "3-1": "`us-east-1`",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Name  (e.g. `cluster` or `app`)",
    "3-2": "AWS Region for S3 bucket",
    "4-2": "Additional attributes (e.g. `logs`)",
    "5-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "6-2": "Delimiter to be used between `namespace`, `stage`, `name` and `attributes`",
    "7-2": "Canned ACL to apply to the S3 bucket",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No",
    "7-3": "No"
  },
  "cols": 4,
  "rows": 8
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-1": "Description",
    "h-0": "Name",
    "0-0": "`bucket_domain_name`",
    "1-0": "`bucket_id`",
    "2-0": "`bucket_arn`",
    "0-1": "FQDN of bucket",
    "1-1": "Bucket ID",
    "2-1": "Bucket ARN"
  },
  "cols": 2,
  "rows": 3
}
[/block]