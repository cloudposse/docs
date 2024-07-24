---
title: account-map
sidebar_label: account-map
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/account-map/README.md
tags: [terraform, aws, account-map]
---

# Component: `account-map`

This component is responsible for provisioning information only: it simply populates Terraform state with data (account
ids, groups, and roles) that other root modules need via outputs.

## Pre-requisites

- [account](https://docs.cloudposse.com/components/library/aws/account) must be provisioned before
  [account-map](https://docs.cloudposse.com/components/library/aws/account-map) component

## Usage

**Stack Level**: Global

Here is an example snippet for how to use this component. Include this snippet in the stack configuration for the
management account (typically `root`) in the management tenant/OU (usually something like `mgmt` or `core`) in the
global region (`gbl`). You can include the content directly, or create a `stacks/catalog/account-map.yaml` file and
import it from there.

```yaml
components:
  terraform:
    account-map:
      vars:
        enabled: true
        # Set profiles_enabled to false unless we are using AWS config profiles for Terraform access.
        # When profiles_enabled is false, role_arn must be provided instead of profile in each terraform component provider.
        # This is automatically handled by the component's `provider.tf` file in conjunction with
        # the `account-map/modules/iam-roles` module.
        profiles_enabled: false
        root_account_aws_name: "aws-root"
        root_account_account_name: root
        identity_account_account_name: identity
        dns_account_account_name: dns
        audit_account_account_name: audit

        # The following variables contain `format()` strings that take the labels from `null-label`
        # as arguments in the standard order. The default values are shown here, assuming
        # the `null-label.label_order` is
        # ["namespace", "tenant", "environment", "stage", "name", "attributes"]
        # Note that you can rearrange the order of the labels in the template by
        # using [explicit argument indexes](https://pkg.go.dev/fmt#hdr-Explicit_argument_indexes) just like in `go`.

        #  `iam_role_arn_template_template` is the template for the template [sic] used to render Role ARNs.
        #  The template is first used to render a template for the account that takes only the role name.
        #  Then that rendered template is used to create the final Role ARN for the account.
        iam_role_arn_template_template: "arn:%s:iam::%s:role/%s-%s-%s-%s-%%s"
        # `profile_template` is the template used to render AWS Profile names.
        profile_template: "%s-%s-%s-%s-%s"
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/account-map) -
  Cloud Posse's upstream component



