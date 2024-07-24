---
title: mwaa
sidebar_label: mwaa
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/mwaa/README.md
tags: [terraform, aws, mwaa]
---

# Component: `mwaa`

This component provisions Amazon managed workflows for Apache Airflow.

The s3 bucket `dag_bucket` stores DAGs to be executed by MWAA.

## Access Modes

### Public

Allows the Airflow UI to be access over the public internet to users granted access by an IAM policy.

### Private

Limits access to users within the VPC to users granted access by an IAM policy.

- MWAA creates a VPC interface endpoint for the Airflow webserver and an interface endpoint for the pgsql metadatabase.
  - the endpoints are created in the AZs mapped to your private subnets
- MWAA binds an IP address from your private subnet to the interface endpoint

### Managing access to VPC endpoings on MWAA

MWAA creates a VPC endpoint in each of the private subnets.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    mwaa:
      vars:
        enabled: true
        name: app
        dag_processing_logs_enabled: true
        dag_processing_logs_level: INFO
        environment_class: mw1.small
        airflow_version: 2.0.2
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/TODO) -
  Cloud Posse's upstream component



