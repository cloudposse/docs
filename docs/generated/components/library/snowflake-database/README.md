---
title: snowflake-database
sidebar_label: snowflake-database
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/snowflake-database/README.md
tags: [terraform, aws, snowflake-database]
---

# Component: `snowflake-database`

All data in Snowflake is stored in database tables, logically structured as collections of columns and rows. This
component will create and control a Snowflake database, schema, and set of tables.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component:

```yaml
components:
  terraform:
    snowflake-database:
      vars:
        enabled: true
        tags:
          Team: data
          Service: snowflake
        tables:
          example:
            comment: "An example table"
            columns:
              - name: "data"
                type: "text"
              - name: "DATE"
                type: "TIMESTAMP_NTZ(9)"
              - name: "extra"
                type: "VARIANT"
                comment: "extra data"
            primary_key:
              name: "pk"
              keys:
                - "data"
        views:
          select-example:
            comment: "An example view"
            statement: |
              select * from "example";
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/snowflake-database) -
  Cloud Posse's upstream component



