---
title: sftp
sidebar_label: sftp
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/sftp/README.md
tags: [terraform, aws, sftp]
---

# Component: `sftp`

This component is responsible for provisioning SFTP Endpoints.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    sftp:
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-transfer-sftp](https://github.com/cloudposse/terraform-aws-transfer-sftp) - Cloud Posse's
  upstream component



