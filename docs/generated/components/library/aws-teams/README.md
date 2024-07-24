---
title: aws-teams
sidebar_label: aws-teams
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-teams/README.md
tags: [terraform, aws, aws-teams]
---

# Component: `aws-teams`

This component is responsible for provisioning all primary user and system roles into the centralized identity account.
This is expected to be used alongside [the `aws-team-roles` component](../aws-team-roles) to provide fine-grained role
delegation across the account hierarchy.

### Teams Function Like Groups and are Implemented as Roles

The "teams" created in the `identity` account by this module can be thought of as access control "groups": a user who is
allowed access one of these teams gets access to a set of roles (and corresponding permissions) across a set of
accounts. Generally, there is nothing else provisioned in the `identity` account, so the teams have limited access to
resources in the `identity` account by design.

Teams are implemented as IAM Roles in each account. Access to the "teams" in the `identity` account is controlled by the
`aws-saml` and `aws-sso` components. Access to the roles in all the other accounts is controlled by the "assume role"
policies of those roles, which allow the "team" or AWS SSO Permission set to assume the role (or not).

### Privileges are Defined for Each Role in Each Account by `aws-team-roles`

Every account besides the `identity` account has a set of IAM roles created by the `aws-team-roles` component. In that
component, the account's roles are assigned privileges, and those privileges ultimately determine what a user can do in
that account.

Access to the roles can be granted in a number of ways. One way is by listing "teams" created by this component as
"trusted" (`trusted_teams`), meaning that users who have access to the team role in the `identity` account are allowed
(trusted) to assume the role configured in the target account. Another is by listing an AWS SSO Permission Set in the
account (`trusted_permission_sets`).

### Role Access is Enabled by SAML and/or AWS SSO configuration

Users can again access to a role in the `identity` account through either (or both) of 2 mechanisms:

#### SAML Access

- SAML access is globally configured via the `aws-saml` component, enabling an external SAML Identity Provider (IdP) to
  control access to roles in the `identity` account. (SAML access can be separately configured for other accounts, see
  the `aws-saml` and `aws-team-roles` components for more on that.)
- Individual roles are enabled for SAML access by setting `aws_saml_login_enabled: true` in the role configuration.
- Individual users are granted access to these roles by configuration in the SAML IdP.

#### AWS SSO Access

The `aws-sso` component can create AWS Permission Sets that allow users to assume specific roles in the `identity`
account. See the `aws-sso` component for details.

## Usage

**Stack Level**: Global **Deployment**: Must be deployed by SuperAdmin using `atmos` CLI

Here's an example snippet for how to use this component. The component should only be applied once, which is typically
done via the identity stack (e.g. `gbl-identity.yaml`).

```yaml
components:
  terraform:
    aws-teams:
      backend:
        s3:
          role_arn: null
      vars:
        teams_config:
          # Viewer has the same permissions as Observer but only in this account. It is not allowed access to other accounts.
          # Viewer also serves as the default configuration for all roles via the YAML anchor.
          viewer: &user-template
            # `max_session_duration` set the maximum session duration (in seconds) for the IAM roles.
            # This setting can have a value from 3600 (1 hour) to 43200 (12 hours).
            # For roles people log into via SAML, a long duration is convenient to prevent them
            # from having to frequently re-authenticate.
            # For roles assumed from some other role, the setting is practically irrelevant, because
            # the AssumeRole API limits the duration to 1 hour in any case.
            # References:
            # - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html
            # - https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
            max_session_duration: 43200 # 12 hours in seconds

            # role_policy_arns are the IAM Policy ARNs to attach to this policy. In addition to real ARNs,
            # you can use keys in the `custom_policy_map` in `main.tf` to select policies defined in the component.
            # If you are using keys from the map, plans look better if you put them after the real role ARNs.
            role_policy_arns:
              - "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"
            role_description: "Team restricted to viewing resources in the identity account"
            # If `aws_saml_login_enabled: true` then the role will be available via SAML logins.
            # Otherwise, it will only be accessible via `assume role`.
            aws_saml_login_enabled: false

            # The following attributes control access to this role via `assume role`.
            # `trusted_*` grants access, `denied_*` denies access.
            # If a role is both trusted and denied, it will not be able to access this role.

            # Permission sets specify users operating from the given AWS SSO permission set in this account.
            trusted_permission_sets: []
            denied_permission_sets: []

            # Primary roles specify the short role names of roles in the primary (identity)
            # account that are allowed to assume this role.
            trusted_teams: []
            denied_teams: ["viewer"]

            # Role ARNs specify Role ARNs in any account that are allowed to assume this role.
            # BE CAREFUL: there is nothing limiting these Role ARNs to roles within our organization.
            trusted_role_arns: []
            denied_role_arns: []

          admin:
            <<: *user-template
            role_description:
              "Team with PowerUserAccess permissions in `identity` and AdministratorAccess to all other accounts except
              `root`"
            # Limit `admin` to Power User to prevent accidentally destroying the admin role itself
            # Use SuperAdmin to administer IAM access
            role_policy_arns: ["arn:aws:iam::aws:policy/PowerUserAccess"]

            # TODO Create a "security" team with AdministratorAccess to audit and security, remove "admin" write access to those accounts
            aws_saml_login_enabled: true
            # list of roles in primary that can assume into this role in delegated accounts
            # primary admin can assume delegated admin
            trusted_teams: ["admin"]
            # GH runner should be moved to its own `ghrunner` role
            trusted_permission_sets: ["IdentityAdminTeamAccess"]

          spacelift:
            <<: *user-template
            role_description: Team for our privileged Spacelift server
            role_policy_arns:
              - team_role_access
            aws_saml_login_enabled: false
            trusted_teams:
              - admin
            trusted_role_arns: ["arn:aws:iam::123456789012:role/eg-ue2-auto-spacelift-worker-pool-admin"]
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## Known Problems

### Error: `assume role policy: LimitExceeded: Cannot exceed quota for ACLSizePerRole: 2048`

The `aws-teams` architecture, when enabling access to a role via lots of AWS SSO Profiles, can create large "assume
role" policies, large enough to exceed the default quota of 2048 characters. If you run into this limitation, you will
get an error like this:

```
Error: error updating IAM Role (acme-gbl-root-tfstate-backend-analytics-ro) assume role policy: LimitExceeded: Cannot exceed quota for ACLSizePerRole: 2048
```

This can happen in either/both the `identity` and `root` accounts (for Terraform state access). So far, we have always
been able to resolve this by requesting a quota increase, which is automatically granted a few minutes after making the
request. To request the quota increase:

- Log in to the AWS Web console as admin in the affected account

- Set your region to N. Virginia `us-east-1`

- Navigate to the Service Quotas page via the account dropdown menu

- Click on AWS Services in the left sidebar

- Search for "IAM" and select "AWS Identity and Access Management (IAM)". (If you don't find that option, make sure you
  have selected the `us-east-1` region.

- Find and select "Role trust policy length"

- Request an increase to 4096 characters

- Wait for the request to be approved, usually less than a few minutes

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components)- Cloud Posse's upstream
  component


