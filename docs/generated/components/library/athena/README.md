---
title: athena
sidebar_label: athena
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/athena/README.md
tags: [terraform, aws, athena]
---

# Component: `athena`

This component is responsible for provisioning an Amazon Athena workgroup, databases, and related resources.

## Usage

**Stack Level**: Regional

Here are some example snippets for how to use this component:

`stacks/catalog/athena/defaults.yaml` file (base component for all Athena deployments with default settings):

```yaml
components:
  terraform:
    athena/defaults:
      metadata:
        type: abstract
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        tags:
          Team: sre
          Service: athena
        create_s3_bucket: true
        create_kms_key: true
        athena_kms_key_deletion_window: 7
        bytes_scanned_cutoff_per_query: null
        enforce_workgroup_configuration: true
        publish_cloudwatch_metrics_enabled: true
        encryption_option: "SSE_KMS"
        s3_output_path: ""
        workgroup_state: "ENABLED"
        database: []
```

```yaml
import:
  - catalog/athena/defaults

components:
  terraform:
    athena/example:
      metadata:
        component: athena
        inherits:
          - athena/defaults
      vars:
        enabled: true
        name: athena-example
        workgroup_description: "My Example Athena Workgroup"
        database:
          - example_db_1
          - example_db_2
```

### CloudTrail Integration

Using Athena with CloudTrail logs is a powerful way to enhance your analysis of AWS service activity. This component
supports creating a CloudTrail table for each account and setting up queries to read CloudTrail logs from a centralized
location.

To set up the CloudTrail Integration, first create the `create` and `alter` queries in Athena with this component. When
`var.cloudtrail_database` is defined, this component will create these queries.

```yaml
import:
  - catalog/athena/defaults

components:
  terraform:
    athena/audit:
      metadata:
        component: athena
        inherits:
          - athena/defaults
      vars:
        enabled: true
        name: athena-audit
        workgroup_description: "Athena Workgroup for Auditing"
        cloudtrail_database: audit
        databases:
          audit:
            comment: "Auditor database for Athena"
            properties: {}
        named_queries:
          platform_dev:
            database: audit
            description: "example query against CloudTrail logs"
            query: |
              SELECT
               useridentity.arn,
               eventname,
               sourceipaddress,
               eventtime
              FROM %s.platform_dev_cloudtrail_logs
              LIMIT 100;
```

Once those are created, run the `create` and then the `alter` queries in the AWS Console to create and then fill the
tables in Athena.

:::info

Athena runs queries with the permissions of the user executing the query. In order to be able to query CloudTrail logs,
the `audit` account must have access to the KMS key used to encrypt CloudTrails logs. Set `var.audit_access_enabled` to
`true` in the `cloudtrail` component

:::

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/athena) -
  Cloud Posse's upstream component
- [Querying AWS CloudTrail logs with AWS Athena](https://docs.aws.amazon.com/athena/latest/ug/cloudtrail-logs.html)



