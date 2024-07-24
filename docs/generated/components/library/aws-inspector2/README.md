---
title: aws-inspector2
sidebar_label: aws-inspector2
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-inspector2/README.md
tags: [terraform, aws, aws-inspector2]
---

# Component: `aws-inspector2`

This component is responsible for configuring Inspector V2 within an AWS Organization.

## Usage

**Stack Level**: Regional

## Deployment Overview

The deployment of this component requires multiple runs with different variable settings to properly configure the AWS
Organization. First, you delegate Inspector V2 central management to the Administrator account (usually `security`
account). After the Adminstrator account is delegated, we configure the it to manage Inspector V2 across all the
Organization accounts and send all their findings to that account.

In the examples below, we assume that the AWS Organization Management account is `root` and the AWS Organization
Delegated Administrator account is `security`.

### Deploy to Organization Management Account

First, the component is deployed to the AWS Organization Management account `root` in each region in order to configure
the [AWS Delegated Administrator account](https://docs.aws.amazon.com/inspector/latest/user/designating-admin.html) that
operates Amazon Inspector V2.

```yaml
# ue1-root
components:
  terraform:
    aws-inspector2/delegate-orgadmin/ue1:
      metadata:
        component: aws-inspector2
      vars:
        enabled: true
        region: us-east-1
```

### Deploy Organization Settings in Delegated Administrator Account

Now the component can be deployed to the Delegated Administrator Account `security` to create the organization-wide
configuration for all the Organization accounts. Note that `var.admin_delegated` set to `true` indicates that the
delegation has already been performed from the Organization Management account, and only the resources required for
organization-wide configuration will be created.

```yaml
# ue1-security
components:
  terraform:
    aws-inspector2/orgadmin-configuration/ue1:
      metadata:
        component: aws-inspector2
      vars:
        enabled: true
        region: us-east-1
        admin_delegated: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [Amazon Inspector V2 Documentation](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html)
- [Cloud Posse's upstream component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/guardduty/common/)



