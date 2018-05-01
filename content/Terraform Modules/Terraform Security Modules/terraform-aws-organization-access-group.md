---
title: "terraform-aws-organization-access-group"
excerpt: "Terraform module to create an IAM Group and Policy to grant permissions to delegated IAM users in the Organization's master account to access a member account"
---
# Terraform AWS Organization Access Group
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-organization-access-group",
    "1-1": "terraform-aws-organization-access-group",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-organization-access-group.svg)](https://github.com/cloudposse/terraform-aws-organization-access-group/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-organization-access-group.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-organization-access-group)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Introduction

By default, when you create a member account as part of your Organization, AWS automatically creates `OrganizationAccountAccessRole` in the member account.

The role grants admin permissions to access the member account to delegated IAM users in the master account.

In the master account, you need to create a Policy to grant permissions to IAM users to assume `OrganizationAccountAccessRole` in the member account.

This module does the following:

1. Creates an IAM Group
2. Adds the provided IAM users to the Group
3. Creates a Policy to grant permissions to the IAM users in the master account to assume `OrganizationAccountAccessRole` in the member account
4. Attaches the Policy to the Group


Users who are members of the Group will be able to assume the role and administer the member account by going here:

(change `XXXXXXXXXXXX` to the ID of the member account)

```
https://signin.aws.amazon.com/switchrole
                ?account=XXXXXXXXXXXX
                &roleName=OrganizationAccountAccessRole
                &displayName=Dev
```
[block:callout]
{
  "type": "warning",
  "title": "IMPORTANT",
  "body": "Member accounts that you invite to join your Organization (that are not part of your Organization) do not automatically get `OrganizationAccountAccessRole` created.\nYou can use [terraform-aws-organization-access-role](https://github.com/cloudposse/terraform-aws-organization-access-role) module to create `OrganizationAccountAccessRole` role in an invited member account."
}
[/block]
# Usage

[block:code]
{
  "codes": [
    {
      "code": "module \"organization_access_group\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-organization-access-group.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
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
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "``",
    "4-1": "``",
    "5-1": "`OrganizationAccountAccessRole`",
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`user_names`",
    "4-0": "`member_account_id`",
    "5-0": "`role_name`",
    "6-0": "`attributes`",
    "7-0": "`tags`",
    "8-0": "`delimiter`",
    "8-1": "`-`",
    "7-1": "`{}`",
    "6-1": "`[]`",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name  (_e.g._ `app` or `cluster`)",
    "3-2": "A list of IAM User names to associate with the Group",
    "4-2": "The ID of the member account to grant access permissions to the users in the Group",
    "5-2": "The name of the Role in the member account to grant permissions to the users in the Group",
    "6-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "7-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "8-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "8-3": "No",
    "7-3": "No",
    "6-3": "No",
    "5-3": "No",
    "4-3": "Yes",
    "3-3": "Yes",
    "2-3": "Yes",
    "1-3": "Yes",
    "0-3": "Yes"
  },
  "cols": 4,
  "rows": 9
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-1": "The Group's name",
    "1-1": "The Group's ID",
    "2-1": "Group's unique ID assigned by AWS",
    "3-1": "The ARN assigned by AWS for the Group",
    "4-1": "The name of the policy",
    "5-1": "The policy ID",
    "5-0": "`policy_id`",
    "4-0": "`policy_name`",
    "3-0": "`group_arn`",
    "2-0": "`group_unique_id`",
    "1-0": "`group_id`",
    "0-0": "`group_name`"
  },
  "cols": 2,
  "rows": 6
}
[/block]