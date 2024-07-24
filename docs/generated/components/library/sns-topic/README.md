---
title: sns-topic
sidebar_label: sns-topic
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/sns-topic/README.md
tags: [terraform, aws, sns-topic]
---

# Component: `sns-topic`

This component is responsible for provisioning an SNS topic.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

`stacks/catalog/sns-topic/defaults.yaml` file (base component for all SNS topics with default settings):

```yaml
components:
  terraform:
    sns-topic/defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        tags:
          Team: sre
          Service: sns-topic
        subscribers: {}
        allowed_aws_services_for_sns_published: []
        kms_master_key_id: alias/aws/sns
        encryption_enabled: true
        sqs_queue_kms_master_key_id: alias/aws/sqs
        sqs_queue_kms_data_key_reuse_period_seconds: 300
        allowed_iam_arns_for_sns_publish: []
        sns_topic_policy_json: ""
        sqs_dlq_enabled: false
        sqs_dlq_max_message_size: 262144
        sqs_dlq_message_retention_seconds: 1209600
        delivery_policy: null
        fifo_topic: false
        fifo_queue_enabled: false
        content_based_deduplication: false
        redrive_policy_max_receiver_count: 5
        redrive_policy: null
```

```yaml
import:
  - catalog/sns-topic/defaults

components:
  terraform:
    sns-topic-example:
      metadata:
        component: sns-topic
        inherits:
          - sns-topic/defaults
      vars:
        enabled: true
        name: sns-topic-example
        sqs_dlq_enabled: false
        subscribers:
          opsgenie:
            protocol: "https"
            endpoint: "https://api.example.com/v1/"
            endpoint_auto_confirms: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/sns-topic) -
  Cloud Posse's upstream component



