---
title: aws-organization-access-group
sidebar_label: aws-organization-access-group
sidebar_class_name: command
description: |-
  Terraform module to create an IAM Group and Policy to grant permissions to delegated IAM users in the Organization's master account to access a member account

  https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html
tags:
  - aws
  - terraform
  - terraform-modules
  - security
  - iam
  - group
  - iam-role
  - iam-policy
  - cross-account

custom_edit_url: https://github.com/cloudposse/terraform-aws-organization-access-group/edit/master/README.md
---

# Component: `aws-organization-access-group`
Terraform module to create an IAM Group and Policy to grant permissions to delegated IAM users in the Organization's master account to access a member account

https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html




## Introduction

By default, when you create a member account as part of your Organization, AWS automatically creates `OrganizationAccountAccessRole` in the member account.

The role grants admin permissions to access the member account to delegated IAM users in the master account.

In the master account you need to create a Policy to grant permissions to IAM users to assume `OrganizationAccountAccessRole` in the member account.

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


<br/>

__NOTE__: Member accounts that you invite to join your Organization (that are not part of your Organization) do not automatically get `OrganizationAccountAccessRole` created.
You can use [terraform-aws-organization-access-role](https://github.com/cloudposse/terraform-aws-organization-access-role) module to create `OrganizationAccountAccessRole` role in an invited member account.

<br/>



## Usage

```hcl
module "organization_access_group" {
  source            = "git::https://github.com/cloudposse/terraform-aws-organization-access-group.git?ref=master"
  namespace         = "cp"
  stage             = "dev"
  name              = "cluster"
  user_names        = ["User1","User2"]
  role_arns         = {
    "cp@dev" = "arn:aws:iam::XXXXXXXXX:role/OrganizationAccountAccessRole"
  }
  require_mfa       = "true"
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
| attributes | Additional attributes (e.g. `1`) | list | `<list>` | no |
| delimiter | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | string | `-` | no |
| enabled | Whether to create these resources | string | `true` | no |
| name | Name  (e.g. `app` or `cluster`) | string | - | yes |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | - | yes |
| require_mfa | Require the users to have MFA enabled | string | `false` | no |
| role_arns | A map of alias -> IAM Role ARNs the users in the Group can assume | map | `<map>` | no |
| stage | Stage (e.g. `prod`, `dev`, `staging`, `infra`) | string | - | yes |
| switchrole_url_template | URL template for the IAM console to switch to the roles | string | `https://signin.aws.amazon.com/switchrole?account=%s&roleName=%s&displayName=%s` | no |
| tags | Additional tags (e.g. map(`BusinessUnit`,`XYZ`) | map | `<map>` | no |
| user_names | A list of IAM User names to associate with the Group | list | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| group_arn | The ARN assigned by AWS for the Group |
| group_id | The Group's ID |
| group_name | The Group's name |
| group_unique_id | Group's unique ID assigned by AWS |
| policy_id | The policy ID |
| policy_name | The name of the policy |
| switchrole_urls | List of URL to the IAM console to switch to the roles |



