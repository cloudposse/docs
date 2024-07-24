---
title: strongdm
sidebar_label: strongdm
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/strongdm/README.md
tags: [terraform, aws, strongdm]
---

# Component: `strongdm`

This component provisions [strongDM](https://www.strongdm.com/) gateway, relay and roles

## Usage

**Stack Level**: Regional

Use this in the catalog or use these variables to overwrite the catalog values.

```yaml
components:
  terraform:
    strong-dm:
      vars:
        enabled: true
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- https://github.com/spotinst/spotinst-kubernetes-helm-charts
- https://docs.spot.io/ocean/tutorials/spot-kubernetes-controller/


