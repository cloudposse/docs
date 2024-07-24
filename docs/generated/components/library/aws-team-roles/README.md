---
title: aws-team-roles
sidebar_label: aws-team-roles
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-team-roles/README.md
tags: [terraform, aws, aws-team-roles]
---

# Component: `aws-team-roles`

This component is responsible for provisioning user and system IAM roles outside the `identity` account. It sets them up
to be assumed from the "team" roles defined in the `identity` account by [the `aws-teams` component](../aws-teams)
and/or the AWS SSO permission sets defined in [the `aws-sso` component](../aws-sso), and/or be directly accessible via
SAML logins.

### Privileges are Granted to Users via IAM Policies

Each role is granted permissions by attaching a list of IAM policies to the IAM role via its `role_policy_arns` list.
You can configure AWS managed policies by entering the ARNs of the policies directly into the list, or you can create a
custom policy as follows:

1. Give the policy a name, e.g. `eks-admin`. We will use `NAME` as a placeholder for the name in the instructions below.
2. Create a file in the `aws-teams` directory with the name `policy-NAME.tf`.
3. In that file, create a policy as follows:

   ```hcl
   data "aws_iam_policy_document" "NAME" {
     # Define the policy here
   }

   resource "aws_iam_policy" "NAME" {
     name   = format("%s-NAME", module.this.id)
     policy = data.aws_iam_policy_document.NAME.json

     tags = module.this.tags
   }
   ```

4. Create a file named `additional-policy-map_override.tf` in the `aws-team-roles` directory (if it does not already
   exist). This is a [terraform override file](https://developer.hashicorp.com/terraform/language/files/override),
   meaning its contents will be merged with the main terraform file, and any locals defined in it will override locals
   defined in other files. Having your code in this separate override file makes it possible for the component to
   provide a placeholder local variable so that it works without customization, while allowing you to customize the
   component and still update it without losing your customizations.
5. In that file, redefine the local variable `overridable_additional_custom_policy_map` map as follows:

   ```hcl
   locals {
     overridable_additional_custom_policy_map = {
       NAME = aws_iam_policy.NAME.arn
     }
   }
   ```

   If you have multiple custom policies, add each one to the map in the form `NAME = aws_iam_policy.NAME.arn`.

6. With that done, you can now attach that policy by adding the name to the `role_policy_arns` list. For example:

   ```yaml
   role_policy_arns:
     - "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess"
     - "NAME"
   ```

## Usage

**Stack Level**: Global

**Deployment**: Must be deployed by _SuperAdmin_ using `atmos` CLI

Here's an example snippet for how to use this component. This specific usage is an example only, and not intended for
production use. You set the defaults in one YAML file, and import that file into each account's Global stack (except for
the `identity` account itself). If desired, you can make account-specific changes by overriding settings, for example

- Disable entire roles in the account by setting `enabled: false`
- Limit who can access the role by setting a different value for `trusted_teams`
- Change the permissions available to that role by overriding the `role_policy_arns` (not recommended, limit access to
  the role or create a different role with the desired set of permissions instead).

Note that when overriding, **maps are deep merged, but lists are replaced**. This means, for example, that your setting
of `trusted_primary_roles` in an override completely replaces the default, it does not add to it, so if you want to
allow an extra "primary" role to have access to the role, you have to include all the default "primary" roles in the
list, too, or they will lose access.

```yaml
components:
  terraform:
    aws-team-roles:
      backend:
        s3:
          # Override the default Role for accessing the backend, because SuperAdmin is not allowed to assume that role
          role_arn: null
      vars:
        enabled: true
        roles:
          # `template` serves as the default configuration for other roles via the YAML anchor.
          # However, `atmos` does not support "import" of YAML anchors, so if you define a new role
          # in another file, you will not be able to reference this anchor.
          template: &user-template # If `enabled: false`, the role will not be created in this account
            enabled: false

            # `max_session_duration` set the maximum session duration (in seconds) for the IAM roles.
            # This setting can have a value from 3600 (1 hour) to 43200 (12 hours).
            # For roles people log into via SAML, a long duration is convenient to prevent them
            # from having to frequently re-authenticate.
            # For roles assumed from some other role, the setting is practically irrelevant, because
            # the AssumeRole API limits the duration to 1 hour in any case.
            # References:
            # - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html
            # - https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
            max_session_duration: 3600 # 1 hour in seconds

            # role_policy_arns are the IAM Policy ARNs to attach to this policy. In addition to real ARNs,
            # you can use keys in the `custom_policy_map` in `main.tf` to select policies defined in the component.
            # If you are using keys from the map, plans look better if you put them after the real role ARNs.
            role_policy_arns: []
            role_description: "Template role, should not exist"

            # If `aws_saml_login_enabled: true` then the role will be available via SAML logins,
            # but only via the SAML IDPs configured for this account.
            # Otherwise, it will only be accessible via `assume role`.
            aws_saml_login_enabled: false

            ## The following attributes control access to this role via `assume role`.
            ## `trusted_*` grants access, `denied_*` denies access.
            ## If a role is both trusted and denied, it will not be able to access this role.

            # Permission sets specify users operating from the given AWS SSO permission set in this account.
            trusted_permission_sets: []
            denied_permission_sets: []

            # Primary roles specify the short role names of roles in the primary (identity)
            # account that are allowed to assume this role.
            # BE CAREFUL: This is setting the default access for other roles.
            trusted_teams: []
            denied_teams: []

            # Role ARNs specify Role ARNs in any account that are allowed to assume this role.
            # BE CAREFUL: there is nothing limiting these Role ARNs to roles within our organization.
            trusted_role_arns: []
            denied_role_arns: []

          ##
          ## admin and terraform are the core team roles
          ##

          admin:
            <<: *user-template
            enabled: true
            role_policy_arns:
              - "arn:aws:iam::aws:policy/AdministratorAccess"
            role_description: "Full administration of this account"
            trusted_teams: ["admin"]

          terraform:
            <<: *user-template
            enabled: true
            # We require Terraform to be allowed to create and modify IAM roles
            # and policies (e.g. for EKS service accounts), so there is no use trying to restrict it.
            # For better security, we could segregate components that needed
            # administrative permissions and use a more restrictive role
            # for Terraform, such as PowerUser (further restricted to deny AWS SSO changes).
            role_policy_arns:
              - "arn:aws:iam::aws:policy/AdministratorAccess"
            role_description: "Role for Terraform administration of this account"
            trusted_teams: ["admin", "spacelift"]
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components) - Cloud Posse's upstream
  components


