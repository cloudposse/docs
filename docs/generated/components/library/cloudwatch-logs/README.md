---
title: cloudwatch-logs
sidebar_label: cloudwatch-logs
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/cloudwatch-logs/README.md
tags: [terraform, aws, cloudwatch-logs]
---

# Component: `cloudwatch-logs`

This component is responsible for creation of CloudWatch Log Streams and Log Groups.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    cloudwatch-logs:
      vars:
        enabled: true
        name: cloudwatch-logs
        retention_in_days: 15
        stream_names:
          - app-1
          - app-2
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/cloudwatch-logs) -
  Cloud Posse's upstream component



