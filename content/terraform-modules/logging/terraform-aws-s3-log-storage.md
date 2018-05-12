---
title: terraform-aws-s3-log-storage
description: >-
  This module creates an S3 bucket suitable for receiving logs from other `AWS`
  services such as `S3`, `CloudFront`, and `CloudTrails`.
---

# Terraform AWS S3 Log Storage

|                  |                                                                                                                                                                      |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-s3-log-storage>                                                                                                         |
| Terraform Module | terraform-aws-s3-log-storage                                                                                                                                         |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-s3-log-storage.svg)](https://github.com/cloudposse/terraform-aws-s3-log-storage/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-s3-log-storage.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-s3-log-storage)    |

It implements a configurable log retention policy, which allows you to efficiently manage logs across different storage classes (_e.g._ `Glacier`) and ultimately expire the data altogether.

It enables server-side default encryption.

# References

- <https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html>

# Usage

## HCL

```hcl
module "log_storage" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-s3-log-storage.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                                 | Default              | Description                                                                                                                                                                                                                                           | Required |
|:-------------------------------------|:---------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| `namespace`                          |                      | Namespace (e.g. `cp` or `cloudposse`)                                                                                                                                                                                                                 | Yes      |
| `force_destroy`                      |                      | All objects will be forcefully deleted from the bucket when bucket destroyed                                                                                                                                                                          | No       |
| `lifecycle_rule_enabled`             | `true`               | Enable object lifecycle rules on this bucket                                                                                                                                                                                                          | No       |
| `versioning_enabled`                 | `false`              | Versioning is a means of keeping multiple variants of an object in the same bucket                                                                                                                                                                    | No       |
| `noncurrent_version_transition_days` | `30`                 | Number of days to persist in the standard storage tier before moving to the glacier tier                                                                                                                                                              | No       |
| `noncurrent_version_expiration_days` | `90`                 | Specifies when noncurrent object versions expire                                                                                                                                                                                                      | No       |
| `standard_transition_days`           | `30`                 | Number of days to persist in the standard storage tier before moving to the infrequent access tier                                                                                                                                                    | No       |
| `glacier_transition_days`            | `60`                 | Number of days after which to move the data to the glacier storage tier                                                                                                                                                                               | No       |
| `expiration_days`                    | `90`                 | Number of days after which to expunge the objects                                                                                                                                                                                                     | No       |
| `sse_algorithm`                      | `AES256`             | The server-side encryption algorithm to use. Valid values are `AES256` and `aws:kms`                                                                                                                                                                  | No       |
| `kms_master_key_id`                  |                      | The AWS KMS master key ID used for the SSE-KMS encryption. This can only be used when you set the value of `sse_algorithm` as `aws:kms`. The default AWS/S3 AWS KMS master key is used if this element is absent while the sse_algorithm is `aws:kms` | No       |
| `stage`                              |                      | Stage (e.g. `prod`, `dev`, `staging`)                                                                                                                                                                                                                 | Yes      |
| `name`                               |                      | Name (e.g. `log`)                                                                                                                                                                                                                                     | Yes      |
| `attributes`                         | `[]`                 | Additional attributes (e.g. `policy` or `role`)                                                                                                                                                                                                       | No       |
| `tags`                               | `{}`                 | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                                                                                                                                                                                     | No       |
| `acl`                                | `log-delivery-write` | The canned ACL to apply                                                                                                                                                                                                                               | No       |
| `policy`                             |                      | A valid bucket policy JSON document                                                                                                                                                                                                                   | No       |
| `prefix`                             |                      | Object key prefix identifying one or more objects to which the lifecycle rule applies                                                                                                                                                                 | No       |
| `region`                             |                      | If specified, the AWS region this bucket should reside in. Defaults to region of callee.                                                                                                                                                              | No       |

# Outputs

| Name                 | Description                           |
|:---------------------|:--------------------------------------|
| `bucket_domain_name` | FQDN of bucket                        |
| `bucket_id`          | Bucket Name (aka ID)                  |
| `bucket_arn`         | Bucket ARN                            |
| `prefix`             | Prefix configured for lifecycle rules |
