---
title: rds
sidebar_label: rds
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/rds/README.md
tags: [terraform, aws, rds]
---

# Component: `rds`

This component is responsible for provisioning an RDS instance. It seeds relevant database information (hostnames,
username, password, etc.) into AWS SSM Parameter Store.

## Security Groups Guidance:

By default this component creates a client security group and adds that security group id to the default attached
security group. Ideally other AWS resources that require RDS access can be granted this client security group.
Additionally you can grant access via specific CIDR blocks or security group ids.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

### PostgreSQL

```yaml
components:
  terraform:
    rds/defaults:
      metadata:
        type: abstract
      vars:
        enabled: true
        use_fullname: false
        name: my-postgres-db
        instance_class: db.t3.micro
        database_name: my-postgres-db
        # database_user: admin # enable to specify something specific
        engine: postgres
        engine_version: "15.2"
        database_port: 5432
        db_parameter_group: "postgres15"
        allocated_storage: 10 #GBs
        ssm_enabled: true
        client_security_group_enabled: true
        ## The following settings allow the database to be accessed from anywhere
        # publicly_accessible: true
        # use_private_subnets: false
        # allowed_cidr_blocks:
        #  - 0.0.0.0/0
```

### Microsoft SQL

```yaml
components:
  terraform:
    rds:
      vars:
        enabled: true
        name: mssql
        # SQL Server 2017 Enterprise
        engine: sqlserver-ee
        engine_version: "14.00.3356.20"
        db_parameter_group: "sqlserver-ee-14.0"
        license_model: license-included
        # Required for MSSQL
        database_name: null
        database_port: 1433
        database_user: mssql
        instance_class: db.t3.xlarge
        # There are issues with enabling this
        multi_az: false
        allocated_storage: 20
        publicly_accessible: false
        ssm_enabled: true
        # This does not seem to work correctly
        deletion_protection: false
```

### Provisioning from a snapshot

The snapshot identifier variable can be added to provision an instance from a snapshot HOWEVER- Keep in mind these
instances are provisioned from a unique kms key per rds. For clean terraform runs, you must first provision the key for
the destination instance, then copy the snapshot using that kms key.

Example - I want a new instance `rds-example-new` to be provisioned from a snapshot of `rds-example-old`:

1. Use the console to manually make a snapshot of rds instance `rds-example-old`
1. provision the kms key for `rds-example-new`

   ```
   atmos terraform plan  rds-example-new -s ue1-staging '-target=module.kms_key_rds.aws_kms_key.default[0]'
   atmos terraform apply rds-example-new -s ue1-staging '-target=module.kms_key_rds.aws_kms_key.default[0]'
   ```

1. Use the console to copy the snapshot to a new name using the above provisioned kms key
1. Add `snapshot_identifier` variable to `rds-example-new` catalog and specify the newly copied snapshot that used the
   above key
1. Post provisioning, remove the `snapshot_idenfier` variable and verify terraform runs clean for the copied instance

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/rds) -
  Cloud Posse's upstream component



