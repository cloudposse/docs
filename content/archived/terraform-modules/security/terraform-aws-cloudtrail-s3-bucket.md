---
title: terraform-aws-cloudtrail-s3-bucket
description: >-
  Terraform module to provision an S3 bucket with built-in policy to allow
  [CloudTrail](https://aws.amazon.com/cloudtrail/) [logs
  (https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-and-data-events-with-cloudtrail.html).
---

# Terraform AWS CloudTrail S3 Bucket

|                  |                                                                                                                                                                                  |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket>                                                                                                               |
| Terraform Module | terraform-aws-cloudtrail-s3-bucket                                                                                                                                               |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-cloudtrail-s3-bucket.svg)](https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-cloudtrail-s3-bucket.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-cloudtrail-s3-bucket)    |

This is useful if an organization uses a number of separate AWS accounts to isolate the Audit environment from other environments (production, staging, development).

In this case, you create CloudTrail in the production environment (production AWS account), while the S3 bucket to store the CloudTrail logs is created in the Audit AWS account, restricting access to the logs only to the users/groups from the Audit account.

# Features

The module supports the following features.

1. Forced [server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) at rest for the S3 bucket
2. S3 bucket [versioning](https://docs.aws.amazon.com/AmazonS3/latest/dev/Versioning.html) to easily recover from both unintended user actions and application failures
3. S3 bucket is protected from deletion if it's not empty ([force_destroy](https://www.terraform.io/docs/providers/aws/r/s3_bucket.html#force_destroy) set to `false`)

# Usage

Include this module in your existing terraform code:

## HCL

```hcl
module "s3_bucket" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name         | Default              | Description                                                                | Required |
|:-------------|:---------------------|:---------------------------------------------------------------------------|:---------|
| `namespace`  | ``                   | Namespace (e.g. `cp` or `cloudposse`)                                      | Yes      |
| `stage`      | ``                   | Stage (e.g. `prod`, `dev`, `staging`)                                      | Yes      |
| `name`       | ``                   | Name (e.g. `cluster` or `app`)                                             | Yes      |
| `region`     | `us-east-1`          | AWS Region for S3 bucket                                                   | Yes      |
| `attributes` | `[]`                 | Additional attributes (e.g. `logs`)                                        | No       |
| `tags`       | `{}`                 | Additional tags (e.g. `map("BusinessUnit","XYZ")`                          | No       |
| `delimiter`  | `-`                  | Delimiter to be used between `namespace`, `stage`, `name` and `attributes` | No       |
| `acl`        | `log-delivery-write` | Canned ACL to apply to the S3 bucket                                       | No       |

# Outputs

| Name                 | Description    |
|:---------------------|:---------------|
| `bucket_domain_name` | FQDN of bucket |
| `bucket_id`          | Bucket ID      |
| `bucket_arn`         | Bucket ARN     |
