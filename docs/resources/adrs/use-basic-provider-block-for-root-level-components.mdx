---
title: "Use Basic Provider Block for Root-level Components"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1182433314/Use+Basic+Provider+Block+for+Root-level+Components
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/use-basic-provider-block-for-root-level-components.md
---

# Use Basic Provider Block for Root-level Components
**Date**: **19 Oct 2021**

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

:::

## Status

**ACCEPTED**

## Context

We [Use Terraform Provider Block with compatibility for Role ARNs and Profiles](/reference-architecture/reference/adrs/use-terraform-provider-block-with-compatibility-for-role-arns-an) in all components other than the root-level components. By _root-level_ we are referring to components that are provisioned in the top-level AWS account that we generally refer to as the `root` account.

The problem arises when working with the `root` account during a cold-start when there’s no SSO, Federated IAM or IAM roles provisioned, so if we used the `role_arn` or `profile` it would not work. That’s why we assume the administrator will use their current AWS session to provision these components, which is why we do not define the `role_arn` or `profile` in `provider { ... }` block for the components like [sso](/components/library/aws/aws-sso/) or [account](/components/library/aws/account/) .

## Decision

**DECIDED**: Use the following basic provider block in root components.

```
provider "aws" {
  region = var.region
}
```

## Consequences

- Update any root-level components to use this block

## References

- [Use Terraform Provider Block with compatibility for Role ARNs and Profiles](/reference-architecture/reference/adrs/use-terraform-provider-block-with-compatibility-for-role-arns-an)


