---
title: terraform-aws-iam-system-user
description: >-
  Terraform Module to provision a basic IAM system user suitable for CI/CD
  Systems

  (_e.g._ TravisCI, CircleCI, Codefresh) or systems which are *external* to AWS
  that cannot leverage [AWS IAM Instance
  Profiles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html).
---

# Terraform AWS IAM System User

|                  |                                                                                                                                                                        |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-iam-system-user>                                                                                                          |
| Terraform Module | terraform-aws-iam-system-user                                                                                                                                          |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-iam-system-user.svg)](https://github.com/cloudposse/terraform-aws-iam-system-user/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-iam-system-user.svg)](https://travis-ci.org/cloudposse/terraform-aws-iam-system-user)                  |

We do not recommend creating IAM users this way for any other purpose.

# Usage

## Example 1

Sometimes it's necessary to generate some AWS credentials for a CI/CD system like CircleCi, TravisCI or Codefresh. Here's how we recommend doing that.

### HCL

```hcl
# Provision a user account for CircleCI to deploy assets
module "cicd_user" {
  source    = "git::https://github.com/cloudposse/terraform-aws-iam-system-user.git?ref=tags/0.2.2"
  namespace = "cp"
  stage     = "staging"
  name      = "cicd"
}

variable "deployment_buckets" {
  description = "List of buckets to permit deployment"
  type        = "list"
  default     = ["cp-staging-assets"]
}

# Define permissions for this user
data "aws_iam_policy_document" "cicd" {
  statement {
    actions = ["s3:PutObject", "s3:PutObjectAcl", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket", "s3:ListBucketMultipartUploads", "s3:GetBucketLocation", "s3:AbortMultipartUpload"]

    effect = "Allow"

    resources = ["${compact(concat(formatlist("arn:aws:s3:::%v", var.deployment_buckets), formatlist("arn:aws:s3:::%v/*", var.deployment_buckets)))}"]
  }
}

resource "aws_iam_user_policy" "cicd" {
  name   = "${module.circleci.user_name}"
  user   = "${module.circleci.user_name}"
  policy = "${data.aws_iam_policy_document.circleci.json}"
}
```

## Example 2

### HCL

```hcl
data "aws_iam_policy_document" "fluentd_user_policy" {
  statement {
    actions = [
      "logs:DescribeDestinations",
      "logs:DescribeExportTasks",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:DescribeMetricFilters",
      "logs:DescribeSubscriptionFilters",
      "logs:FilterLogEvents",
      "logs:GetLogEvents",
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
      "logs:CreateLogStream",
      "logs:DeleteLogStream",
    ]

    resources = ["*"]
  }
}

module "fluentd_user" {
  source    = "git::https://github.com/cloudposse/terraform-aws-iam-system-user.git?ref=master"
  namespace = "cp"
  stage     = "dev"
  name      = "fluentd"
  policy    = "${data.aws_iam_policy_document.fluentd_user_policy.json}"
}
```

# Variables

| Name            | Default | Description                                                                                 | Required |
|:----------------|:--------|:--------------------------------------------------------------------------------------------|:---------|
| `namespace`     |         | Namespace (e.g. `cp` or `cloudposse`)                                                       | Yes      |
| `policy`        |         | User policy in `json` format                                                                | No       |
| `stage`         |         | Stage (e.g. `prod`, `dev`, `staging`)                                                       | Yes      |
| `name`          |         | Name (e.g. `bastion` or `db`)                                                               | Yes      |
| `attributes`    | `[]`    | Additional attributes (e.g. `policy` or `role`)                                             | No       |
| `tags`          | `{}`    | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                           | No       |
| `delimiter`     | `-`     | Delimiter to be used between `name`, `namespace`, `stage`, `arguments`, etc.                | No       |
| `force_destroy` | `false` | Destroy even if it has non-Terraform-managed IAM access keys, login profile or MFA devices. | No       |
| `path`          | `/`     | Path in which to create the user                                                            | No       |
| `enabled`       | `true`  | Set to `false` to prevent the module from creating any resources                            | No       |

# Outputs

| Name                | Description                                                                 |
|:--------------------|:----------------------------------------------------------------------------|
| `user_name`         | Normalized IAM user name                                                    |
| `user_arn`          | The ARN assigned by AWS for this user                                       |
| `user_unique_id`    | The unique ID assigned by AWS                                               |
| `access_key_id`     | The access key ID                                                           |
| `secret_access_key` | The secret access key. This will be written to the state file in plain-text |
