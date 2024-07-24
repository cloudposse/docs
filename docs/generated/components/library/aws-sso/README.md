---
title: aws-sso
sidebar_label: aws-sso
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-sso/README.md
tags: [terraform, aws, aws-sso]
---

# Component: `aws-sso`

This component is responsible for creating [AWS SSO Permission Sets][1] and creating AWS SSO Account Assignments, that
is, assigning IdP (Okta) groups and/or users to AWS SSO permission sets in specific AWS Accounts.

This component assumes that AWS SSO has already been enabled via the AWS Console (there isn't terraform or AWS CLI
support for this currently) and that the IdP has been configured to sync users and groups to AWS SSO.

## Usage

### Clickops

1. Go to root admin account
1. Select primary region
1. Go to AWS SSO
1. Enable AWS SSO

#### Delegation no longer recommended

Previously, Cloud Posse recommended delegating SSO to the identity account by following the next 2 steps:

1. Click Settings > Management
1. Delegate Identity as an administrator. This can take up to 30 minutes to take effect.

However, this is no longer recommended. Because the delegated SSO administrator cannot make changes in the `root`
account and this component needs to be able to make changes in the `root` account, any purported security advantage
achieved by delegating SSO to the `identity` account is lost.

Nevertheless, it is also not worth the effort to remove the delegation. If you have already delegated SSO to the
`identity`, continue on, leaving the stack configuration in the `gbl-identity` stack rather than the currently
recommended `gbl-root` stack.

### Google Workspace

:::important

> Your identity source is currently configured as 'External identity provider'. To add new groups or edit their
> memberships, you must do this using your external identity provider.

Groups _cannot_ be created with ClickOps in the AWS console and instead must be created with AWS API.

:::

