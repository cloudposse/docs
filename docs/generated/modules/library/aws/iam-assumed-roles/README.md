---
title: iam-assumed-roles
sidebar_label: iam-assumed-roles
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

custom_edit_url: https://github.com/cloudposse/terraform-aws-iam-assumed-roles/blob/main/README.yaml
---

# Module: `iam-assumed-roles`
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






<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_admin_label"></a> [admin\_label](#module\_admin\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.3 |
| <a name="module_readonly_label"></a> [readonly\_label](#module\_readonly\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.3 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_group.admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group) | resource |
| [aws_iam_group.readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group) | resource |
| [aws_iam_group_membership.admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_membership) | resource |
| [aws_iam_group_membership.readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_membership) | resource |
| [aws_iam_group_policy_attachment.allow_chage_password_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.allow_change_password_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.assume_role_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.assume_role_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.key_management_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.key_management_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.manage_mfa_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_group_policy_attachment.manage_mfa_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_group_policy_attachment) | resource |
| [aws_iam_policy.allow_change_password_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.allow_change_password_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.allow_key_management_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.allow_key_management_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.assume_role_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.assume_role_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.manage_mfa_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.manage_mfa_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role.readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.allow_change_password](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.allow_key_management](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.assume_role_admin](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.assume_role_readonly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.manage_mfa](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.role_trust](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_admin_name"></a> [admin\_name](#input\_admin\_name) | Name for the admin group and role (e.g. `admin`) | `string` | `"admin"` | no |
| <a name="input_admin_user_names"></a> [admin\_user\_names](#input\_admin\_user\_names) | Optional list of IAM user names to add to the admin group | `list(string)` | `[]` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `policy` or `role`) | `list(string)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | `string` | `"-"` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `string` | `"true"` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `cp` or `cloudposse`) | `string` | n/a | yes |
| <a name="input_readonly_name"></a> [readonly\_name](#input\_readonly\_name) | Name for the readonly group and role (e.g. `readonly`) | `string` | `"readonly"` | no |
| <a name="input_readonly_user_names"></a> [readonly\_user\_names](#input\_readonly\_user\_names) | Optional list of IAM user names to add to the readonly group | `list(string)` | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `string` | n/a | yes |
| <a name="input_switchrole_url"></a> [switchrole\_url](#input\_switchrole\_url) | URL to the IAM console to switch to a role | `string` | `"https://signin.aws.amazon.com/switchrole?account=%s&roleName=%s&displayName=%s"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. map(`BusinessUnit`,`XYZ`) | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_group_admin_arn"></a> [group\_admin\_arn](#output\_group\_admin\_arn) | Admin group ARN |
| <a name="output_group_admin_id"></a> [group\_admin\_id](#output\_group\_admin\_id) | Admin group ID |
| <a name="output_group_admin_name"></a> [group\_admin\_name](#output\_group\_admin\_name) | Admin group name |
| <a name="output_group_readonly_arn"></a> [group\_readonly\_arn](#output\_group\_readonly\_arn) | Readonly group ARN |
| <a name="output_group_readonly_id"></a> [group\_readonly\_id](#output\_group\_readonly\_id) | Readonly group ID |
| <a name="output_group_readonly_name"></a> [group\_readonly\_name](#output\_group\_readonly\_name) | Readonly group name |
| <a name="output_role_admin_arn"></a> [role\_admin\_arn](#output\_role\_admin\_arn) | Admin role ARN |
| <a name="output_role_admin_name"></a> [role\_admin\_name](#output\_role\_admin\_name) | Admin role name |
| <a name="output_role_readonly_arn"></a> [role\_readonly\_arn](#output\_role\_readonly\_arn) | Readonly role ARN |
| <a name="output_role_readonly_name"></a> [role\_readonly\_name](#output\_role\_readonly\_name) | Readonly role name |
| <a name="output_switchrole_admin_url"></a> [switchrole\_admin\_url](#output\_switchrole\_admin\_url) | URL to the IAM console to switch to the admin role |
| <a name="output_switchrole_readonly_url"></a> [switchrole\_readonly\_url](#output\_switchrole\_readonly\_url) | URL to the IAM console to switch to the readonly role |
<!-- markdownlint-restore -->

