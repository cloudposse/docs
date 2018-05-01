---
title: "terraform-aws-iam-assumed-roles"
excerpt: "Terraform module to provision two IAM roles and two IAM groups for assuming the roles provided MFA is present, and add IAM users to the groups."
---
# Terraform AWS IAM Assumed Roles
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-iam-assumed-roles",
    "1-1": "terraform-aws-iam-assumed-roles ",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-iam-assumed-roles.svg)](https://github.com/cloudposse/terraform-aws-iam-assumed-roles/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-iam-assumed-roles.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-iam-assumed-roles)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

- Role and group with Administrator (full) access to AWS resources. To give a user administrator's access, add the user to the admin group.
- Role and group with Read-only access to AWS resources. To give a user `readonly` access, add the user to the `readonly` group.

# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"assumed_roles\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-iam-assumed-roles.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "2-0": "`admin_name`",
    "3-0": "`readonly_name`",
    "4-0": "`admin_user_names`",
    "5-0": "`readonly_user_names`",
    "6-0": "`attributes`",
    "7-0": "`tags`",
    "8-0": "`delimiter`",
    "8-1": "`-`",
    "7-1": "`{}`",
    "6-1": "`[]`",
    "5-1": "`[]`",
    "4-1": "`[]`",
    "3-1": "`readonly`",
    "2-1": "`admin`",
    "1-1": "``",
    "0-1": "``",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name for the admin group and role",
    "3-2": "Name for the readonly group and role",
    "4-2": "Optional list of IAM user names to add to the admin group",
    "5-2": "Optional list of IAM user names to add to the readonly group",
    "6-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "7-2": "Additional tags (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "8-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No",
    "7-3": "No",
    "8-3": "No"
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
    "0-1": "Admin group ID",
    "1-1": "Admin group ARN",
    "2-1": "Admin group name",
    "3-1": "Readonly group ID",
    "4-1": "Readonly group ARN",
    "5-1": "Readonly group name",
    "6-1": "Admin role ARN",
    "7-1": "Admin role name",
    "8-1": "Readonly role ARN",
    "9-1": "Readonly role name",
    "9-0": "`role_readonly_name`",
    "8-0": "`role_readonly_arn`",
    "7-0": "`role_admin_name`",
    "6-0": "`role_admin_arn`",
    "5-0": "`group_readonly_name`",
    "4-0": "`group_readonly_arn`",
    "3-0": "`group_readonly_id`",
    "2-0": "`group_admin_name`",
    "1-0": "`group_admin_arn`",
    "0-0": "`group_admin_id`"
  },
  "cols": 2,
  "rows": 10
}
[/block]