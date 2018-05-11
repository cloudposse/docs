---
title: terraform-aws-iam-assumed-roles
description: >-
  Terraform module to provision two IAM roles and two IAM groups for assuming
  the roles provided MFA is present, and add IAM users to the groups.
---

# Terraform AWS IAM Assumed Roles

|                  |                                                                                                                                                                            |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-iam-assumed-roles>                                                                                                            |
| Terraform Module | terraform-aws-iam-assumed-roles                                                                                                                                            |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-iam-assumed-roles.svg)](https://github.com/cloudposse/terraform-aws-iam-assumed-roles/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-iam-assumed-roles.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-iam-assumed-roles)    |

- Role and group with Administrator (full) access to AWS resources. To give a user administrator's access, add the user to the admin group.
- Role and group with Read-only access to AWS resources. To give a user `readonly` access, add the user to the `readonly` group.

# Usage

## HCL

```hcl
module "assumed_roles" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-iam-assumed-roles.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                  | Default    | Description                                                                 | Required |
|:----------------------|:-----------|:----------------------------------------------------------------------------|:---------|
| `namespace`           |            | Namespace (_e.g._ `cp` or `cloudposse`)                                     | Yes      |
| `stage`               |            | Stage (_e.g._ `prod`, `dev`, `staging`)                                     | Yes      |
| `admin_name`          | `admin`    | Name for the admin group and role                                           | Yes      |
| `readonly_name`       | `readonly` | Name for the readonly group and role                                        | Yes      |
| `admin_user_names`    | `[]`       | Optional list of IAM user names to add to the admin group                   | No       |
| `readonly_user_names` | `[]`       | Optional list of IAM user names to add to the readonly group                | No       |
| `attributes`          | `[]`       | Additional attributes (_e.g._ `policy` or `role`)                           | No       |
| `tags`                | `{}`       | Additional tags (_e.g._ `map("BusinessUnit","XYZ")`                         | No       |
| `delimiter`           | `-`        | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |

# Outputs

| Name                  | Description         |
|:----------------------|:--------------------|
| `group_admin_id`      | Admin group ID      |
| `role_readonly_name`  | Readonly role name  |
| `group_admin_arn`     | Admin group ARN     |
| `group_admin_name`    | Admin group name    |
| `group_readonly_id`   | Readonly group ID   |
| `group_readonly_arn`  | Readonly group ARN  |
| `group_readonly_name` | Readonly group name |
| `role_admin_arn`      | Admin role ARN      |
| `role_admin_name`     | Admin role name     |
| `role_readonly_arn`   | Readonly role ARN   |
