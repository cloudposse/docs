---
title: "terraform-aws-organization-access-role"
excerpt: "Terraform module to create an IAM Role to grant permissions to delegated IAM users in the master account to access an invited member account"
---
# Terraform AWS Organization Access Role
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-organization-access-role",
    "1-1": "terraform-aws-organization-access-role",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-organization-access-role.svg)](https://github.com/cloudposse/terraform-aws-organization-access-role/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-organization-access-role.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-organization-access-role)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Introduction

By default, when you create a member account as part of your Organization, AWS automatically creates `OrganizationAccountAccessRole` in the member account.

The role grants admin permissions to the member account to delegated IAM users in the master account.

However, member accounts that you invite to join your Organization do not automatically get the role created.

This module creates `OrganizationAccountAccessRole` role in an invited member account.

AWS recommends using the same name, `OrganizationAccountAccessRole`, for the created role for consistency and ease of remembering.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/e24ad8c-OrganizationAccountAccessRole.png",
        "OrganizationAccountAccessRole.png",
        2752,
        1602,
        "#efeff0"
      ]
    }
  ]
}
[/block]
# Usage

[block:code]
{
  "codes": [
    {
      "code": "module \"organization_access_role\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-organization-access-role.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
After the role has been created in the invited member account, login to the master account and create the following policy:

(change `YYYYYYYYYYYY` to the ID of the invited member account)
[block:code]
{
  "codes": [
    {
      "code": "{\n    \"Version\": \"2012-10-17\",\n    \"Statement\": [\n        {\n            \"Sid\": \"\",\n            \"Effect\": \"Allow\",\n            \"Action\": [\n                \"sts:AssumeRole\"\n            ],\n            \"Resource\": [\n                \"arn:aws:iam::YYYYYYYYYYYY:role/OrganizationAccountAccessRole\"\n            ]\n        }\n    ]\n}",
      "language": "json"
    }
  ]
}
[/block]
Then attach the policy to a master account Group that you want to delegate administration of the invited member account.

After that, users who are members of the Group in the master account will be able to assume the role and administer the invited member account by going here:

(change `YYYYYYYYYYYY` to the ID of the invited member account)

```
https://signin.aws.amazon.com/switchrole
                ?account=YYYYYYYYYYYY
                &roleName=OrganizationAccountAccessRole
                &displayName=Dev
```

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "You can use [terraform-aws-organization-access-group](https://github.com/cloudposse/terraform-aws-organization-access-group) module\nto create an IAM Group and Policy to grant permissions to delegated IAM users in the Organization's master account to access a member account."
}
[/block]
# References

* https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html

# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-0": "`master_account_id`",
    "1-0": "`role_name`",
    "2-0": "`policy_arn`",
    "0-1": "``",
    "1-1": "`OrganizationAccountAccessRole`",
    "2-1": "`arn:aws:iam::aws:policy/AdministratorAccess`",
    "0-2": "The ID of the master account to grant permissions to access the current account",
    "1-2": "The name of the role to grant permissions to delegated IAM users in the master account to the current account",
    "2-2": "Policy ARN to attach to the role. By default, it attaches `AdministratorAccess` managed policy to grant full access to AWS services and resources in the current account",
    "0-3": "Yes",
    "1-3": "No",
    "2-3": "No"
  },
  "cols": 4,
  "rows": 3
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "0-0": "`role_name`",
    "h-0": "Name",
    "h-1": "Description",
    "1-0": "`role_id`",
    "2-0": "`role_arn`",
    "2-1": "The Amazon Resource Name (ARN) specifying the role",
    "1-1": "The stable and unique string identifying the role",
    "0-1": "The name of the created role"
  },
  "cols": 2,
  "rows": 3
}
[/block]