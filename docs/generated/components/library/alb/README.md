---
title: alb
sidebar_label: alb
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/alb/README.md
tags: [terraform, aws, alb]
---

# Component: `alb`

This component is responsible for provisioning a generic Application Load Balancer. It depends on the `vpc` and
`dns-delegated` components.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    alb:
      vars:
        https_ssl_policy: ELBSecurityPolicy-FS-1-2-Res-2020-10
        health_check_path: /api/healthz
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/alb) -
  Cloud Posse's upstream component



