---
title: "terraform-aws-rds-cluster"
excerpt: "Terraform module to provision an [`RDS Aurora`](https://aws.amazon.com/rds/aurora) cluster for MySQL or Postgres."
---
# Terraform AWS RDS Cluster 
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-rds-cluster",
    "1-1": "terraform-aws-rds-cluster",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-rds-cluster.svg)](https://github.com/cloudposse/terraform-aws-rds-cluster/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-rds-cluster.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-rds-cluster)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Usage

Basic [example](https://github.com/cloudposse/terraform-aws-rds-cluster/tree/master/examples/basic)

[block:code]
{
  "codes": [
    {
      "code": "module \"rds_cluster_aurora\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-rds-cluster.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

With [cluster parameters](https://github.com/cloudposse/terraform-aws-rds-cluster/tree/master/examples/with_cluster_parameters)
[block:code]
{
  "codes": [
    {
      "code": "module \"rds_cluster_aurora\" {\n  source             = \"git::https://github.com/cloudposse/terraform-aws-rds-cluster.git?ref=master\"\n  engine             = \"aurora\"\n  cluster_size       = \"2\"\n  namespace          = \"cp\"\n  stage              = \"dev\"\n  name               = \"db\"\n  admin_user         = \"admin\"\n  admin_password     = \"Test123\"\n  db_name            = \"dbname\"\n  instance_type      = \"db.t2.small\"\n  vpc_id             = \"vpc-xxxxxxx\"\n  availability_zones = [\"us-east-1a\", \"us-east-1b\"]\n  security_groups    = [\"sg-0a6d5a3a\"]\n  subnets            = [\"subnet-8b03333\", \"subnet-8b0772a3\"]\n  zone_id            = \"xxxxxxxx\"\n\n  cluster_parameters = [\n    {\n      name  = \"character_set_client\"\n      value = \"utf8\"\n    },\n    {\n      name  = \"character_set_connection\"\n      value = \"utf8\"\n    },\n    {\n      name  = \"character_set_database\"\n      value = \"utf8\"\n    },\n    {\n      name  = \"character_set_results\"\n      value = \"utf8\"\n    },\n    {\n      name  = \"character_set_server\"\n      value = \"utf8\"\n    },\n    {\n      name  = \"collation_connection\"\n      value = \"uft8_bin\"\n    },\n    {\n      name  = \"collation_server\"\n      value = \"uft8_bin\"\n    },\n    {\n      name         = \"lower_case_table_names\"\n      value        = \"1\"\n      apply_method = \"pending-reboot\"\n    },\n    {\n      name         = \"skip-character-set-client-handshake\"\n      value        = \"1\"\n      apply_method = \"pending-reboot\"\n    },\n  ]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "admin_password",
    "1-0": "admin_user",
    "2-0": "allowed_cidr_blocks",
    "3-0": "attributes",
    "4-0": "availability_zones",
    "5-0": "backup_window",
    "6-0": "cluster_family",
    "7-0": "cluster_parameters",
    "8-0": "cluster_size",
    "9-0": "db_name",
    "10-0": "db_port",
    "11-0": "delimiter",
    "12-0": "engine",
    "13-0": "engine_version",
    "14-0": "instance_type",
    "15-0": "maintenance_window",
    "16-0": "name",
    "17-0": "namespace",
    "18-0": "retention_period",
    "19-0": "security_groups",
    "20-0": "snapshot_identifier",
    "21-0": "stage",
    "22-0": "subnets",
    "23-0": "tags",
    "24-0": "vpc_id",
    "25-0": "zone_id",
    "0-1": "__REQUIRED__",
    "0-2": "(Required unless a snapshot_identifier is provided) Password for the master DB user",
    "1-2": "(Required unless a snapshot_identifier is provided) Username for the master DB user",
    "1-1": "\"admin\"",
    "2-2": "List of CIDR blocks allowed to access",
    "2-1": "[]",
    "3-2": "Additional attributes (e.g. `policy` or `role`)",
    "3-1": "[]",
    "4-2": "List of Availability Zones that instances in the DB cluster can be created in",
    "4-1": "__REQUIRED__",
    "5-2": "Daily time range during which the backups happen",
    "5-1": "\"07:00-09:00\"",
    "6-2": "The family of the DB cluster parameter group",
    "6-1": "\"aurora5.6\"",
    "7-2": "List of DB parameters to apply",
    "7-1": "[]",
    "8-2": "Number of DB instances to create in the cluster",
    "8-1": "\"2\"",
    "9-2": "Database name",
    "9-1": "__REQUIRED__",
    "10-2": "Database port",
    "10-1": "\"3306\"",
    "11-2": "Delimiter to be used between `name`, `namespace`, `stage` and `attributes`",
    "11-1": "\"-\"",
    "12-2": "The name of the database engine to be used for this DB cluster. Valid values: `aurora`, `aurora-postgresql`",
    "12-1": "\"aurora\"",
    "13-1": "\"\"",
    "13-2": "he version number of the database engine to use",
    "14-2": "Instance type to use",
    "14-1": "\"db.t2.small\"",
    "15-1": "\"wed:03:00-wed:04:00\"",
    "15-2": "Weekly time range during which system maintenance can occur, in UTC",
    "16-2": "Name of the application",
    "16-1": "__REQUIRED__",
    "17-1": "__REQUIRED__",
    "17-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "18-2": "Number of days to retain backups for",
    "18-1": "\"5\"",
    "19-1": "__REQUIRED__",
    "19-2": "List of security groups to be allowed to connect to the DB instance",
    "20-2": "Specifies whether or not to create this cluster from a snapshot",
    "20-1": "\"\"",
    "21-2": "Stage (e.g. `prod`, `dev`, `staging`)",
    "21-1": "__REQUIRED__",
    "22-1": "__REQUIRED__",
    "23-1": "{}",
    "24-1": "__REQUIRED__",
    "22-2": "List of VPC subnet IDs",
    "23-2": "Additional tags (e.g. map(`BusinessUnit`,`XYZ`)",
    "24-2": "VPC ID to create the cluster in (e.g. `vpc-a22222ee`)",
    "25-2": "Route53 parent zone ID. The module will create sub-domain DNS records in the parent zone for the DB master and replicas",
    "25-1": "__REQUIRED__"
  },
  "cols": 3,
  "rows": 26
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-1": "Description",
    "h-0": "Name",
    "0-0": "cluster_name",
    "1-0": "master_host",
    "2-0": "name",
    "3-0": "password",
    "4-0": "replicas_host",
    "5-0": "user",
    "5-1": "Username for the master DB user",
    "4-1": "Replicas hostname",
    "3-1": "Password for the master DB user",
    "2-1": "Database name",
    "1-1": "DB Master hostname",
    "0-1": "Cluster Identifier"
  },
  "cols": 2,
  "rows": 6
}
[/block]