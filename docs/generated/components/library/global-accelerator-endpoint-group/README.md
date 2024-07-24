---
title: global-accelerator-endpoint-group
sidebar_label: global-accelerator-endpoint-group
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/global-accelerator-endpoint-group/README.md
tags: [terraform, aws, global-accelerator-endpoint-group]
---

# Component: `global-accelerator`

This component is responsible for provisioning a Global Accelerator Endpoint Group.

This component assumes that the `global-accelerator` component has already been deployed to the same account in the
environment specified by `var.global_accelerator_environment_name`.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

```yaml
components:
  terraform:
    global-accelerator-endpoint-group:
      vars:
        enabled: true
        config:
          endpoint_configuration:
            - endpoint_lb_name: my-load-balancer
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/global-accelerator-endpoint-group) -
  Cloud Posse's upstream component



