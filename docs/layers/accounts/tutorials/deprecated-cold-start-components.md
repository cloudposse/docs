---
title: "Deprecated Cold Start Components"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1391886355/Deprecated+Cold+Start+Components
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/setup/cold-start/deprecated-cold-start-components.md
---

# Deprecated Cold Start Components

This page serves as a tombstone for deprecated components included in the cold start. Here you will find documentation
on how you could set those components up.

| **Deprecated Component** | **Replaced By:** | **Notes**                                                            |
| ------------------------ | ---------------- | -------------------------------------------------------------------- |
| `sso`                    | `aws-saml`       | [Implement AWS Cold Start](/reference-architecture/setup/cold-start) |
| `iam-primary-roles`      | `aws-teams`      | [Implement AWS Cold Start](/reference-architecture/setup/cold-start) |
| `iam-delegated-roles`    | `aws-team-roles` | [Implement AWS Cold Start](/reference-architecture/setup/cold-start) |

### Deprecated Steps for Deploying IAM Roles

With the addition of `aws-teams`, `aws-team-roles`, and `aws-saml`, the `iam-primary-roles`, `iam-deprecated-roles`, and
`sso` components are deprecated. Use the respective components as a replacement.

#### Provision `sso` component

:::caution

Deprecated with the addition of `aws-teams`. Use `aws-saml` instead

:::

GSuite integration requires collaboration between a GSuite administrator and a DevOps engineer with `root` account
access. You should have previously installed the IdP metadata files and configured the `sso` component in
`gbl-identity.yaml` .

In the Geodesic shell, execute the following commands:

```
atmos terraform apply sso --stack gbl-identity
```

In the output, make note of the SAML provider ARNs, as you will need them when provisioning user access in GSuite or
Okta.

:::info Security Note

The following guidance provides clarity on the security of the metadata files.

[https://security.stackexchange.com/questions/65743/saml-2-0-idp-metadata-security](https://security.stackexchange.com/questions/65743/saml-2-0-idp-metadata-security)

**TL;DR** they are safe to commit to VCS.

:::

Learn more about the [sso](/components/library/aws/aws-sso/) component.

#### Provision `iam-primary-roles` component

:::caution

Deprecated with the addition of `aws-teams`. Use `aws-teams` instead

:::

This component creates "primary" IAM roles in the `identity` account. "Primary" roles are the ones that users are
allowed to log into via SSO. All other roles, which we term "delegated" roles, must be _assumed_ from a "primary" role,
and will be generated in the next step through the
[iam-delegated-roles](https://github.com/cloudposse/terraform-aws-components/tree/main/deprecated/iam-delegated-roles)
component.

**NOTE:** `sso` project must be completed so the identity providers exist. If identity providers are added or deleted,
[https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=992116823](https://cloudposse.atlassian.net/wiki/pages/resumedraft.action?draftId=992116823)
must also be updated.

Refer to the `full_account_map` you saved from `account-map` and copy the account ID (number) for the `identity` account
to the `gbl-identity.yaml` stack as the value for `components.terraform.iam-primary-roles.vars.primary_account_id`. _Be
sure to enclose the account ID in quotation marks,_ because AWS treats it as an opaque string, but YAML will do
conversions on numbers.

Before roles are created, they cannot be referenced as principals within IAM principals, and so other roles cannot be
given permission to assume them. In general, we do not need roles in delegated accounts to be able to assume other roles
in delegated accounts, so this is not a problem. However, we want to allow this is in `identity`, so we have a flag we
can change before and after the roles are created.

This component requires `root-admin` role to run. Use `assume-role` (or `assume-role-saml` for SAML auth) to assume the
role.

In the Geodesic shell, execute the following commands to provision the IAM roles in `identity`:

```
atmos terraform apply iam-primary-roles --stack gbl-identity -var=assume_role_restricted=false
```

This provisions the primary roles.

Now that they have been created, we can restrict which roles can assume them. In the Geodesic shell, execute the
following to put the restrictions in place:

```
atmos terraform apply iam-primary-roles --stack gbl-identity
```

Learn more about the
[iam-primary-roles](https://github.com/cloudposse/terraform-aws-components/tree/main/deprecated/iam-primary-roles)
component.

#### Provision `iam-delegated-roles` component

:::caution

Deprecated with the addition of `aws-teams`. Use `aws-team-roles` instead

:::

The
[iam-delegated-roles](https://github.com/cloudposse/terraform-aws-components/tree/main/deprecated/iam-delegated-roles)
component creates the delegated IAM roles in the member accounts allowing the `identity` account to assume roles into
the member accounts.

**NOTE:** `sso` must be completed so the identity providers exist. `iam-primary-roles` must be completed to generate the
primary roles in the `identity` account.

In the Geodesic shell, execute the following commands for each account except for `identity` and `root`:

```
atmos terraform apply iam-delegated-roles --stack gbl-${acct}
```

`root` account is a bit special. As we said regarding primary roles in the `identity` account, before roles are created,
other roles cannot be given permission to assume them. We want to allow roles in `root` to assume other roles in `root`
for a few reasons:

- We want people to voluntarily reduce their privileges when they are not using them, so we want admins to be able to
  assume less powerful roles.

- We want people to be able to use Terraform, which we generally configure to assume a role in the `root` account in
  order to access the Terraform state.

Again as with `identity`, we have a flag we can change before and after the roles are created, although it has a
different name, because here the choice is between `restricted` and `no` assume role capability whereas in `identity`
the choice is between `restricted` and `unrestricted` assume role capability.

In the Geodesic shell, execute the following commands to provision the delegated IAM roles in `root`:

```
atmos terraform apply iam-delegated-roles --stack gbl-root -var=same_account_assume_role_enabled=false
```

Then execute the following commands to enable assume role within the `root` account:

```
atmos terraform apply iam-delegated-roles --stack gbl-root
```

Note in the output the ARN of the `...root-terraform` role, you will need it later.

Learn more about the
[iam-delegated-roles](https://github.com/cloudposse/terraform-aws-components/tree/main/deprecated/iam-delegated-roles)
component.

## Deactivate SuperAdmin user

:::info

SuperAdmin is no longer deactivated with the addition of the `aws-teams` components. SuperAdmin is required to
make changes to root components, since the `...root-terraform` role no longer has permission to make changes to the the
`root` account

:::

After all the cold-start components have been provisioned, we have SSO and all IAM roles configured, and users will be
able to login to AWS accounts using GSuite by assuming the IAM roles.

We can deactivate `SuperAdmin` user now.

Login to AWS IAM console using the root credentials, select the `SuperAdmin` user, go to the "Security credentials" tab,
and click "Make inactive" for any keys listed under "Access keys". This will prevent them from being used until you need
them again, and at the same time will enable you to use them without having to reconfigure Leapp. Alternately (and
somewhat more securely), you can delete the keys, and when you need to use them again create new ones and add them to
Leapp as you did with the first keys.
