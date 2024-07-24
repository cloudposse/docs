---
title: lakeformation
sidebar_label: lakeformation
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/lakeformation/README.md
tags: [terraform, aws, lakeformation]
---

# Component: `lakeformation`

This component is responsible for provisioning Amazon Lake Formation resources.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

`stacks/catalog/lakeformation/defaults.yaml` file (base component for all lakeformation deployments with default
settings):

```yaml
components:
  terraform:
    lakeformation/defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        tags:
          Team: sre
          Service: lakeformation
```

```yaml
import:
  - catalog/lakeformation/defaults

components:
  terraform:
    lakeformation-example:
      metadata:
        component: lakeformation
        inherits:
          - lakeformation/defaults
      vars:
        enabled: true
        name: lakeformation-example
        s3_bucket_arn: arn:aws:s3:::some-test-bucket
        create_service_linked_role: true
        admin_arn_list:
          - arn:aws:iam::012345678912:role/my-admin-role
        lf_tags:
          left: ["test1", "test2"]
          right: ["test3", "test4"]
        resources:
          database:
            name: example_db_1
            tags:
              left: test1
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/lakeformation) -
  Cloud Posse's upstream component



