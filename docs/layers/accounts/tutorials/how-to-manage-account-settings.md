---
title: "Manage Account Settings"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1468629039/How+to+manage+Account+Settings
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-manage-account-settings.md
---

# How to manage Account Settings

## Problem
We want to update Account Settings for a given AWS Account

## Solution

:::tip

TL;DR Update the `account-settings` component

:::

Account Settings are managed by the `account-settings` component and deployed for each account. Update the `account-settings` catalog and reapply the component.

For example to add password requirements, add the following to `stacks/catalog/account-settings.yaml`:

```
components:
  terraform:
    account-settings:
      backend:
        s3:
          role_arn: null
      vars:
        enabled: true
        minimum_password_length: 20
        maximum_password_age: 120
```
Then reapply the `account-settings` component for the given account. `example` tenant and `foo` stage are used in this example

```
atmos terraform apply account-settings -s example-gbl-foo
```

### How to set Budgets
Budgets are also managed with the `account-settings` component. In order to create budgets, enable budgets in the `account-settings` component

:::info

Budgets were added to the `account-settings` component in early 2022. Make sure the component contains `budgets.tf`. If not, pull the latest from [the upstream modules](https://github.com/cloudposse/terraform-aws-components/tree/master/modules/account-settings).

:::

```
components:
  terraform:
    account-settings:
      vars:
        enabled: true
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
```
Then reapply the `account-settings` component for all accounts. This example only applies to one account. Repeat this step for all accounts

```
atmos terraform apply account-settings -s example-gbl-foo
```


