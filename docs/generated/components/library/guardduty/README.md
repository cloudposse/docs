---
title: guardduty
sidebar_label: guardduty
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/guardduty/README.md
tags: [terraform, aws, guardduty]
---

# Component: `guardduty`

This component is responsible for configuring GuardDuty within an AWS Organization.

AWS GuardDuty is a managed threat detection service. It is designed to help protect AWS accounts and workloads by
continuously monitoring for malicious activities and unauthorized behaviors. To detect potential security threats,
GuardDuty analyzes various data sources within your AWS environment, such as AWS CloudTrail logs, VPC Flow Logs, and DNS
logs.

Key features and components of AWS GuardDuty include:

- Threat detection: GuardDuty employs machine learning algorithms, anomaly detection, and integrated threat intelligence
  to identify suspicious activities, unauthorized access attempts, and potential security threats. It analyzes event
  logs and network traffic data to detect patterns, anomalies, and known attack techniques.

- Threat intelligence: GuardDuty leverages threat intelligence feeds from AWS, trusted partners, and the global
  community to enhance its detection capabilities. It uses this intelligence to identify known malicious IP addresses,
  domains, and other indicators of compromise.

- Real-time alerts: When GuardDuty identifies a potential security issue, it generates real-time alerts that can be
  delivered through AWS CloudWatch Events. These alerts can be integrated with other AWS services like Amazon SNS or AWS
  Lambda for immediate action or custom response workflows.

- Multi-account support: GuardDuty can be enabled across multiple AWS accounts, allowing centralized management and
  monitoring of security across an entire organization's AWS infrastructure. This helps to maintain consistent security
  policies and practices.

- Automated remediation: GuardDuty integrates with other AWS services, such as AWS Macie, AWS Security Hub, and AWS
  Systems Manager, to facilitate automated threat response and remediation actions. This helps to minimize the impact of
  security incidents and reduces the need for manual intervention.

- Security findings and reports: GuardDuty provides detailed security findings and reports that include information
  about detected threats, affected AWS resources, and recommended remediation actions. These findings can be accessed
  through the AWS Management Console or retrieved via APIs for further analysis and reporting.

GuardDuty offers a scalable and flexible approach to threat detection within AWS environments, providing organizations
with an additional layer of security to proactively identify and respond to potential security risks.

## Usage

**Stack Level**: Regional

## Deployment Overview

This component is complex in that it must be deployed multiple times with different variables set to configure the AWS
Organization successfully.

It is further complicated by the fact that you must deploy each of the the component instances described below to every
region that existed before March 2019 and to any regions that have been opted-in as described in the
[AWS Documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions).

In the examples below, we assume that the AWS Organization Management account is `root` and the AWS Organization
Delegated Administrator account is `security`, both in the `core` tenant.

### Deploy to Delegated Admininstrator Account

First, the component is deployed to the
[Delegated Admininstrator](https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_organizations.html) account in each
region in order to configure the central GuardDuty detector that each account will send its findings to.

```yaml
# core-ue1-security
components:
  terraform:
    guardduty/delegated-administrator/ue1:
      metadata:
        component: guardduty
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: ue1
        region: us-east-1
```

```bash
atmos terraform apply guardduty/delegated-administrator/ue1 -s core-ue1-security
atmos terraform apply guardduty/delegated-administrator/ue2 -s core-ue2-security
atmos terraform apply guardduty/delegated-administrator/uw1 -s core-uw1-security
# ... other regions
```

### Deploy to Organization Management (root) Account

Next, the component is deployed to the AWS Organization Management, a/k/a `root`, Account in order to set the AWS
Organization Designated Admininstrator account.

Note that you must use the `SuperAdmin` permissions as we are deploying to the AWS Organization Managment account. Since
we are using the `SuperAdmin` user, it will already have access to the state bucket, so we set the `role_arn` of the
backend config to null and set `var.privileged` to `true`.

```yaml
# core-ue1-root
components:
  terraform:
    guardduty/root/ue1:
      metadata:
        component: guardduty
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
atmos terraform apply guardduty/root/ue1 -s core-ue1-root
atmos terraform apply guardduty/root/ue2 -s core-ue2-root
atmos terraform apply guardduty/root/uw1 -s core-uw1-root
# ... other regions
```

### Deploy Organization Settings in Delegated Administrator Account

Finally, the component is deployed to the Delegated Administrator Account again in order to create the organization-wide
configuration for the AWS Organization, but with `var.admin_delegated` set to `true` to indicate that the delegation has
already been performed from the Organization Management account.

```yaml
# core-ue1-security
components:
  terraform:
    guardduty/org-settings/ue1:
      metadata:
        component: guardduty
      vars:
        enabled: true
        delegated_administrator_account_name: core-security
        environment: use1
        region: us-east-1
        admin_delegated: true
```

```bash
atmos terraform apply guardduty/org-settings/ue1 -s core-ue1-security
atmos terraform apply guardduty/org-settings/ue2 -s core-ue2-security
atmos terraform apply guardduty/org-settings/uw1 -s core-uw1-security
# ... other regions
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [AWS GuardDuty Documentation](https://aws.amazon.com/guardduty/)
- [Cloud Posse's upstream component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/guardduty/common/)



