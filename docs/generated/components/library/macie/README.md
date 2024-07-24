---
title: macie
sidebar_label: macie
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/macie/README.md
tags: [terraform, aws, macie]
---

# Component: `macie`

This component is responsible for configuring Macie within an AWS Organization.

Amazon Macie is a data security service that discovers sensitive data by using machine learning and pattern matching,
provides visibility into data security risks, and enables automated protection against those risks.

To help you manage the security posture of your organization's Amazon Simple Storage Service (Amazon S3) data estate,
Macie provides you with an inventory of your S3 buckets, and automatically evaluates and monitors the buckets for
security and access control. If Macie detects a potential issue with the security or privacy of your data, such as a
bucket that becomes publicly accessible, Macie generates a finding for you to review and remediate as necessary.

Macie also automates discovery and reporting of sensitive data to provide you with a better understanding of the data
that your organization stores in Amazon S3. To detect sensitive data, you can use built-in criteria and techniques that
Macie provides, custom criteria that you define, or a combination of the two. If Macie detects sensitive data in an S3
object, Macie generates a finding to notify you of the sensitive data that Macie found.

In addition to findings, Macie provides statistics and other data that offer insight into the security posture of your
Amazon S3 data, and where sensitive data might reside in your data estate. The statistics and data can guide your
decisions to perform deeper investigations of specific S3 buckets and objects. You can review and analyze findings,
statistics, and other data by using the Amazon Macie console or the Amazon Macie API. You can also leverage Macie
integration with Amazon EventBridge and AWS Security Hub to monitor, process, and remediate findings by using other
services, applications, and systems.

## Usage

**Stack Level**: Regional

## Deployment Overview

This component is complex in that it must be deployed multiple times with different variables set to configure the AWS
Organization successfully.

In the examples below, we assume that the AWS Organization Management account is `root` and the AWS Organization
Delegated Administrator account is `security`, both in the `core` tenant.

### Deploy to Delegated Administrator Account

First, the component is deployed to the
[Delegated Administrator](https://docs.aws.amazon.com/macie/latest/user/accounts-mgmt-ao-integrate.html) account to
configure the central Macie account∑.

```yaml
# core-ue1-security
components:
  terraform:
    macie/delegated-administrator:
      metadata:
        component: macie
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: ue1
        region: us-east-1
```

```bash
atmos terraform apply macie/delegated-administrator -s core-ue1-security
```

### Deploy to Organization Management (root) Account

Next, the component is deployed to the AWS Organization Management, a/k/a `root`, Account in order to set the AWS
Organization Designated Admininstrator account.

Note that you must `SuperAdmin` permissions as we are deploying to the AWS Organization Management account. Since we are
using the `SuperAdmin` user, it will already have access to the state bucket, so we set the `role_arn` of the backend
config to null and set `var.privileged` to `true`.

```yaml
# core-ue1-root
components:
  terraform:
    guardduty/root:
      metadata:
        component: macie
    backend:
      s3:
        role_arn: null
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: ue1
        region: us-east-1
        privileged: true
```

```bash
atmos terraform apply macie/root -s core-ue1-root
```

### Deploy Organization Settings in Delegated Administrator Account

Finally, the component is deployed to the Delegated Administrator Account again in order to create the organization-wide
configuration for the AWS Organization, but with `var.admin_delegated` set to `true` to indicate that the delegation has
already been performed from the Organization Management account.

```yaml
# core-ue1-security
components:
  terraform:
    macie/org-settings:
      metadata:
        component: macie
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: use1
        region: us-east-1
        admin_delegated: true
```

```bash
atmos terraform apply macie/org-settings/ue1 -s core-ue1-security
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [AWS GuardDuty Documentation](https://aws.amazon.com/guardduty/)
- [Cloud Posse's upstream component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/guardduty/common/)



