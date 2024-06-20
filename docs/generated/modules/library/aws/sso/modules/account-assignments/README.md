---
title: account-assignments
sidebar_label: account-assignments
sidebar_class_name: command
description: account-assignments
custom_edit_url: https://github.com/cloudposse/terraform-aws-sso/blob/main/modules/account-assignments/README.md
---

# AWS SSO Account Assignments Module

This module assigns [AWS SSO permission sets](https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html) to Users and Groups from the [AWS SSO Identity Source](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source.html).

Some english-language examples of this would be:

- users who are in the group `Administrators` should be assigned the permission set `AdmininstratorAccess` in the `production` account.
- users who are in the group `Developers` should be assigned the permission set `DeveloperAccess` in the `production` account
- users who are in the group `Developers` should be assigned the permission set `AdministraorAccess` in the `sandbox` account

## Usage

**IMPORTANT:** The `master` branch is used in `source` just as an example. In your code, do not pin to `master` because there may be breaking changes between releases.
Instead pin to the release tag (e.g. `?ref=tags/x.y.z`) of one of our [latest releases](https://github.com/cloudposse/terraform-aws-sso/releases).

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-sso/tree/main/examples/complete).

```hcl
module "sso_account_assignments" {
  source = "https://github.com/cloudposse/terraform-aws-sso.git//modules/account-assignments?ref=master"

  account_assignments = [
    {
        account = "111111111111",
        permission_set_arn = "arn:aws:sso:::permissionSet/ssoins-0000000000000000/ps-31d20e5987f0ce66",
        permission_set_name = "Administrators",
        principal_type = "GROUP",
        principal_name = "Administrators"
    },
    {
        account = "111111111111",
        permission_set_arn = "arn:aws:sso:::permissionSet/ssoins-0000000000000000/ps-955c264e8f20fea3",
        permission_set_name = "Developers",
        principal_type = "GROUP",
        principal_name = "Developers"
    },
    {
        account = "222222222222",
        permission_set_arn = "arn:aws:sso:::permissionSet/ssoins-0000000000000000/ps-31d20e5987f0ce66",
        permission_set_name = "Developers",
        principal_type = "GROUP",
        principal_name = "Developers"
    },
  ]
}

```

