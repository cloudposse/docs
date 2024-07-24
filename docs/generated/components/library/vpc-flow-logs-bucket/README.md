---
title: vpc-flow-logs-bucket
sidebar_label: vpc-flow-logs-bucket
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/vpc-flow-logs-bucket/README.md
tags: [terraform, aws, vpc-flow-logs-bucket]
---

# Component: `vpc-flow-logs-bucket`

This component is responsible for provisioning an encrypted S3 bucket which is configured to receive VPC Flow Logs.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

**IMPORTANT**: This component expects the `aws_flow_log` resource to be created externally. Typically that is
accomplished through [the `vpc` component](../vpc/).

```yaml
components:
  terraform:
    vpc-flow-logs-bucket:
      vars:
        name: "vpc-flow-logs"
        noncurrent_version_expiration_days: 180
        noncurrent_version_transition_days: 30
        standard_transition_days: 60
        glacier_transition_days: 180
        expiration_days: 365
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/vpc-flow-logs-bucket) -
  Cloud Posse's upstream component



