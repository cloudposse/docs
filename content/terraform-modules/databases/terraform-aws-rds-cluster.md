---
title: "terraform-aws-rds-cluster"
description: "Terraform module to provision an [`RDS Aurora`](https://aws.amazon.com/rds/aurora) cluster for MySQL or Postgres."
---
# Terraform AWS RDS Cluster

|                  |                                                                                                                                                                |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-rds-cluster                                                                                                        |
| Terraform Module | terraform-aws-rds-cluster                                                                                                                                      |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-rds-cluster.svg)](https://github.com/cloudposse/terraform-aws-rds-cluster/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-rds-cluster.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-rds-cluster)    |

# Usage

Basic [example](https://github.com/cloudposse/terraform-aws-rds-cluster/tree/master/examples/basic)


##### HCL
```hcl
module "rds_cluster_aurora" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-rds-cluster.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```


With [cluster parameters](https://github.com/cloudposse/terraform-aws-rds-cluster/tree/master/examples/with_cluster_parameters)

##### HCL
```hcl
module "rds_cluster_aurora" {
  source             = "git::https://github.com/cloudposse/terraform-aws-rds-cluster.git?ref=master"
  engine             = "aurora"
  cluster_size       = "2"
  namespace          = "cp"
  stage              = "dev"
  name               = "db"
  admin_user         = "admin"
  admin_password     = "Test123"
  db_name            = "dbname"
  instance_type      = "db.t2.small"
  vpc_id             = "vpc-xxxxxxx"
  availability_zones = ["us-east-1a", "us-east-1b"]
  security_groups    = ["sg-0a6d5a3a"]
  subnets            = ["subnet-8b03333", "subnet-8b0772a3"]
  zone_id            = "xxxxxxxx"

  cluster_parameters = [
    {
      name  = "character_set_client"
      value = "utf8"
    },
    {
      name  = "character_set_connection"
      value = "utf8"
    },
    {
      name  = "character_set_database"
      value = "utf8"
    },
    {
      name  = "character_set_results"
      value = "utf8"
    },
    {
      name  = "character_set_server"
      value = "utf8"
    },
    {
      name  = "collation_connection"
      value = "uft8_bin"
    },
    {
      name  = "collation_server"
      value = "uft8_bin"
    },
    {
      name         = "lower_case_table_names"
      value        = "1"
      apply_method = "pending-reboot"
    },
    {
      name         = "skip-character-set-client-handshake"
      value        = "1"
      apply_method = "pending-reboot"
    },
  ]
}
```

# Variables

| Name                | Default               | Description                                                                                                             |
|:--------------------|:----------------------|:------------------------------------------------------------------------------------------------------------------------|
| admin_password      | __REQUIRED__          | (Required unless a snapshot_identifier is provided) Password for the master DB user                                     |
| db_name             | __REQUIRED__          | Database name                                                                                                           |
| db_port             | "3306"                | Database port                                                                                                           |
| delimiter           | "-"                   | Delimiter to be used between `name`, `namespace`, `stage` and `attributes`                                              |
| engine              | "aurora"              | The name of the database engine to be used for this DB cluster. Valid values: `aurora`, `aurora-postgresql`             |
| engine_version      | ""                    | he version number of the database engine to use                                                                         |
| instance_type       | "db.t2.small"         | Instance type to use                                                                                                    |
| maintenance_window  | "wed:03:00-wed:04:00" | Weekly time range during which system maintenance can occur, in UTC                                                     |
| name                | __REQUIRED__          | Name of the application                                                                                                 |
| namespace           | __REQUIRED__          | Namespace (e.g. `cp` or `cloudposse`)                                                                                   |
| retention_period    | "5"                   | Number of days to retain backups for                                                                                    |
| admin_user          | "admin"               | (Required unless a snapshot_identifier is provided) Username for the master DB user                                     |
| security_groups     | __REQUIRED__          | List of security groups to be allowed to connect to the DB instance                                                     |
| snapshot_identifier | ""                    | Specifies whether or not to create this cluster from a snapshot                                                         |
| stage               | __REQUIRED__          | Stage (e.g. `prod`, `dev`, `staging`)                                                                                   |
| subnets             | __REQUIRED__          | List of VPC subnet IDs                                                                                                  |
| tags                | {}                    | Additional tags (e.g. map(`BusinessUnit`,`XYZ`)                                                                         |
| vpc_id              | __REQUIRED__          | VPC ID to create the cluster in (e.g. `vpc-a22222ee`)                                                                   |
| zone_id             | __REQUIRED__          | Route53 parent zone ID. The module will create sub-domain DNS records in the parent zone for the DB master and replicas |
| allowed_cidr_blocks | []                    | List of CIDR blocks allowed to access                                                                                   |
| attributes          | []                    | Additional attributes (e.g. `policy` or `role`)                                                                         |
| availability_zones  | __REQUIRED__          | List of Availability Zones that instances in the DB cluster can be created in                                           |
| backup_window       | "07:00-09:00"         | Daily time range during which the backups happen                                                                        |
| cluster_family      | "aurora5.6"           | The family of the DB cluster parameter group                                                                            |
| cluster_parameters  | []                    | List of DB parameters to apply                                                                                          |
| cluster_size        | "2"                   | Number of DB instances to create in the cluster                                                                         |

# Outputs

| Name          | Description                     |
|:--------------|:--------------------------------|
| cluster_name  | Cluster Identifier              |
| master_host   | DB Master hostname              |
| name          | Database name                   |
| password      | Password for the master DB user |
| replicas_host | Replicas hostname               |
| user          | Username for the master DB user |
