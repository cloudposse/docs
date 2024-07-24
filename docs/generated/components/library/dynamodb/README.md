---
title: dynamodb
sidebar_label: dynamodb
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/dynamodb/README.md
tags: [terraform, aws, dynamodb]
---

# Component: `dynamodb`

This component is responsible for provisioning a DynamoDB table.

## Usage

**Stack Level**: Regional

Here is an example snippet for how to use this component:

```yaml
components:
  terraform:
    dynamodb:
      backend:
        s3:
          workspace_key_prefix: dynamodb
      vars:
        enabled: true
        hash_key: HashKey
        range_key: RangeKey
        billing_mode: PAY_PER_REQUEST
        autoscaler_enabled: false
        encryption_enabled: true
        point_in_time_recovery_enabled: true
        streams_enabled: false
        ttl_enabled: false
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/dynamodb) -
  Cloud Posse's upstream component



