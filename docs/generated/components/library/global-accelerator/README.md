---
title: global-accelerator
sidebar_label: global-accelerator
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/global-accelerator/README.md
tags: [terraform, aws, global-accelerator]
---

# Component: `global-accelerator`

This component is responsible for provisioning AWS Global Accelerator and its listeners.

## Usage

**Stack Level**: Global

Here are some example snippets for how to use this component:

```yaml
global-accelerator:
  vars:
    enabled: true
    flow_logs_enabled: true
    flow_logs_s3_bucket: examplecorp-ue1-devplatform-global-accelerator-flow-logs
    flow_logs_s3_prefix: logs/
    listeners:
      - client_affinity: NONE
        protocol: TCP
        port_ranges:
          - from_port: 80
            to_port: 80
          - from_port: 443
            to_port: 443
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/global-accelerator) -
  Cloud Posse's upstream component



