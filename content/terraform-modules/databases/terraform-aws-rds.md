---
title: "terraform-aws-rds"
description: "Terraform module to provision AWS [`RDS`](https://aws.amazon.com/rds/) instances"
---
# Terraform AWS RDS

|                  |                                                                                                                                                |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-rds                                                                                                |
| Terraform Module | terraform-aws-rds                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-rds.svg)](https://github.com/cloudposse/terraform-aws-rds/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-rds.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-rds)    |

The module will create:
* DB instance (MySQL, Postgres, SQL Server, Oracle)
* DB Parameter Group
* DB Subnet Group
* DB Security Group
* DNS Record in Route53 for the DB endpoint

# Variables

- `stage` - The deployment stage (_e.g._ `prod`, `staging`, `dev`)
- `namespace` - The namespace of the application the DB instance belongs to (_e.g._ `global`, `shared`, or the name of your company like `cloudposse`)
- `name` - The name of the application the DB instance belongs to
- `dns_zone_id` - The ID of the DNS Zone in Route53 where a new DNS record will be created for the DB host name
- `host_name` - The DB host name created in Route53
- `security_group_ids` - The IDs of the security groups from which to allow `ingress` traffic to the DB instance
- `database_name` -  (Optional) The name of the database to create when the DB instance is created
- `database_user` - (Required unless a `snapshot_identifier` or `replicate_source_db` is provided) Username for the master DB user
- `database_password` - (Required unless a snapshot_identifier or replicate_source_db is provided) Password for the master DB user
- `database_port` - Database port (_e.g._ `3306` for `MySQL`). Used in the DB Security Group to allow access to the DB instance from the provided `security_group_ids`
- `multi_az` - Default `false`. Set to `true` for a multi-AZ deployment (recommended for production)
- `storage_type` - One of `standard` (magnetic), `gp2` (general purpose SSD), or `io1` (provisioned IOPS SSD). Default `standard` (magnetic)
- `iops` - The amount of provisioned IOPS. Setting this implies a storage_type of `io1`. Default is `0` if rds storage type is not `io1`
- `allocated_storage` - The number of GBs to allocate for DB storage. Must be an integer, _e.g._ `10`
- `storage_encrypted` - (Optional) Specifies whether the DB instance is encrypted. The default is false if not specified.
- `engine` - Engine type, such as `mysql` or `postgres`
- `engine_version` - DB Engine version, _e.g._ `9.5.4` for `Postgres`
- `instance_class` - Instance class, _e.g._ `db.t2.micro`
- `db_parameter_group` - DB Parameter Group, _e.g._ `mysql5.6` for MySQL, `postgres9.5` for `Postgres`
- `publicly_accessible` - Determines if the DB instance can be publicly accessed from the Internet. Default `false`
- `subnet_ids` - List of subnets IDs in the VPC, _e.g._ `["sb-1234567890", "sb-0987654321"]`
- `vpc_id` - VPC ID the DB instance will be connected to
- `auto_minor_version_upgrade` - Automatically upgrade minor version of the DB (eg. from Postgres 9.5.3 to Postgres 9.5.4). Default `true`
- `allow_major_version_upgrade` - Allow upgrading of major version of database. Default `false`. **Important**: if you are using a snapshot for creating an instance, this option should be set to `true` (if engine versions specified in the manifest and in the snapshot are different)
- `apply_immediately` - Specifies whether any database modifications are applied immediately, or during the next maintenance window. Default `false`
- `maintenance_window` - The window to perform maintenance in. Default `"Mon:03:00-Mon:04:00"`
- `skip_final_snapshot` - If `true` (default), DB won't be backed up before deletion
- `copy_tags_to_snapshot` - Copy all tags from RDS database to snapshot. Default `true`
- `backup_retention_period` - Backup retention period in days (default `0`). Must be `> 0` to enable backups
- `backup_window` - When to perform DB snapshots. Default `"22:00-03:00"`. Can't overlap with the maintenance window
- `db_parameter` -  A list of DB parameters to apply. Note that parameters may differ from a family to an other
- `snapshot_identifier` - Specifies whether or not to create this database from a snapshot. This correlates to the snapshot ID you'd find in the RDS console, e.g: `rds:production-2015-06-26-06-05`
- `final_snapshot_identifier` - Specifies whether or not to create a final snapshot for this database when destroing. This option **must** be set if `skip_final_snapshot` = `false`. E.g.: `"dbname-final-snapshot-${md5(timestamp())}"`
- `parameter_group_name` - (Optional) Name of the DB parameter group to associate (e.g. `mysql-5-6`)

# Outputs

- `instance_id` - ID of the instance
- `instance_address` - Address of the instance
- `instance_endpoint` - DNS Endpoint of the instance
- `subnet_group_id` - ID of the Subnet Group
- `security_group_id` - ID of the Security Group
- `parameter_group_id` - ID of the Parameter Group
- `hostname` - DNS host name of the instance