Google Workspace is now supported by AWS Identity Center, but Group creation is not automatically handled. After
[configuring SAML and SCIM with Google Workspace and IAM Identity Center following the AWS documentation](https://docs.aws.amazon.com/singlesignon/latest/userguide/gs-gwp.html),
add any Group name to `var.groups` to create the Group with Terraform. Once the setup steps as described in the AWS
documentation have been completed and the Groups are created with Terraform, Users should automatically populate each
created Group.

```yaml
components:
  terraform:
    aws-sso:
      vars:
        groups:
          - "Developers"
          - "Dev Ops"
```

### Atmos

**Stack Level**: Global **Deployment**: Must be deployed by root-admin using `atmos` CLI

Add catalog to `gbl-root` root stack.

#### `account_assignments`

The `account_assignments` setting configures access to permission sets for users and groups in accounts, in the
following structure:

```yaml
<account-name>:
  groups:
    <group-name>:
      permission_sets:
        - <permission-set-name>
  users:
    <user-name>:
      permission_sets:
        - <permission-set-name>
```

- The account names (a.k.a. "stages") must already be configured via the `accounts` component.
- The user and group names must already exist in AWS SSO. Usually this is accomplished by configuring them in Okta and
  syncing Okta with AWS SSO.
- The permission sets are defined (by convention) in files names `policy-<permission-set-name>.tf` in the `aws-sso`
  component. The definition includes the name of the permission set. See
  `components/terraform/aws-sso/policy-AdminstratorAccess.tf` for an example.

#### `identity_roles_accessible`

The `identity_roles_accessible` element provides a list of role names corresponding to roles created in the
`iam-primary-roles` component. For each named role, a corresponding permission set will be created which allows the user
to assume that role. The permission set name is generated in Terraform from the role name using this statement:

```
format("Identity%sTeamAccess", replace(title(role), "-", ""))
```

### Defining a new permission set

1. Give the permission set a name, capitalized, in CamelCase, e.g. `AuditManager`. We will use `NAME` as a placeholder
   for the name in the instructions below. In Terraform, convert the name to lowercase snake case, e.g. `audit_manager`.
2. Create a file in the `aws-sso` directory with the name `policy-NAME.tf`.
3. In that file, create a policy as follows:

   ```hcl
   data "aws_iam_policy_document" "TerraformUpdateAccess" {
     # Define the custom policy here
   }

   locals {
     NAME_permission_set = {                         # e.g. audit_manager_permission_set
       name                                = "NAME",  # e.g. AuditManager
       description                         = "<description>",
       relay_state                         = "",
       session_duration                    = "PT1H", # One hour, maximum allowed for chained assumed roles
       tags                                = {},
       inline_policy                       = data.aws_iam_policy_document.NAME.json,
       policy_attachments                  = []  # ARNs of AWS managed IAM policies to attach, e.g. arn:aws:iam::aws:policy/ReadOnlyAccess
       customer_managed_policy_attachments = []  # ARNs of customer managed IAM policies to attach
     }
   }
   ```

4. Create a file named `additional-permission-sets-list_override.tf` in the `aws-sso` directory (if it does not already
   exist). This is a [terraform override file](https://developer.hashicorp.com/terraform/language/files/override),
   meaning its contents will be merged with the main terraform file, and any locals defined in it will override locals
   defined in other files. Having your code in this separate override file makes it possible for the component to
   provide a placeholder local variable so that it works without customization, while allowing you to customize the
   component and still update it without losing your customizations.
5. In that file, redefine the local variable `overridable_additional_permission_sets` as follows:

   ```hcl
   locals {
     overridable_additional_permission_sets = [
       local.NAME_permission_set,
     ]
   }
   ```

   If you have multiple custom policies, add each one to the list.

6. With that done, the new permission set will be created when the changes are applied. You can then use it just like
   the others.
7. If you want the permission set to be able to use Terraform, enable access to the Terraform state read/write (default)
   role in `tfstate-backend`.

#### Example

The example snippet below shows how to use this module with various combinations (plain YAML, YAML Anchors and a
combination of the two):

```yaml
prod-cloud-engineers: &prod-cloud-engineers
  Production Cloud Infrastructure Engineers:
    permission_sets:
      - AdministratorAccess
      - ReadOnlyAccess

components:
  terraform:
    aws-sso:
      vars:
        account_assignments:
          audit:
            groups:
              <<: *prod-cloud-engineers
              Production Cloud Engineers:
                permission_sets:
                  - ReadOnlyAccess
          corp:
            groups: *prod-cloud-engineers
          prod:
            groups:
              Admininstrators:
                permission_sets:
                  - AdministratorAccess
                  - ReadOnlyAccess
              Developers:
                permission_sets:
                  - ReadOnlyAccess
          dev:
            groups:
              Admininstrators:
                permission_sets:
                  - AdministratorAccess
                  - ReadOnlyAccess
              Developers:
                permission_sets:
                  - AdministratorAccess
                  - ReadOnlyAccess
        aws_teams_accessible:
          - "developers"
          - "devops"
          - "managers"
          - "support"
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-sso][39]

[<img src="https://cloudposse.com/logo-300x69.svg" height="32" align="right"/>][40]

[1]: https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html
[2]: #requirement%5C_terraform
[3]: #requirement%5C_aws
[4]: #requirement%5C_external
[5]: #requirement%5C_local
[6]: #requirement%5C_template
[7]: #requirement%5C_utils
[8]: #provider%5C_aws
[9]: #module%5C_account%5C_map
[10]: #module%5C_permission%5C_sets
[11]: #module%5C_role%5C_prefix
[12]: #module%5C_sso%5C_account%5C_assignments
[13]: #module%5C_this
[14]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document
[15]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document
[16]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document
[17]: #input%5C_account%5C_assignments
[18]: #input%5C_additional%5C_tag%5C_map
[19]: #input%5C_attributes
[20]: #input%5C_context
[21]: #input%5C_delimiter
[22]: #input%5C_enabled
[23]: #input%5C_environment
[24]: #input%5C_global%5C_environment%5C_name
[25]: #input%5C_iam%5C_primary%5C_roles%5C_stage%5C_name
[26]: #input%5C_id%5C_length%5C_limit
[27]: #input%5C_identity%5C_roles%5C_accessible
[28]: #input%5C_label%5C_key%5C_case
[29]: #input%5C_label%5C_order
[30]: #input%5C_label%5C_value%5C_case
[31]: #input%5C_name
[32]: #input%5C_namespace
[33]: #input%5C_privileged
[34]: #input%5C_regex%5C_replace%5C_chars
[35]: #input%5C_region
[36]: #input%5C_root%5C_account%5C_stage%5C_name
[37]: #input%5C_stage
[38]: #input%5C_tags
[39]: https://github.com/cloudposse/terraform-aws-sso
[40]: https://cpco.io/component


## CHANGELOG

### Change log for aws-sso component

**_NOTE_**: This file is manually generated and is a work-in-progress.

##### PR 830

- Fix `providers.tf` to properly assign roles for `root` account when deploying to `identity` account.
- Restore the `sts:SetSourceIdentity` permission for Identity-role-TeamAccess permission sets added in PR 738 and
  inadvertently removed in PR 740.
- Update comments and documentation to reflect Cloud Posse's current recommendation that SSO **_not_** be delegated to
  the `identity` account.

##### Version 1.240.1, PR 740

This PR restores compatibility with `account-map` prior to version 1.227.0 and fixes bugs that made versions 1.227.0 up
to this release unusable.

Access control configuration (`aws-teams`, `iam-primary-roles`, `aws-sso`, etc.) has undergone several transformations
over the evolution of Cloud Posse's reference architecture. This update resolves a number of compatibility issues with
some of them.

If the roles you are using to deploy this component are allowed to assume the `tfstate-backend` access roles (typically
`...-gbl-root-tfstate`, possibly `...-gbl-root-tfstate-ro` or `...-gbl-root-terraform`), then you can use the defaults.
This configuration was introduced in `terraform-aws-components` v1.227.0 and is the default for all new deployments.

If the roles you are using to deploy this component are not allowed to assume the `tfstate-backend` access roles, then
you will need to configure this component to include the following:

```yaml
components:
  terraform:
    aws-sso:
      backend:
        s3:
          role_arn: null
      vars:
        privileged: true
```

If you are deploying this component to the `identity` account, then this restriction will require you to deploy it via
the SuperAdmin user. If you are deploying this component to the `root` account, then any user or role in the `root`
account with the `AdministratorAccess` policy attached will be able to deploy this component.

#### v1.227.0

This component was broken by changes made in v1.227.0. Either use a version before v1.227.0 or use the version released
by PR 740 or later.

