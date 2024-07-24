---
title: mq-broker
sidebar_label: mq-broker
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/mq-broker/README.md
tags: [terraform, aws, mq-broker]
---

# Component: `mq-broker`

This component is responsible for provisioning an AmazonMQ broker and corresponding security group.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    mq-broker:
      vars:
        enabled: true
        apply_immediately: true
        auto_minor_version_upgrade: true
        deployment_mode: "ACTIVE_STANDBY_MULTI_AZ"
        engine_type: "ActiveMQ"
        engine_version: "5.15.14"
        host_instance_type: "mq.t3.micro"
        publicly_accessible: false
        general_log_enabled: true
        audit_log_enabled: true
        encryption_enabled: true
        use_aws_owned_key: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/mq-broker) -
  Cloud Posse's upstream component



