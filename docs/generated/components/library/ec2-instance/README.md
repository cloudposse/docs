---
title: ec2-instance
sidebar_label: ec2-instance
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/ec2-instance/README.md
tags: [terraform, aws, ec2-instance]
---

# Component: `ec2-instance`

This component is responsible for provisioning a single EC2 instance.

## Usage

**Stack Level**: Regional

The typical stack configuration for this component is as follows:

```yaml
components:
  terraform:
    ec2-instance:
      vars:
        enabled: true
        name: ec2
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ec2-instance) -
  Cloud Posse's upstream component



