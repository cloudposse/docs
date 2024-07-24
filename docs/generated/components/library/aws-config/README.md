---
title: aws-config
sidebar_label: aws-config
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aws-config/README.md
tags: [terraform, aws, aws-config]
---

# Component: `aws-config`

This component is responsible for configuring AWS Config.

AWS Config service enables you to track changes to your AWS resources over time. It continuously monitors and records
configuration changes to your AWS resources and provides you with a detailed view of the relationships between those
resources. With AWS Config, you can assess, audit, and evaluate the configurations of your AWS resources for compliance,
security, and governance purposes.

Some of the key features of AWS Config include:

- Configuration history: AWS Config maintains a detailed history of changes to your AWS resources, allowing you to see
  when changes were made, who made them, and what the changes were.
- Configuration snapshots: AWS Config can take periodic snapshots of your AWS resources configurations, giving you a
  point-in-time view of their configuration.
- Compliance monitoring: AWS Config provides a range of pre-built rules and checks to monitor your resources for
  compliance with best practices and industry standards.
- Relationship mapping: AWS Config can map the relationships between your AWS resources, enabling you to see how changes
  to one resource can impact others.
- Notifications and alerts: AWS Config can send notifications and alerts when changes are made to your AWS resources
  that could impact their compliance or security posture.

:::caution AWS Config Limitations

You'll also want to be aware of some limitations with AWS Config:

- The maximum number of AWS Config rules that can be evaluated in a single account is 1000.
  - This can be mitigated by removing rules that are duplicated across packs. You'll have to manually search for these
    duplicates.
  - You can also look for rules that do not apply to any resources and remove those. You'll have to manually click
    through rules in the AWS Config interface to see which rules are not being evaluated.
  - If you end up still needing more than 1000 rules, one recommendation is to only run packs on a schedule with a
    lambda that removes the pack after results are collected. If you had different schedule for each day of the week,
    that would mean 7000 rules over the week. The aggregators would not be able to handle this, so you would need to
    make sure to store them somewhere else (i.e. S3) so the findings are not lost.
  - See the
    [Audit Manager docs](https://aws.amazon.com/blogs/mt/integrate-across-the-three-lines-model-part-2-transform-aws-config-conformance-packs-into-aws-audit-manager-assessments/)
    if you think you would like to convert conformance packs to custom Audit Manager assessments.
- The maximum number of AWS Config conformance packs that can be created in a single account is 50.

:::

Overall, AWS Config provides you with a powerful toolset to help you monitor and manage the configurations of your AWS
resources, ensuring that they remain compliant, secure, and properly configured over time.

## Prerequisites

As part of
[CIS AWS Foundations 1.20](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-1.20),
this component assumes that a designated support IAM role with the following permissions has been deployed to every
account in the organization:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSupport",
      "Effect": "Allow",
      "Action": ["support:*"],
      "Resource": "*"
    },
    {
      "Sid": "AllowTrustedAdvisor",
      "Effect": "Allow",
      "Action": "trustedadvisor:Describe*",
      "Resource": "*"
    }
  ]
}
```

Before deploying this AWS Config component `config-bucket` and `cloudtrail-bucket` should be deployed first.

## Usage

**Stack Level**: Regional or Global

This component has a `default_scope` variable for configuring if it will be an organization-wide or account-level
component by default. Note that this can be overridden by the `scope` variable in the `conformance_packs` items.

:::info Using the account default_scope

If default_scope == `account`, AWS Config is regional AWS service, so this component needs to be deployed to all
regions. If an individual `conformance_packs` item has `scope` set to `organization`, that particular pack will be
deployed to the organization level.

:::

:::info Using the organization default_scope

If default_scope == `organization`, AWS Config is global unless overriden in the `conformance_packs` items. You will
need to update your org to allow the `config-multiaccountsetup.amazonaws.com` service access principal for this to work.
If you are using our `account` component, just add that principal to the `aws_service_access_principals` variable.

:::

At the AWS Organizational level, the Components designate an account to be the `central collection account` and a single
region to be the `central collection region` so that compliance information can be aggregated into a central location.

Logs are typically written to the `audit` account and AWS Config deployed into to the `security` account.

Here's an example snippet for how to use this component:

```yaml
components:
  terraform:
    aws-config:
      vars:
        enabled: true
        account_map_tenant: core
        az_abbreviation_type: fixed
        # In each AWS account, an IAM role should be created in the main region.
        # If the main region is set to us-east-1, the value of the var.create_iam_role variable should be true.
        # For all other regions, the value of var.create_iam_role should be false.
        create_iam_role: false
        central_resource_collector_account: core-security
        global_resource_collector_region: us-east-1
        config_bucket_env: ue1
        config_bucket_stage: audit
        config_bucket_tenant: core
        conformance_packs:
          - name: Operational-Best-Practices-for-CIS-AWS-v1.4-Level2
            conformance_pack: https://raw.githubusercontent.com/awslabs/aws-config-rules/master/aws-config-conformance-packs/Operational-Best-Practices-for-CIS-AWS-v1.4-Level2.yaml
            parameter_overrides:
              AccessKeysRotatedParamMaxAccessKeyAge: '45'
          - name: Operational-Best-Practices-for-HIPAA-Security.yaml
            conformance_pack: https://raw.githubusercontent.com/awslabs/aws-config-rules/master/aws-config-conformance-packs/Operational-Best-Practices-for-HIPAA-Security.yaml
            parameter_overrides:
          ...
          (etc)
        managed_rules:
          access-keys-rotated:
            identifier: ACCESS_KEYS_ROTATED
            description: "Checks whether the active access keys are rotated within the number of days specified in maxAccessKeyAge. The rule is NON_COMPLIANT if the access keys have not been rotated for more than maxAccessKeyAge number of days."
            input_parameters:
              maxAccessKeyAge: "30"
            enabled: true
            tags: { }
```

## Deployment

Apply to your central region security account

```sh
atmos terraform plan aws-config-{central-region} --stack core-{central-region}-security -var=create_iam_role=true
```

For example when central region is `us-east-1`:

```sh
atmos terraform plan aws-config-ue1 --stack core-ue1-security -var=create_iam_role=true
```

Apply aws-config to all stacks in all stages.

```sh
atmos terraform plan aws-config-{each region} --stack {each region}-{each stage}
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

## References

- [AWS Config Documentation](https://docs.aws.amazon.com/config/index.html)
- [Cloud Posse's upstream component](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aws-config)
- [Conformance Packs documentation](https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html)
- [AWS Managed Sample Conformance Packs](https://github.com/awslabs/aws-config-rules/tree/master/aws-config-conformance-packs)



