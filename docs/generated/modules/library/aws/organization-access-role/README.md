---
title: organization-access-role
sidebar_label: organization-access-role
sidebar_class_name: command
description: |-
  Terraform module to create an IAM Role to grant permissions to delegated IAM users in the master account to access an invited member account

  https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html
tags:
  - aws
  - terraform
  - terraform-modules
  - security
  - role
  - policy
  - permissions
  - aws-iam

custom_edit_url: https://github.com/cloudposse/terraform-aws-organization-access-role/blob/main/README.yaml
---

# Module: `organization-access-role`
Terraform module to create an IAM Role to grant permissions to delegated IAM users in the master account to access an invited member account

https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html


## Screenshots


![terraform-aws-organization-access-role](images/OrganizationAccountAccessRole.png)
*Organization Account Access Role as Viewed from the AWS Web Console*


## Introduction

By default, when you create a member account as part of your Organization, AWS automatically creates `OrganizationAccountAccessRole` in the member account.

The role grants admin permissions to the member account to delegated IAM users in the master account.

However, member accounts that you invite to join your Organization do not automatically get the role created.

This module creates `OrganizationAccountAccessRole` role in an invited member account.

AWS recommends using the same name, `OrganizationAccountAccessRole`, for the created role for consistency and ease of remembering.

<br/>



## Usage

```hcl
module "organization_access_role" {
  source            = "git::https://github.com/cloudposse/terraform-aws-organization-access-role.git?ref=master"
  master_account_id = "XXXXXXXXXXXX"
  role_name         = "OrganizationAccountAccessRole"
  policy_arn        = "arn:aws:iam::aws:policy/AdministratorAccess"
```


After the role has been created in the invited member account, login to the master account and create the following policy:

(change `YYYYYYYYYYYY` to the ID of the invited member account)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Action": [
                "sts:AssumeRole"
            ],
            "Resource": [
                "arn:aws:iam::YYYYYYYYYYYY:role/OrganizationAccountAccessRole"
            ]
        }
    ]
}
```


Then attach the policy to a master account Group that you want to delegate administration of the invited member account.

After that, users who are members of the Group in the master account will be able to assume the role and administer the invited member account by going here:

(change `YYYYYYYYYYYY` to the ID of the invited member account)

```
https://signin.aws.amazon.com/switchrole
                ?account=YYYYYYYYYYYY
                &roleName=OrganizationAccountAccessRole
                &displayName=Dev
```


__NOTE__: You can use [terraform-aws-organization-access-group](https://github.com/cloudposse/terraform-aws-organization-access-group) module
to create an IAM Group and Policy to grant permissions to delegated IAM users in the Organization's master account to access a member account.






<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_master_account_id"></a> [master\_account\_id](#input\_master\_account\_id) | The ID of the master account to grant permissions to access the current account | `string` | n/a | yes |
| <a name="input_policy_arn"></a> [policy\_arn](#input\_policy\_arn) | Policy ARN to attach to the role. By default it attaches `AdministratorAccess` managed policy to grant full access to AWS services and resources in the current account | `string` | `"arn:aws:iam::aws:policy/AdministratorAccess"` | no |
| <a name="input_role_name"></a> [role\_name](#input\_role\_name) | The name of the role to grant permissions to delegated IAM users in the master account to the current account | `string` | `"OrganizationAccountAccessRole"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_role_arn"></a> [role\_arn](#output\_role\_arn) | The Amazon Resource Name (ARN) specifying the role |
| <a name="output_role_id"></a> [role\_id](#output\_role\_id) | The stable and unique string identifying the role |
| <a name="output_role_name"></a> [role\_name](#output\_role\_name) | The name of the crated role |
<!-- markdownlint-restore -->

