---
title: terraform-aws-organization-access-role
description: >-
  Terraform module to create an IAM Role to grant permissions to delegated IAM
  users in the master account to access an invited member account
---

# Terraform AWS Organization Access Role

|                  |                                                                                                                                                                                          |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-organization-access-role>                                                                                                                   |
| Terraform Module | terraform-aws-organization-access-role                                                                                                                                                   |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-organization-access-role.svg)](https://github.com/cloudposse/terraform-aws-organization-access-role/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-organization-access-role.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-organization-access-role)    |

# Introduction

By default, when you create a member account as part of your Organization, AWS automatically creates `OrganizationAccountAccessRole` in the member account.

The role grants admin permissions to the member account to delegated IAM users in the master account.

However, member accounts that you invite to join your Organization do not automatically get the role created.

This module creates `OrganizationAccountAccessRole` role in an invited member account.

AWS recommends using the same name, `OrganizationAccountAccessRole`, for the created role for consistency and ease of remembering. ![AWS IAM Web Console Example of OrganizationAccountAccessRole](/assets/e24ad8c-OrganizationAccountAccessRole.png)

# Usage

## HCL

```hcl
module "organization_access_role" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-organization-access-role.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

After the role has been created in the invited member account, login to the master account and create the following policy:

(change `YYYYYYYYYYYY` to the ID of the invited member account)

### #

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

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
You can use [terraform-aws-organization-access-group](https://github.com/cloudposse/terraform-aws-organization-access-group) module to create an IAM Group and Policy to grant permissions to delegated IAM users in the Organization's master account to access a member account.
{{% /dialog %}}

# References

- <https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html>

# Variables

| Name                | Default                                       | Description                                                                                                                                                              | Required |
|:--------------------|:----------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:---------|
| `master_account_id` |                                               | The ID of the master account to grant permissions to access the current account                                                                                          | Yes      |
| `role_name`         | `OrganizationAccountAccessRole`               | The name of the role to grant permissions to delegated IAM users in the master account to the current account                                                            | No       |
| `policy_arn`        | `arn:aws:iam::aws:policy/AdministratorAccess` | Policy ARN to attach to the role. By default, it attaches `AdministratorAccess` managed policy to grant full access to AWS services and resources in the current account | No       |

# Outputs

| Name        | Description                                        |
|:------------|:---------------------------------------------------|
| `role_name` | The name of the created role                       |
| `role_id`   | The stable and unique string identifying the role  |
| `role_arn`  | The Amazon Resource Name (ARN) specifying the role |
