# Compliance

:::caution

The `compliance` and `compliance-root` components are deprecated as of July 2023. As such, we will be using
[aws-config](/components/library/aws/aws-config/), [guardduty](/components/library/aws/guardduty/), and
[security-hub](/components/library/aws/security-hub/) components.

:::

## Problem

We need to ensure your AWS Organization meets certain benchmarks for compliance (e.g. HIPAA, PCI/DSS, etc). Your AWS
accounts contain thousands of resources, making it impossible to audit without automation. Setting up the automation by
hand is tedious and error-prone.

## Solution

Deploy a set of Cloud Posse components to enable SecurityHub, GuardDuty, AWS Config, and more!

:::caution

It is very important that you read these docs and follow all of the steps carefully and in order. Failure to do so may
result in a condition that needs to be manually cleaned up across tens of regions in each of your accounts.

:::

### Related Components

- [aws-config](/components/library/aws/aws-config/)
- [guardduty](/components/library/aws/guardduty/)
- [security-hub](/components/library/aws/security-hub/)

### Background Info

The AWS Config, Security Hub, and GuardDuty services must be configured in every enabled region in each of your AWS
accounts. Unfortunately, [AWS does not support](https://docs.aws.amazon.com/general/latest/gr/rande-manage.html)
disabling regions which were introduced prior to March 20, 2019. These regions are enabled by default. The table below
lists the regions that cannot be disabled.

:::info

In addition to the regions below, the AWS services listed above must also be deployed to any regions you opted into.

:::

|                |                |           |           |
| -------------- | -------------- | --------- | --------- |
| ap-northeast-1 | ap-southeast-2 | eu-west-2 | us-west-1 |
| ap-northeast-2 | ca-central-1   | eu-west-3 | us-west-2 |
| ap-northeast-3 | eu-central-1   | sa-east-1 |           |
| ap-south-1     | eu-north-1     | us-east-1 |           |
| ap-southeast-1 | eu-west-1      | us-east-2 |           |

The Cloud Posse AWS Config, Guard Duty, and Security Hub components (the "Components") are responsible for deploying
these AWS services in a sane way. At the AWS Organizational level, the Components designate an account to be the primary
account within the AWS Organization responsible for configuring the service. This is referred to as the Delegated
Administrator account. In addition, where possible, the Components designate a single region to be the “central
collection region” so that compliance information can be aggregated into a single region.

In a typical REFARCH setup, the logs are written to the `audit` account, the AWS services (Config, Security Hub, and
GuardDuty) are deployed to the `security` account, and the Organizational management account (`root` account) is used to
delegate `security` as the Delegated Administrator account. The central collection region is usually the same as the
primary region used in your platform accounts for hosting your application workloads.

### Deployment Steps

#### Organization-Level Configuration

The steps in this section should only be completed once for the entire organization.

### Vendor

Vendor all data components with the following workflow:

```bash
atmos workflow vendor -f compliance
```

##### Add Service Principals to the `account` component

Add the following service principals to the `aws_service_access_principals` variable of the `account` in
`stacks/catalog/account.yaml`:

- `config.amazonaws.com`
- `config-multiaccountsetup.amazonaws.com`
- `guardduty.amazonaws.com`
- `securityhub.amazonaws.com`

:::warning

This command requires
[SuperAdmin](https://docs.cloudposse.com/reference-architecture/setup/cold-start/manual-configuration/#use-superadmin-credentials).
Ensure the `plan` output only touches service principals.

:::

```bash
atmos terraform plan account -s core-gbl-root
```

The output of `plan` should look similar to the following:

```
  # aws_organizations_organization.this[0] will be updated in-place
  ~ resource "aws_organizations_organization" "this" {
      ~ aws_service_access_principals = [
          + "config-multiaccountsetup.amazonaws.com",
          + "config.amazonaws.com",
            # (8 unchanged elements hidden)
        ]
        id                            = "[random string]"
        # (9 unchanged attributes hidden)
    }

Plan: 0 to add, 1 to change, 0 to destroy.
```

Apply the changes with:

```bash
atmos terraform apply account -s core-gbl-root
```

##### Deploy `config-bucket`

:::info

There should only be a single bucket that will act as a store for AWS Config data across all regions

:::

The `config-bucket` is required for storing `AWS Config` data and is a pre-requisite for deploying AWS Config. See
[config-bucket](https://github.com/cloudposse/terraform-aws-config-storage)

```bash
atmos terraform plan config-bucket --stack core-use1-audit
atmos terraform apply config-bucket --stack core-use1-audit
```

##### Deploy `cloudtrail-bucket`

:::info

There should only be a single bucket that will act as a store for AWS CloudTrail data across all regions

:::

Deploying the `cloudtrail-bucket` to the Audit account allows the Organization to isolate audit data and permissions
from other environments (production, staging, development) and is a requirement for deploying Security Hub. See
[cloudtrail-bucket](https://github.com/cloudposse/terraform-aws-cloudtrail-s3-bucket)

:::info

This bucket has likely been provisioned by the
[Cold Start](https://docs.cloudposse.com/reference-architecture/setup/cold-start/automated-configuration/). Run the
following `terraform plan` to ensure the bucket exists. If it doesn't, create it with `terraform apply`.

:::

```bash
atmos terraform plan cloudtrail-bucket --stack core-use1-audit
atmos terraform apply cloudtrail-bucket --stack core-use1-audit
```

#### Deploy IAM Role for CIS Benchmark

Part of the benchmark rules for CIS AWS Foundations includes deploying a support role to manage incidents with AWS
Support. See
[CIS Benchmark 1.20](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-1.20)
and [IAM.18](https://docs.aws.amazon.com/securityhub/latest/userguide/iam-controls.html#iam-18).

These roles are managed from the [Identity Workflow](https://docs.cloudposse.com/reference-architecture/setup/identity/)
using `aws-teams` and `aws-team-roles` components.

#### AWS Config

:::info

If a step in one of the following workflows fails you can restart from that failed step by using the following command:

```bash
atmos workflow deploy/aws-config/global-collector -f compliance --from-step step4
```

:::

Deploy AWS Config to each region in order to collect data for global resources such as IAM.

```bash
atmos workflow deploy/aws-config/global-collector -f compliance
```

:::warning

This command requires
[SuperAdmin](https://docs.cloudposse.com/reference-architecture/setup/cold-start/manual-configuration/#use-superadmin-credentials).

:::

Deploy AWS Config into accounts that require superadmin to apply.

```bash
atmos workflow deploy/aws-config/superadmin -f compliance
```

#### Security Hub

First, deploy to each region of the Delegated Administrator account.

```bash
atmos workflow deploy/security-hub/step1 -f compliance
```

Next, using
[SuperAdmin](https://docs.cloudposse.com/reference-architecture/setup/cold-start/manual-configuration/#use-superadmin-credentials),
deploy to the Organization Management (root) account in order to designate the `security` account as the Organization
Delegated Administrator account.

```bash
atmos workflow deploy/security-hub/step2 -f compliance
```

:::info

Don't forget to `assume-role acme-identity`

:::

Finally, deploy the `security-hub/org-settings` component to the `security` account in order to enable and configure
Security Hub in all other accounts and regions.

```bash
atmos workflow deploy/security-hub/step3 -f compliance
```

#### Guard Duty

First, deploy to each region of the Delegated Administrator account.

```bash
atmos workflow deploy/guardduty/step1 -f compliance
```

Next, deploy to the Organization Management (root) account in order to designate the `security` account as the
Organization Delegated Administrator account.

```bash
atmos workflow deploy/guardduty/step2 -f compliance
```

Finally, deploy to the `security` account in order to enable and configure GuardDuty in all other accounts and regions.

```bash
atmos workflow deploy/guardduty/step3 -f compliance
```

#### Route53 DNS Resolver Firewall

```bash
atmos workflow deploy/route53-resolver-dns-firewall-buckets -f compliance
atmos workflow deploy/route53-resolver-dns-firewall -f compliance
```

#### AWS Shield

:::info

An [AWS Shield Advanced subscription](https://docs.aws.amazon.com/waf/latest/developerguide/enable-ddos-prem.html) is
required in each `plat` AWS account before running this workflow.

:::

```bash
atmos workflow deploy/aws-shield -f compliance
```

#### AWS Inspector v2

Delegates Administration account for
[AWS Inspector v2](https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html) to `core-security` for all
regions.

```bash
atmos workflow deploy/aws-inspector2/step1 -f compliance
```

Enables Inspector in all regions across accounts

```bash
atmos workflow deploy/aws-inspector2/step2 -f compliance
```

### FAQ

#### Q: Error: error disabling security hub control

```bash
 Error: error disabling security hub control arn:aws:securityhub:us-west-2:267314709865:control/aws-foundational-security-best-practices/v/1.0.0/EC2.17: InvalidAccessException: Account 267314709865 is not subscribed to AWS Security Hub
│ {
│   RespMetadata: {
│     StatusCode: 401,
│     RequestID: "53bc6538-18ff-4df0-9c14-57afe7b1d1a0"
│   },
│   Code_: "InvalidAccessException",
│   Message_: "Account 267314709865 is not subscribed to AWS Security Hub"
│ }
│
│   with awsutils_security_hub_control_disablement.ec2_multiple_enis[0],
│   on main.tf line 138, in resource "awsutils_security_hub_control_disablement" "ec2_multiple_enis":
│  138: resource "awsutils_security_hub_control_disablement" "ec2_multiple_enis" {
```

A: None of the commands in the final step have been run. Check the commands and run them again.

#### Q: Deploying `compliance` to `security` fails on Step 1

```text
│ Error: error designating security hub administrator account members: BadRequestException:
│   status code: 400, request id: 7279a38b-7bff-48b5-834c-f8e3ab0d4bf7
│
│   with awsutils_security_hub_organization_settings.this[0],
│   on main.tf line 72, in resource "awsutils_security_hub_organization_settings" "this":
│   72: resource "awsutils_security_hub_organization_settings" "this" {
```

or

```text
│ Error: error updating security hub administrator account settings: InvalidAccessException: Account 174772947570 is not an administrator for this organization
│ {
│   RespMetadata: {
│     StatusCode: 401,
│     RequestID: "335a2c87-c5bf-4006-9017-50a4428fcc30"
│   },
│   Code_: "InvalidAccessException",
│   Message_: "Account 174772947570 is not an administrator for this organization"
│ }
```

A: Please re-deploy and set the correct input vars to `false` , then deploy compliance-root, then redeploy with the
correct input vars to `true` and it should work.

#### Q: Deploying `compliance` to `security` fails on Step 3 `designating guardduty administrator account members`

```text
│ Error: error designating guardduty administrator account members: BadRequestException: The request is rejected because the input detectorId is not owned by the current account.
│ {
│   RespMetadata: {
│     StatusCode: 400,
│     RequestID: "e8d39bc9-2f1f-4d95-8283-6193facba4d3"
│   },
│   Message_: "The request is rejected because the input detectorId is not owned by the current account.",
│   Type: "InvalidInputException"
│ }
```

A: This error may not be related to GuardDuty delegation, but rather the `awsutils` provider configuration. For example:

```hcl
provider "awsutils" {
  region = var.region

  profile = module.iam_roles.profiles_enabled ? coalesce(var.import_profile_name, module.iam_roles.terraform_profile_name) : null
  dynamic "assume_role" {
    for_each = module.iam_roles.profiles_enabled ? [] : ["role"]
    content {
      role_arn = coalesce(var.import_role_arn, module.iam_roles.terraform_role_arn)
    }
  }
}
```

#### Q: Deploying `compliance` to `security` fails on Step 3 `designating security hub administrator account members`

```text
│ Error: error designating security hub administrator account members: [{
│   AccountId: "1234567890",
│   ProcessingResult: "Operation failed because your organization master must first enable SecurityHub to be added as a member"
│ }]
```

A: Security Hub must be enabled for the Organization. Typically this is done with the `account` component by adding
`securityhub.amazonaws.com` to `aws_service_access_principals`. Alternately, it can be manually enabled. Open the AWS
console for the `root` account within the given Organization, go to Security Hub for the appropriate region, click
“Enable Security Hub” under “AWS Integrations”

#### Q: `Blank spaces are not acceptable for input parameter: policyARN`

```text
│ Error: Error creating AWSConfig rule: Failed to create AWSConfig rule: InvalidParameterValueException: Blank spaces are not acceptable for input parameter: policyARN.
│
│   with module.aws_config.aws_config_config_rule.rules["iam-policy-in-use"],
│   on .terraform-mdev/modules/aws_config/main.tf line 42, in resource "aws_config_config_rule" "rules":
│   42: resource "aws_config_config_rule" "rules" {│
```

A: The `support` role may not be deployed into the given account. Check `aws-team-roles` for the `support` role.