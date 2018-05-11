---
title: terraform-aws-organization-access-group
description: >-
  Terraform module to create an IAM Group and Policy to grant permissions to
  delegated IAM users in the Organization's master account to access a member
  account
---

# Terraform AWS Organization Access Group

|                  |                                                                                                                                                                                            |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-organization-access-group>                                                                                                                    |
| Terraform Module | terraform-aws-organization-access-group                                                                                                                                                    |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-organization-access-group.svg)](https://github.com/cloudposse/terraform-aws-organization-access-group/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-organization-access-group.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-organization-access-group)    |

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

{{% dialog type="warning" icon="fa fa-exclamation-circle" title="Important" %}}
Member accounts that you invite to join your Organization (that are not part of your Organization) do not automatically get `OrganizationAccountAccessRole` created. You can use [terraform-aws-organization-access-role](https://github.com/cloudposse/terraform-aws-organization-access-role) module to create `OrganizationAccountAccessRole` role in an invited member account.
{{% /dialog %}}

# Usage

## HCL

```hcl
module "organization_access_group" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-organization-access-group.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# References

- <https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_access.html>

# Variables

| Name                | Default                         | Description                                                                               | Required |
|:--------------------|:--------------------------------|:------------------------------------------------------------------------------------------|:---------|
| `namespace`         |                                 | Namespace (_e.g._ `cp` or `cloudposse`)                                                   | Yes      |
| `stage`             |                                 | Stage (_e.g._ `prod`, `dev`, `staging`)                                                   | Yes      |
| `name`              |                                 | Name (_e.g._ `app` or `cluster`)                                                          | Yes      |
| `user_names`        |                                 | A list of IAM User names to associate with the Group                                      | Yes      |
| `member_account_id` |                                 | The ID of the member account to grant access permissions to the users in the Group        | Yes      |
| `role_name`         | `OrganizationAccountAccessRole` | The name of the Role in the member account to grant permissions to the users in the Group | No       |
| `attributes`        | `[]`                            | Additional attributes (_e.g._ `policy` or `role`)                                         | No       |
| `tags`              | `{}`                            | Additional tags (_e.g._ `map("BusinessUnit","XYZ")`                                       | No       |
| `delimiter`         | `-`                             | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`               | No       |

# Outputs

| Name              | Description                           |
|:------------------|:--------------------------------------|
| `group_name`      | The Group's name                      |
| `group_id`        | The Group's ID                        |
| `group_unique_id` | Group's unique ID assigned by AWS     |
| `group_arn`       | The ARN assigned by AWS for the Group |
| `policy_name`     | The name of the policy                |
| `policy_id`       | The policy ID                         |
