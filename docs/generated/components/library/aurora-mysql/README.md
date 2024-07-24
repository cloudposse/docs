---
title: aurora-mysql
sidebar_label: aurora-mysql
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aurora-mysql/README.md
tags: [terraform, aws, aurora-mysql]
---

# Component: `aurora-mysql`

This component is responsible for provisioning Aurora MySQL RDS clusters. It seeds relevant database information
(hostnames, username, password, etc.) into AWS SSM Parameter Store.

## Usage

**Stack Level**: Regional

Here's an example for how to use this component.

`stacks/catalog/aurora-mysql/defaults.yaml` file (base component for all Aurora MySQL clusters with default settings):

```yaml
components:
  terraform:
    aurora-mysql/defaults:
      metadata:
        type: abstract
      vars:
        enabled: false
        name: rds
        mysql_deletion_protection: false
        mysql_storage_encrypted: true
        aurora_mysql_engine: "aurora-mysql"
        allowed_cidr_blocks:
          # all automation
          - 10.128.0.0/22
          # all corp
          - 10.128.16.0/22
        eks_component_names:
          - eks/eks
        # https://docs.aws.amazon.com/AmazonRDS/latest/AuroraMySQLReleaseNotes/AuroraMySQL.Updates.3020.html
        # aws rds describe-db-engine-versions --engine aurora-mysql --query 'DBEngineVersions[].EngineVersion'
        aurora_mysql_engine_version: "8.0.mysql_aurora.3.02.0"
        # engine and cluster family are notoriously hard to find.
        # If you know the engine version (example here is "8.0.mysql_aurora.3.02.0"), use Engine and DBParameterGroupFamily from:
        #    aws rds describe-db-engine-versions --engine aurora-mysql --query "DBEngineVersions[]" | \
        #    jq '.[] | select(.EngineVersion == "8.0.mysql_aurora.3.02.0") |
        #       { Engine: .Engine, EngineVersion: .EngineVersion, DBParameterGroupFamily: .DBParameterGroupFamily }'
        #
        #    Returns:
        #    {
        #       "Engine": "aurora-mysql",
        #       "EngineVersion": "8.0.mysql_aurora.3.02.0",
        #       "DBParameterGroupFamily": "aurora-mysql8.0"
        #     }
        aurora_mysql_cluster_family: "aurora-mysql8.0"
        mysql_name: shared
        # 1 writer, 1 reader
        mysql_cluster_size: 2
        mysql_admin_user: "" # generate random username
        mysql_admin_password: "" # generate random password
        mysql_db_name: "" # generate random db name
        # https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.DBInstanceClass.html
        mysql_instance_type: "db.t3.medium"
        mysql_skip_final_snapshot: false
```

Example configuration for a dev cluster. Import this file into the primary region.
`stacks/catalog/aurora-mysql/dev.yaml` file (override the default settings for the cluster in the `dev` account):

```yaml
import:
  - catalog/aurora-mysql/defaults

components:
  terraform:
    aurora-mysql/dev:
      metadata:
        component: aurora-mysql
        inherits:
          - aurora-mysql/defaults
      vars:
        instance_type: db.r5.large
        mysql_cluster_size: 1
        mysql_name: main
        mysql_db_name: main
```

Example deployment with primary cluster deployed to us-east-1 in a `platform-dev` account:
`atmos terraform apply aurora-mysql/dev -s platform-use1-dev`

## Disaster Recovery with Cross-Region Replication

This component is designed to support cross-region replication with continuous replication. If enabled and deployed, a
secondary cluster will be deployed in a different region than the primary cluster. This approach is highly aggresive and
costly, but in a disaster scenario where the primary cluster fails, the secondary cluster can be promoted to take its
place. Follow these steps to handle a Disaster Recovery.

### Usage

To deploy a secondary cluster for cross-region replication, add the following catalog entries to an alternative region:

Default settings for a secondary, replica cluster. For this example, this file is saved as
`stacks/catalog/aurora-mysql/replica/defaults.yaml`

```yaml
import:
  - catalog/aurora-mysql/defaults

components:
  terraform:
    aurora-mysql/replica/defaults:
      metadata:
        component: aurora-mysql
        inherits:
          - aurora-mysql/defaults
      vars:
        eks_component_names: []
        allowed_cidr_blocks:
          # all automation in primary region (where Spacelift is deployed)
          - 10.128.0.0/22
          # all corp in the same region as this cluster
          - 10.132.16.0/22
        mysql_instance_type: "db.t3.medium"
        mysql_name: "replica"
        primary_cluster_region: use1
        is_read_replica: true
        is_promoted_read_replica: false # False by default, added for visibility
```

Environment specific settings for `dev` as an example:

```yaml
import:
  - catalog/aurora-mysql/replica/defaults

components:
  terraform:
    aurora-mysql/dev:
      metadata:
        component: aurora-mysql
        inherits:
          - aurora-mysql/defaults
          - aurora-mysql/replica/defaults
      vars:
        enabled: true
        primary_cluster_component: aurora-mysql/dev
```

### Promoting the Read Replica

Promoting an existing RDS Replicate cluster to a fully standalone cluster is not currently supported by Terraform:
https://github.com/hashicorp/terraform-provider-aws/issues/6749

Instead, promote the Replicate cluster with the AWS CLI command:
`aws rds promote-read-replica-db-cluster --db-cluster-identifier <identifier>`

After promoting the replica, update the stack configuration to prevent future Terrafrom runs from re-enabling
replication. In this example, modify `stacks/catalog/aurora-mysql/replica/defaults.yaml`

```yaml
is_promoted_read_replica: true
```

Reploying the component should show no changes. For example,
`atmos terraform apply aurora-mysql/dev -s platform-use2-dev`

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aurora-mysql) -
  Cloud Posse's upstream component



