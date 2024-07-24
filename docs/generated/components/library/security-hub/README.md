---
title: security-hub
sidebar_label: security-hub
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/security-hub/README.md
tags: [terraform, aws, security-hub]
---

# Component: `security-hub`

This component is responsible for configuring Security Hub within an AWS Organization.

Amazon Security Hub enables users to centrally manage and monitor the security and compliance of their AWS accounts and
resources. It aggregates, organizes, and prioritizes security findings from various AWS services, third-party tools, and
integrated partner solutions.

Here are the key features and capabilities of Amazon Security Hub:

- Centralized security management: Security Hub provides a centralized dashboard where users can view and manage
  security findings from multiple AWS accounts and regions. This allows for a unified view of the security posture
  across the entire AWS environment.

- Automated security checks: Security Hub automatically performs continuous security checks on AWS resources,
  configurations, and security best practices. It leverages industry standards and compliance frameworks, such as AWS
  CIS Foundations Benchmark, to identify potential security issues.

- Integrated partner solutions: Security Hub integrates with a wide range of AWS native services, as well as third-party
  security products and solutions. This integration enables the ingestion and analysis of security findings from diverse
  sources, offering a comprehensive security view.

- Security standards and compliance: Security Hub provides compliance checks against industry standards and regulatory
  frameworks, such as PCI DSS, HIPAA, and GDPR. It identifies non-compliant resources and provides guidance on
  remediation actions to ensure adherence to security best practices.

- Prioritized security findings: Security Hub analyzes and prioritizes security findings based on severity, enabling
  users to focus on the most critical issues. It assigns severity levels and generates a consolidated view of security
  alerts, allowing for efficient threat response and remediation.

- Custom insights and event aggregation: Security Hub supports custom insights, allowing users to create their own rules
  and filters to focus on specific security criteria or requirements. It also provides event aggregation and correlation
  capabilities to identify related security findings and potential attack patterns.

- Integration with other AWS services: Security Hub seamlessly integrates with other AWS services, such as AWS
  CloudTrail, Amazon GuardDuty, AWS Config, and AWS IAM Access Analyzer. This integration allows for enhanced
  visibility, automated remediation, and streamlined security operations.

- Alert notifications and automation: Security Hub supports alert notifications through Amazon SNS, enabling users to
  receive real-time notifications of security findings. It also facilitates automation and response through integration
  with AWS Lambda, allowing for automated remediation actions.

By utilizing Amazon Security Hub, organizations can improve their security posture, gain insights into security risks,
and effectively manage security compliance across their AWS accounts and resources.

## Usage

**Stack Level**: Regional

## Deployment Overview

This component is complex in that it must be deployed multiple times with different variables set to configure the AWS
Organization successfully.

It is further complicated by the fact that you must deploy each of the component instances described below to every
region that existed before March 2019 and to any regions that have been opted-in as described in the
[AWS Documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions).

In the examples below, we assume that the AWS Organization Management account is `root` and the AWS Organization
Delegated Administrator account is `security`, both in the `core` tenant.

### Deploy to Delegated Administrator Account

First, the component is deployed to the
[Delegated Administrator](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_organizations.html) account in each
region to configure the Security Hub instance to which each account will send its findings.

```yaml
# core-ue1-security
components:
  terraform:
    security-hub/delegated-administrator/ue1:
      metadata:
        component: security-hub
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: ue1
        region: us-east-1
```

```bash
atmos terraform apply security-hub/delegated-administrator/ue1 -s core-ue1-security
atmos terraform apply security-hub/delegated-administrator/ue2 -s core-ue2-security
atmos terraform apply security-hub/delegated-administrator/uw1 -s core-uw1-security
# ... other regions
```

### Deploy to Organization Management (root) Account

Next, the component is deployed to the AWS Organization Management (a/k/a `root`) Account in order to set the AWS
Organization Designated Administrator account.

Note that `SuperAdmin` permissions must be used as we are deploying to the AWS Organization Management account. Since we
are using the `SuperAdmin` user, it will already have access to the state bucket, so we set the `role_arn` of the
backend config to null and set `var.privileged` to `true`.

```yaml
# core-ue1-root
components:
  terraform:
    security-hub/root/ue1:
      metadata:
        component: security-hub
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
atmos terraform apply security-hub/root/ue1 -s core-ue1-root
atmos terraform apply security-hub/root/ue2 -s core-ue2-root
atmos terraform apply security-hub/root/uw1 -s core-uw1-root
# ... other regions
```

### Deploy Organization Settings in Delegated Administrator Account

Finally, the component is deployed to the Delegated Administrator Account again in order to create the organization-wide
Security Hub configuration for the AWS Organization, but with `var.admin_delegated` set to `true` this time to indicate
that the delegation from the Organization Management account has already been performed.

```yaml
# core-ue1-security
components:
  terraform:
    security-hub/org-settings/ue1:
      metadata:
        component: security-hub
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: use1
        region: us-east-1
        admin_delegated: true
```

```bash
atmos terraform apply security-hub/org-settings/ue1 -s core-ue1-security
atmos terraform apply security-hub/org-settings/ue2 -s core-ue2-security
atmos terraform apply security-hub/org-settings/uw1 -s core-uw1-security
# ... other regions
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [AWS Security Hub Documentation](https://aws.amazon.com/security-hub/)
- [Cloud Posse's upstream component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/security-hub)



