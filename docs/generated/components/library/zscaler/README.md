---
title: zscaler
sidebar_label: zscaler
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/zscaler/README.md
tags: [terraform, aws, zscaler]
---

# Component: `zscaler`

This component is responsible for provisioning ZScaler Private Access Connector instances on Amazon Linux 2 AMIs.

Prior to provisioning this component, it is required that a SecureString SSM Parameter containing the ZScaler App
Connector Provisioning Key is populated in each account corresponding to the regional stack the component is deployed
to, with the name of the SSM Parameter matching the value of `var.zscaler_key`.

This parameter should be populated using `chamber`, which is included in the geodesic image:

```
chamber write zscaler key <value>
```

Where `<value>` is the ZScaler App Connector Provisioning Key. For more information on how to generate this key, see:
[ZScaler documentation on Configuring App Connectors](https://help.zscaler.com/zpa/configuring-connectors).

## Usage

**Stack Level**: Regional

The typical stack configuration for this component is as follows:

```yaml
components:
  terraform:
    zscaler:
      vars:
        zscaler_count: 2
```

Preferably, regional stack configurations can be kept _DRY_ by importing `catalog/zscaler` via the `imports` list at the
top of the configuration.

```
import:
  ...
  - catalog/zscaler
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/zscaler) -
  Cloud Posse's upstream component



