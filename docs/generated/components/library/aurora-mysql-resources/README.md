---
title: aurora-mysql-resources
sidebar_label: aurora-mysql-resources
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aurora-mysql-resources/README.md
tags: [terraform, aws, aurora-mysql-resources]
---

# Component: `aurora-mysql-resources`

This component is responsible for provisioning Aurora MySQL resources: additional databases, users, permissions, grants,
etc.

NOTE: Creating additional users (including read-only users) and databases requires Spacelift, since that action to be
done via the mysql provider, and by default only the automation account is whitelisted by the Aurora cluster.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

`stacks/catalog/aurora-mysql/resources/defaults.yaml` file (base component for Aurora MySQL Resources with default
settings):

```yaml
components:
  terraform:
    aurora-mysql-resources/defaults:
      metadata:
        type: abstract
      vars:
        enabled: true
```

Example (not actual):

`stacks/uw2-dev.yaml` file (override the default settings for the cluster resources in the `dev` account, create an
additional database and user):

```yaml
import:
  - catalog/aurora-mysql/resources/defaults

components:
  terraform:
    aurora-mysql-resources/dev:
      metadata:
        component: aurora-mysql-resources
        inherits:
          - aurora-mysql-resources/defaults
      vars:
        aurora_mysql_component_name: aurora-mysql/dev
        additional_users:
          example:
            db_user: example
            db_password: ""
            grants:
              - grant: ["ALL"]
                db: example
                object_type: database
                schema: null
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aurora-mysql-resources) -
  Cloud Posse's upstream component



