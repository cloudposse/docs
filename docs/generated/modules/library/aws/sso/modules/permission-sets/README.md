---
title: permission-sets
sidebar_label: permission-sets
sidebar_class_name: command
description: permission-sets
custom_edit_url: https://github.com/cloudposse/terraform-aws-sso/blob/main/modules/permission-sets/README.md
---

# AWS SSO Permission Sets Module

This module creates a collection of [AWS SSO permission sets](https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html). A permission set is a collection of administrator-defined policies that AWS SSO uses to determine a user's effective permissions to access a given AWS account. Permission sets can contain either AWS managed policies or custom policies that are stored in AWS SSO. Policies are essentially documents that act as containers for one or more permission statements. These statements represent individual access controls (allow or deny) for various tasks that determine what tasks users can or cannot perform within the AWS account.

Permission sets are stored in AWS SSO and are only used for AWS accounts. They are not used to manage access to cloud applications. Permission sets ultimately get created as IAM roles in a given AWS account, with trust policies that allow users to assume the role through AWS SSO.

## Usage

**IMPORTANT:** The `master` branch is used in `source` just as an example. In your code, do not pin to `master` because there may be breaking changes between releases.
Instead pin to the release tag (e.g. `?ref=tags/x.y.z`) of one of our [latest releases](https://github.com/cloudposse/terraform-aws-sso/releases).

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-sso/tree/main/examples/complete).

```hcl
module "permission_sets" {
  source = "https://github.com/cloudposse/terraform-aws-sso.git//modules/permission-sets?ref=master"

  permission_sets = [
    {
      name               = "AdministratorAccess",
      description        = "Allow Full Access to the account",
      relay_state        = "",
      session_duration   = "",
      tags               = {},
      inline_policy      = "",
      policy_attachments = ["arn:aws:iam::aws:policy/AdministratorAccess"]
      customer_managed_policy_attachments = [{
        name = aws_iam_policy.S3Access.name
        path = aws_iam_policy.S3Access.path
      }]
    },
    {
      name                                = "S3AdministratorAccess",
      description                         = "Allow Full S3 Admininstrator access to the account",
      relay_state                         = "",
      session_duration                    = "",
      tags                                = {},
      inline_policy                       = data.aws_iam_policy_document.S3Access.json,
      policy_attachments                  = []
      customer_managed_policy_attachments = []
    }
  ]
  context = module.this.context
}

data "aws_iam_policy_document" "S3Access" {
  statement {
    sid = "1"

    actions = ["*"]

    resources = [
      "arn:aws:s3:::*",
    ]
  }
}

resource "aws_iam_policy" "S3Access" {
  name   = "S3Access"
  path   = "/"
  policy = data.aws_iam_policy_document.S3Access.json
  tags   = module.this.tags
}

```

