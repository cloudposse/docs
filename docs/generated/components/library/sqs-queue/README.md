---
title: sqs-queue
sidebar_label: sqs-queue
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/sqs-queue/README.md
tags: [terraform, aws, sqs-queue]
---

# Component: `sqs-queue`

This component is responsible for creating an SQS queue.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    sqs-queue/defaults:
      vars:
        enabled: true
        # org defaults

    sqs-queue:
      metadata:
        component: sqs-queue
        inherits:
          - sqs-queue/defaults
      vars:
        name: sqs
        visibility_timeout_seconds: 30
        message_retention_seconds: 86400 # 1 day
        delay_seconds: 0
        max_message_size_bytes: 262144
        receive_wait_time_seconds: 0
        fifo_queue: false
        content_based_deduplication: false
        dlq_enabled: true
        dlq_name_suffix: "dead-letter" # default is dlq
        dlq_max_receive_count: 1
        dlq_kms_data_key_reuse_period_seconds: 86400 # 1 day
        kms_data_key_reuse_period_seconds: 86400 # 1 day
        # kms_master_key_id: "alias/aws/sqs" # Use KMS # default null
        sqs_managed_sse_enabled: true # SSE vs KMS (Priority goes to KMS)
        iam_policy_limit_to_current_account: true # default true
        iam_policy:
          - version: 2012-10-17
            policy_id: Allow-S3-Event-Notifications
            statements:
              - sid: Allow-S3-Event-Notifications
                effect: Allow
                principals:
                  - type: Service
                    identifiers: ["s3.amazonaws.com"]
                actions:
                  - SQS:SendMessage
                resources: [] # auto includes this queue's ARN
                conditions:
                  ## this is included when `iam_policy_limit_to_current_account` is true
                  #- test: StringEquals
                  #  variable: aws:SourceAccount
                  #  value: "1234567890"
                  - test: ArnLike
                    variable: aws:SourceArn
                    values:
                      - "arn:aws:s3:::*"
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/sqs-queue) -
  Cloud Posse's upstream component



## CHANGELOG

### Pull Request [#1042](https://github.com/cloudposse/terraform-aws-components/pull/1042) - Refactor `sqs-queue` Component

Components PR [#1042](https://github.com/cloudposse/terraform-aws-components/pull/1042)

#### Affected Components

- `sqs-queue`

#### Summary

This change to the sqs-queue component, [#1042](https://github.com/cloudposse/terraform-aws-components/pull/1042),
refactored the `sqs-queue` component to use the AWS Module for queues, this provides better support for Dead-Letter
Queues and easy policy attachment.

As part of that change, we've changed some variables:

- `policy` - **Removed**
- `redrive_policy` - **Removed**
- `dead_letter_sqs_arn` - **Removed**
- `dead_letter_component_name` - **Removed**
- `dead_letter_max_receive_count` - Renamed to `dlq_max_receive_count`
- `fifo_throughput_limit` **type changed** from `list(string)` to type `string`
- `kms_master_key_id` **type changed** from `list(string)` to type `string`

