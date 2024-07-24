---
title: account-settings
sidebar_label: account-settings
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/account-settings/README.md
tags: [terraform, aws, account-settings]
---

# Component: `account-settings`

This component is responsible for provisioning account level settings: IAM password policy, AWS Account Alias, EBS
encryption, and Service Quotas.

## Usage

**Stack Level**: Global

Here's an example snippet for how to use this component. It's suggested to apply this component to all accounts, so
create a file `stacks/catalog/account-settings.yaml` with the following content and then import that file in each
account's global stack (overriding any parameters as needed):

```yaml
components:
  terraform:
    account-settings:
      vars:
        enabled: true
        minimum_password_length: 20
        maximum_password_age: 120
        budgets_enabled: true
        budgets_notifications_enabled: true
        budgets_slack_webhook_url: https://url.slack.com/abcd/1234
        budgets_slack_username: AWS Budgets
        budgets_slack_channel: aws-budgets-notifications
        budgets:
          - name: 1000-total-monthly
            budget_type: COST
            limit_amount: "1000"
            limit_unit: USD
            time_unit: MONTHLY
          - name: s3-3GB-limit-monthly
            budget_type: USAGE
            limit_amount: "3"
            limit_unit: GB
            time_unit: MONTHLY
            notification:
              - comparison_operator: GREATER_THAN
                notification_type: FORECASTED
                threshold_type: PERCENTAGE
                threshold: 80
                subscribers:
                  - slack
              - comparison_operator: GREATER_THAN
                notification_type: FORECASTED
                threshold_type: PERCENTAGE
                # We generate two forecast notifications. This makes sure that notice is taken,
                #   and hopefully action can be taken to prevent going over budget.
                threshold: 100
                subscribers:
                  - slack
              - comparison_operator: GREATER_THAN
                notification_type: ACTUAL
                threshold_type: PERCENTAGE
                threshold: 100
                subscribers:
                  - slack
        service_quotas_enabled: true
        service_quotas:
          - quota_name: Subnets per VPC
            service_code: vpc
            value: 250
          - quota_code: L-E79EC296 # aka `Security Groups per Region`
            service_code: vpc
            value: 500
          - quota_code: L-F678F1CE # aka `VPC per Region`
            service_code: vpc
            value: null
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/account-settings) -
  Cloud Posse's upstream component



