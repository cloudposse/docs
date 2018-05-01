---
title: "terraform-aws-iam-system-user"
excerpt: "Terraform Module to provision a basic IAM system user suitable for CI/CD Systems\n(_e.g._ TravisCI, CircleCI, CodeFresh) or systems which are *external* to AWS that cannot leverage [AWS IAM Instance Profiles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)."
---
# Terraform AWS IAM System User
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-iam-system-user",
    "1-1": "terraform-aws-iam-system-user",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-iam-system-user.svg)](https://github.com/cloudposse/terraform-aws-iam-system-user/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-iam-system-user.svg)](https://travis-ci.org/cloudposse/terraform-aws-iam-system-user)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
We do not recommend creating IAM users this way for any other purpose.

# Usage

## Example 1

Sometimes it's necessary to generate some AWS credentials for a CI/CD system like CircleCi, TravisCI or CodeFresh. Here's how we recommend doing that.
[block:code]
{
  "codes": [
    {
      "code": "# Provision a user account for CircleCI to deploy assets\nmodule \"cicd_user\" {\n  source    = \"git::https://github.com/cloudposse/terraform-aws-iam-system-user.git?ref=tags/0.2.2\"\n  namespace = \"cp\"\n  stage     = \"staging\"\n  name      = \"cicd\"\n}\n\nvariable \"deployment_buckets\" {\n  description = \"List of buckets to permit deployment\"\n  type        = \"list\"\n  default     = [\"cp-staging-assets\"]\n}\n\n# Define permissions for this user\ndata \"aws_iam_policy_document\" \"cicd\" {\n  statement {\n    actions = [\"s3:PutObject\", \"s3:PutObjectAcl\", \"s3:GetObject\", \"s3:DeleteObject\", \"s3:ListBucket\", \"s3:ListBucketMultipartUploads\", \"s3:GetBucketLocation\", \"s3:AbortMultipartUpload\"]\n\n    effect = \"Allow\"\n\n    resources = [\"${compact(concat(formatlist(\"arn:aws:s3:::%v\", var.deployment_buckets), formatlist(\"arn:aws:s3:::%v/*\", var.deployment_buckets)))}\"]\n  }\n}\n\nresource \"aws_iam_user_policy\" \"cicd\" {\n  name   = \"${module.circleci.user_name}\"\n  user   = \"${module.circleci.user_name}\"\n  policy = \"${data.aws_iam_policy_document.circleci.json}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

## Example 2
[block:code]
{
  "codes": [
    {
      "code": "data \"aws_iam_policy_document\" \"fluentd_user_policy\" {\n  statement {\n    actions = [\n      \"logs:DescribeDestinations\",\n      \"logs:DescribeExportTasks\",\n      \"logs:DescribeLogGroups\",\n      \"logs:DescribeLogStreams\",\n      \"logs:DescribeMetricFilters\",\n      \"logs:DescribeSubscriptionFilters\",\n      \"logs:FilterLogEvents\",\n      \"logs:GetLogEvents\",\n      \"logs:CreateLogGroup\",\n      \"logs:CreateLogStream\",\n      \"logs:PutLogEvents\",\n      \"logs:DescribeLogStreams\",\n      \"logs:CreateLogStream\",\n      \"logs:DeleteLogStream\",\n    ]\n\n    resources = [\"*\"]\n  }\n}\n\nmodule \"fluentd_user\" {\n  source    = \"git::https://github.com/cloudposse/terraform-aws-iam-system-user.git?ref=master\"\n  namespace = \"cp\"\n  stage     = \"dev\"\n  name      = \"fluentd\"\n  policy    = \"${data.aws_iam_policy_document.fluentd_user_policy.json}\"\n}",
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
    "5-0": "`delimiter`",
    "6-0": "`force_destroy`",
    "7-0": "`path`",
    "8-0": "`enabled`",
    "9-0": "`policy`",
    "9-1": "``",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "`[]`",
    "4-1": "`{}`",
    "5-1": "`-`",
    "6-1": "`false`",
    "7-1": "`/`",
    "8-1": "`true`",
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
    "0-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "2-2": "Name  (e.g. `bastion` or `db`)",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "4-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "5-2": "Delimiter to be used between `name`, `namespace`, `stage`, `arguments`, etc.",
    "6-2": "Destroy even if it has non-Terraform-managed IAM access keys, login profile or MFA devices.",
    "7-2": "Path in which to create the user",
    "8-2": "Set to `false` to prevent the module from creating any resources",
    "9-2": "User policy in `json` format"
  },
  "cols": 4,
  "rows": 10
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "0-1": "Normalized IAM user name",
    "h-1": "Description",
    "h-0": "Name",
    "0-0": "`user_name`",
    "1-0": "`user_arn`",
    "2-0": "`user_unique_id`",
    "3-0": "`access_key_id`",
    "4-0": "`secret_access_key`",
    "4-1": "The secret access key. This will be written to the state file in plain-text",
    "3-1": "The access key ID",
    "2-1": "The unique ID assigned by AWS",
    "1-1": "The ARN assigned by AWS for this user"
  },
  "cols": 2,
  "rows": 5
}
[/block]