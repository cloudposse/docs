---
title: aurora-postgres
sidebar_label: aurora-postgres
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aurora-postgres/README.md
tags: [terraform, aws, aurora-postgres]
---

# Component: `aurora-postgres`

This component is responsible for provisioning Aurora Postgres RDS clusters. It seeds relevant database information
(hostnames, username, password, etc.) into AWS SSM Parameter Store.

## Usage

**Stack Level**: Regional

Here's an example for how to use this component.

`stacks/catalog/aurora-postgres/defaults.yaml` file (base component for all Aurora Postgres clusters with default
settings):

```yaml
components:
  terraform:
    aurora-postgres/defaults:
      metadata:
        type: abstract
      vars:
        enabled: true
        name: aurora-postgres
        tags:
          Team: sre
          Service: aurora-postgres
        cluster_name: shared
        deletion_protection: false
        storage_encrypted: true
        engine: aurora-postgresql

        # Provisioned configuration
        engine_mode: provisioned
        engine_version: "15.3"
        cluster_family: aurora-postgresql15
        # 1 writer, 1 reader
        cluster_size: 2
        # https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.DBInstanceClass.html
        instance_type: db.t3.medium

        admin_user: postgres
        admin_password: "" # generate random password
        database_name: postgres
        database_port: 5432
        skip_final_snapshot: false
        # Enhanced Monitoring
        # A boolean flag to enable/disable the creation of the enhanced monitoring IAM role.
        # If set to false, the module will not create a new role and will use rds_monitoring_role_arn for enhanced monitoring
        enhanced_monitoring_role_enabled: true
        # The interval, in seconds, between points when enhanced monitoring metrics are collected for the DB instance.
        # To disable collecting Enhanced Monitoring metrics, specify 0. The default is 0. Valid Values: 0, 1, 5, 10, 15, 30, 60
        rds_monitoring_interval: 15
        # Allow ingress from the following accounts
        # If any of tenant, stage, or environment aren't given, this will be taken
        allow_ingress_from_vpc_accounts:
          - tenant: core
            stage: auto
```

Example (not actual):

`stacks/uw2-dev.yaml` file (override the default settings for the cluster in the `dev` account, create an additional
database and user):

```yaml
import:
  - catalog/aurora-postgres/defaults

components:
  terraform:
    aurora-postgres:
      metadata:
        component: aurora-postgres
        inherits:
          - aurora-postgres/defaults
      vars:
        enabled: true
```

### Finding Aurora Engine Version

Use the following to query the AWS API by `engine-mode`. Both provisioned and Serverless v2 use the `privisoned` engine
mode, whereas only Serverless v1 uses the `serverless` engine mode.

```bash
aws rds describe-db-engine-versions \
  --engine aurora-postgresql \
  --query 'DBEngineVersions[].EngineVersion' \
  --filters 'Name=engine-mode,Values=serverless'
```

Use the following to query AWS API by `db-instance-class`. Use this query to find supported versions for a specific
instance class, such as `db.serverless` with Serverless v2.

```bash
aws rds describe-orderable-db-instance-options \
  --engine aurora-postgresql \
  --db-instance-class db.serverless \
  --query 'OrderableDBInstanceOptions[].[EngineVersion]'
```

Once a version has been selected, use the following to find the cluster family.

```bash
aws rds describe-db-engine-versions --engine aurora-postgresql --query "DBEngineVersions[]" | \
jq '.[] | select(.EngineVersion == "15.3") |
   { Engine: .Engine, EngineVersion: .EngineVersion, DBParameterGroupFamily: .DBParameterGroupFamily }'
```

## Examples

Generally there are three different engine configurations for Aurora: provisioned, Serverless v1, and Serverless v2.

### Provisioned Aurora Postgres

