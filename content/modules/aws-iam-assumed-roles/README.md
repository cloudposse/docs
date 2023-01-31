---
title: aws-iam-assumed-roles
sidebar_label: aws-iam-assumed-roles
sidebar_class_name: command
description: |-
  Terraform module to provision two IAM roles and two IAM groups for assuming the roles provided MFA is present,
  and add IAM users to the groups.

  - Role and group with Administrator (full) access to AWS resources
  - Role and group with Readonly access to AWS resources

  To give a user administrator's access, add the user to the admin group.

  To give a user readonly access, add the user to the readonly group.
tags:
  - aws
  - terraform
  - terraform-modules
  - security
  - iam-role
  - sts
  - mfa
  - iam
  - assume-role

custom_edit_url: https://github.com/cloudposse/terraform-aws-iam-assumed-roles/edit/master/README.md
---

# Component: `aws-iam-assumed-roles`
Terraform module to provision two IAM roles and two IAM groups for assuming the roles provided MFA is present,
and add IAM users to the groups.

- Role and group with Administrator (full) access to AWS resources
- Role and group with Readonly access to AWS resources

To give a user administrator's access, add the user to the admin group.

To give a user readonly access, add the user to the readonly group.






## Usage

```hcl
module "assumed_roles" {
  source              = "git::https://github.com/cloudposse/terraform-aws-iam-assumed-roles.git?ref=master"
  namespace           = "cp"
  stage               = "prod"
  admin_name          = "admin"
  readonly_name       = "readonly"
  admin_user_names    = ["User1","User2"] # Add these IAM users to the admin group
  readonly_user_names = ["User3","User4"] # Add these IAM users to the readonly group
}
```






## Makefile Targets
```
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```
## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| admin_name | Name for the admin group and role (e.g. `admin`) | string | `admin` | no |
| admin_user_names | Optional list of IAM user names to add to the admin group | list | `<list>` | no |
| attributes | Additional attributes (e.g. `policy` or `role`) | list | `<list>` | no |
| delimiter | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | string | `-` | no |
| enabled | Set to false to prevent the module from creating any resources | string | `true` | no |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | - | yes |
| readonly_name | Name for the readonly group and role (e.g. `readonly`) | string | `readonly` | no |
| readonly_user_names | Optional list of IAM user names to add to the readonly group | list | `<list>` | no |
| stage | Stage (e.g. `prod`, `dev`, `staging`) | string | - | yes |
| switchrole_url | URL to the IAM console to switch to a role | string | `https://signin.aws.amazon.com/switchrole?account=%s&roleName=%s&displayName=%s` | no |
| tags | Additional tags (e.g. map(`BusinessUnit`,`XYZ`) | map | `<map>` | no |

## Outputs

| Name | Description |
|------|-------------|
| group_admin_arn | Admin group ARN |
| group_admin_id | Admin group ID |
| group_admin_name | Admin group name |
| group_readonly_arn | Readonly group ARN |
| group_readonly_id | Readonly group ID |
| group_readonly_name | Readonly group name |
| role_admin_arn | Admin role ARN |
| role_admin_name | Admin role name |
| role_readonly_arn | Readonly role ARN |
| role_readonly_name | Readonly role name |
| switchrole_admin_url | URL to the IAM console to switch to the admin role |
| switchrole_readonly_url | URL to the IAM console to switch to the readonly role |



