---
title: documentdb
sidebar_label: documentdb
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/documentdb/README.md
tags: [terraform, aws, documentdb]
---

# Component: `documentdb`

This component is responsible for provisioning DocumentDB clusters.

## Usage

**Stack Level**: Regional

Here is an example snippet for how to use this component:

```yaml
components:
  terraform:
    documentdb:
      backend:
        s3:
          workspace_key_prefix: documentdb
      vars:
        enabled: true
        cluster_size: 3
        engine: docdb
        engine_version: 3.6.0
        cluster_family: docdb3.6
        retention_period: 35
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/documentdb) -
  Cloud Posse's upstream component