[See the default usage example above](#usage)

### Serverless v1 Aurora Postgres

Serverless v1 requires `engine-mode` set to `serverless` uses `scaling_configuration` to configure scaling options.

For valid values, see
[ModifyCurrentDBClusterCapacity](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_ModifyCurrentDBClusterCapacity.html).

```yaml
components:
  terraform:
    aurora-postgres:
      vars:
        enabled: true
        name: aurora-postgres
        eks_component_names:
          - eks/cluster
        allow_ingress_from_vpc_accounts:
          # Allows Spacelift
          - tenant: core
            stage: auto
            environment: use2
          # Allows VPN
          - tenant: core
            stage: network
            environment: use2
        cluster_name: shared
        engine: aurora-postgresql

        # Serverless v1 configuration
        engine_mode: serverless
        instance_type: "" # serverless engine_mode ignores `var.instance_type`
        engine_version: "13.9" # Latest supported version as of 08/28/2023
        cluster_family: aurora-postgresql13
        cluster_size: 0 # serverless
        scaling_configuration:
          - auto_pause: true
            max_capacity: 5
            min_capacity: 2
            seconds_until_auto_pause: 300
            timeout_action: null

        admin_user: postgres
        admin_password: "" # generate random password
        database_name: postgres
        database_port: 5432
        storage_encrypted: true
        deletion_protection: true
        skip_final_snapshot: false
        # Creating read-only users or additional databases requires Spacelift
        read_only_users_enabled: false
        # Enhanced Monitoring
        # A boolean flag to enable/disable the creation of the enhanced monitoring IAM role.
        # If set to false, the module will not create a new role and will use rds_monitoring_role_arn for enhanced monitoring
        enhanced_monitoring_role_enabled: true
        enhanced_monitoring_attributes: ["monitoring"]
        # The interval, in seconds, between points when enhanced monitoring metrics are collected for the DB instance.
        # To disable collecting Enhanced Monitoring metrics, specify 0. The default is 0. Valid Values: 0, 1, 5, 10, 15, 30, 60
        rds_monitoring_interval: 15
        iam_database_authentication_enabled: false
        additional_users: {}
```

### Serverless v2 Aurora Postgres

Aurora Postgres Serverless v2 uses the `provisioned` engine mode with `db.serverless` instances. In order to configure
scaling with Serverless v2, use `var.serverlessv2_scaling_configuration`.

For more on valid scaling configurations, see
[Performance and scaling for Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html).

```yaml
components:
  terraform:
    aurora-postgres:
      vars:
        enabled: true
        name: aurora-postgres
        eks_component_names:
          - eks/cluster
        allow_ingress_from_vpc_accounts:
          # Allows Spacelift
          - tenant: core
            stage: auto
            environment: use2
          # Allows VPN
          - tenant: core
            stage: network
            environment: use2
        cluster_name: shared
        engine: aurora-postgresql

        # Serverless v2 configuration
        engine_mode: provisioned
        instance_type: "db.serverless"
        engine_version: "15.3"
        cluster_family: aurora-postgresql15
        cluster_size: 2
        serverlessv2_scaling_configuration:
          min_capacity: 2
          max_capacity: 64

        admin_user: postgres
        admin_password: "" # generate random password
        database_name: postgres
        database_port: 5432
        storage_encrypted: true
        deletion_protection: true
        skip_final_snapshot: false
        # Creating read-only users or additional databases requires Spacelift
        read_only_users_enabled: false
        # Enhanced Monitoring
        # A boolean flag to enable/disable the creation of the enhanced monitoring IAM role.
        # If set to false, the module will not create a new role and will use rds_monitoring_role_arn for enhanced monitoring
        enhanced_monitoring_role_enabled: true
        enhanced_monitoring_attributes: ["monitoring"]
        # The interval, in seconds, between points when enhanced monitoring metrics are collected for the DB instance.
        # To disable collecting Enhanced Monitoring metrics, specify 0. The default is 0. Valid Values: 0, 1, 5, 10, 15, 30, 60
        rds_monitoring_interval: 15
        iam_database_authentication_enabled: false
        additional_users: {}
```

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aurora-postgres) -
  Cloud Posse's upstream component



