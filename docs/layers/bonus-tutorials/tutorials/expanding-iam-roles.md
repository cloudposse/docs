---
title: "Expanding IAM roles"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1296236604/Expanding+IAM+roles
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/expanding-iam-roles.md
---

# Expanding IAM roles

## Problem
Customers would like to expand or customize IAM roles

## Solution

We distinguish between two types of IAM roles: "teams" and "team-roles".

Teams are just like "groups" in IAM and AWS SSO, but because they are deployed
and managed differently (and are implemented as IAM roles), we give them a
distinct name. They are used to define a set of permissions which can then be
assigned to multiple people. Teams only exist in the "identity" account.

- A "team" is a group of people (or one or more services) who have the same
  pattern of permissions. If you want to add a new team, you add it via `aws-teams`.
  The permissions defined in `aws-teams` only apply to the team in the identity account,
  and usually "team_role_access" is all that is needed there.

- "Team roles" are IAM roles which are assumed by people and services to do work. They are
  deployed to every account with the same IAM Policies attached. What differs
  from account to account is the trust policy, which defines who can assume the role.
  Thus, the trust policies across all the accounts are what define the scope of a team.

- SSO "Permission sets" are a special kind of IAM role which are assumed by people
  to do work. Like team roles, they have their permissions defined once and are
  then deployed to every account. SSO "groups" function just like "teams": they
  define a collection of permission sets in each account which the group member can access.

- If you want to give a new team access to an existing team role, you just modify
  the `trusted_teams` list for the role accordingly.
- If you want to create a new role with a new set of permissions, you add it via
  `aws-team-roles` as explained under [SAML](#saml).
- If you want to create a new SSO permission set, you add it via `aws-sso`
  as explained under [AWS SSO](#aws-sso).

### SAML

Each role is granted permissions by attaching a list of IAM policies to the IAM role
via its `role_policy_arns` list. You can configure AWS managed policies by entering the ARNs of the policies
directly into the list, or you can create a custom policy as follows:

1. Give the policy a name, e.g. `eks-admin`. We will use `NAME` as a placeholder for the name in the instructions below.
2. Create a file in the `aws-team-roles` directory with the name `policy-NAME.tf`.
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

4. Create a file named `additional-policy-map_override.tf` in the `aws-team-roles` directory (if it does not already exist).
   This is a [terraform override file](https://developer.hashicorp.com/terraform/language/files/override), meaning its
   contents will be merged with the main terraform file, and any locals defined in it will override locals defined in other files.
   Having your code in this separate override file makes it possible for the component to provide a placeholder local variable
   so that it works without customization, while allowing you to customize the component and still update it without losing your customizations.
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

7. Redeploy the component to all the accounts.

Changing the permissions of a team in the identity account is virtually the same, just done in the `aws-teams` component and configuration.

The configuration of team access is inverted: each team role in each account configures who can access it,
via the `trusted_teams` list. So if you want to give a new team access to an existing team role, or an existing
team access to a new team role, you control that via the role's `trusted_teams` list in each account.


### AWS-SSO

Creating a new AWS SSO permission set is similar to creating a new SAML team role (above), but the configuration is
done in the `aws-sso` component. See the `aws-sso` component's documentation for details.

### Commands

```
atmos terraform deploy aws-sso --stack gbl-root
atmos terraform deploy aws-teams --stack gbl-identity
atmos terraform deploy aws-team-roles --stack gbl-<stage>
```


