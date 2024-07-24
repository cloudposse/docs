---
title: kinesis-stream
sidebar_label: kinesis-stream
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/kinesis-stream/README.md
tags: [terraform, aws, kinesis-stream]
---

# Component: `kinesis-stream`

This component is responsible for provisioning an Amazon Kinesis data stream.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

`stacks/catalog/kinesis-stream/defaults.yaml` file (base component for all kinesis deployments with default settings):

```yaml
components:
  terraform:
    kinesis-stream/defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        tags:
          Team: sre
          Service: kinesis-stream
```

```yaml
import:
  - catalog/kinesis-stream/defaults

components:
  terraform:
    kinesis-example:
      metadata:
        component: kinesis-stream
        inherits:
          - kinesis-stream/defaults
      vars:
        name: kinesis-stream-example
        stream_mode: ON_DEMAND
        # shard_count: 2  # This does nothing if `stream_mode` is set to `ON_DEMAND`
        kms_key_id: "alias/aws/kinesis"
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/kinesis-stream) -
  Cloud Posse's upstream component



