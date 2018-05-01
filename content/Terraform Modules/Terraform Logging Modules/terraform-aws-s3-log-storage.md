---
title: "terraform-aws-s3-log-storage"
excerpt: "This module creates an S3 bucket suitable for receiving logs from other `AWS` services such as `S3`, `CloudFront`, and `CloudTrails`."
---
# Terraform AWS S3 Log Storage
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-s3-log-storage",
    "1-1": "terraform-aws-s3-log-storage",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-s3-log-storage.svg)](https://github.com/cloudposse/terraform-aws-s3-log-storage/releases)",
    "3-1": " [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-s3-log-storage.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-s3-log-storage)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

It implements a configurable log retention policy, which allows you to efficiently manage logs across different storage classes (_e.g._ `Glacier`) and ultimately expire the data altogether.

It enables server-side default encryption.

# References
* https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html

# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"log_storage\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-s3-log-storage.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "3-0": "`attributes`",
    "4-0": "`tags`",
    "5-0": "`acl`",
    "6-0": "`policy`",
    "7-0": "`prefix`",
    "8-0": "`region`",
    "9-0": "`force_destroy`",
    "10-0": "`lifecycle_rule_enabled`",
    "11-0": "`versioning_enabled`",
    "12-0": "`noncurrent_version_transition_days`",
    "13-0": "`noncurrent_version_expiration_days`",
    "14-0": "`standard_transition_days`",
    "15-0": "`glacier_transition_days`",
    "16-0": "`expiration_days`",
    "17-0": "`sse_algorithm`",
    "18-0": "`kms_master_key_id`",
    "18-1": "``",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "`[]`",
    "4-1": "`{}`",
    "5-1": "`log-delivery-write`",
    "6-1": "``",
    "7-1": "``",
    "8-1": "``",
    "9-1": "``",
    "10-1": "`true`",
    "11-1": "`false`",
    "12-1": "`30`",
    "13-1": "`90`",
    "14-1": "`30`",
    "15-1": "`60`",
    "16-1": "`90`",
    "17-1": "`AES256`",
    "18-2": "The AWS KMS master key ID used for the SSE-KMS encryption. This can only be used when you set the value of `sse_algorithm` as `aws:kms`. The default AWS/S3 AWS KMS master key is used if this element is absent while the sse_algorithm is `aws:kms`",
    "18-3": "No",
    "17-2": "The server-side encryption algorithm to use. Valid values are `AES256` and `aws:kms`",
    "16-2": "Number of days after which to expunge the objects",
    "15-2": "Number of days after which to move the data to the glacier storage tier",
    "14-2": "Number of days to persist in the standard storage tier before moving to the infrequent access tier",
    "13-2": "Specifies when noncurrent object versions expire",
    "12-2": "Number of days to persist in the standard storage tier before moving to the glacier tier",
    "11-2": "Versioning is a means of keeping multiple variants of an object in the same bucket",
    "10-2": "Enable object lifecycle rules on this bucket",
    "9-2": "All objects will be forcefully deleted from the bucket when bucket destroyed",
    "8-2": "If specified, the AWS region this bucket should reside in. Defaults to region of callee.",
    "7-2": "Object key prefix identifying one or more objects to which the lifecycle rule applies",
    "6-2": "A valid bucket policy JSON document",
    "5-2": "The canned ACL to apply",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "2-2": "Name  (e.g. `log`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No",
    "7-3": "No",
    "8-3": "No",
    "9-3": "No",
    "10-3": "No",
    "17-3": "No",
    "16-3": "No",
    "15-3": "No",
    "14-3": "No",
    "13-3": "No",
    "11-3": "No",
    "12-3": "No"
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
    "0-1": "FQDN of bucket",
    "1-1": "Bucket Name (aka ID)",
    "2-1": "Bucket ARN",
    "3-1": "Prefix configured for lifecycle rules",
    "3-0": "`prefix`",
    "2-0": "`bucket_arn`",
    "1-0": "`bucket_id`",
    "0-0": "`bucket_domain_name`"
  },
  "cols": 2,
  "rows": 4
}
[/block]