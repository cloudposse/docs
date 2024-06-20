---
title: dms-event-subscription
sidebar_label: dms-event-subscription
sidebar_class_name: command
description: dms-event-subscription
custom_edit_url: https://github.com/cloudposse/terraform-aws-dms/blob/main/modules/dms-event-subscription/README.md
---

# dms-event-subscription

Terraform module to provision DMS Event Subscriptions.

## Usage

```hcl
module "dms_iam" {
  source = "cloudposse/dms/aws//modules/dms-iam"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  context = module.this.context
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ipv4_primary_cidr_block = "172.19.0.0/16"

  context = module.this.context
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  availability_zones   = ["us-east-2a", "us-east-2b"]
  vpc_id               = local.vpc_id
  igw_id               = [module.vpc.igw_id]
  ipv4_cidr_block      = [module.vpc.vpc_cidr_block]
  nat_gateway_enabled  = false
  nat_instance_enabled = false

  context = module.this.context
}

module "dms_replication_instance" {
  source = "cloudposse/dms/aws//modules/dms-replication-instance"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  engine_version               = "3.4"
  replication_instance_class   = "dms.t2.small"
  allocated_storage            = 50
  apply_immediately            = true
  auto_minor_version_upgrade   = true
  allow_major_version_upgrade  = false
  multi_az                     = false
  publicly_accessible          = false
  preferred_maintenance_window = "sun:10:30-sun:14:30"
  vpc_security_group_ids       = [module.vpc.vpc_default_security_group_id, module.aurora_postgres_cluster.security_group_id]
  subnet_ids                   = module.subnets.private_subnet_ids

  context = module.this.context

  depends_on = [
    # The required DMS roles must be present before replication instances can be provisioned
    module.dms_iam,
    aws_vpc_endpoint.s3
  ]
}

module "aurora_postgres_cluster" {
  source  = "cloudposse/rds-cluster/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  engine                               = "aurora-postgresql"
  engine_mode                          = "provisioned"
  engine_version                       = "13.4"
  cluster_family                       = "aurora-postgresql13"
  cluster_size                         = 1
  admin_user                           = "admin_user"
  admin_password                       = "admin_password"
  db_name                              = "postgres"
  db_port                              = 5432
  instance_type                        = "db.t3.medium"
  vpc_id                               = module.vpc.vpc_id
  subnets                              = module.subnets.private_subnet_ids
  security_groups                      = [module.vpc.vpc_default_security_group_id]
  deletion_protection                  = false
  autoscaling_enabled                  = false
  storage_encrypted                    = false
  intra_security_group_traffic_enabled = false
  skip_final_snapshot                  = true
  enhanced_monitoring_role_enabled     = false
  iam_database_authentication_enabled  = false

  cluster_parameters = [
    {
      name         = "rds.logical_replication"
      value        = "1"
      apply_method = "pending-reboot"
    },
    {
      name         = "max_replication_slots"
      value        = "10"
      apply_method = "pending-reboot"
    },
    {
      name         = "wal_sender_timeout"
      value        = "0"
      apply_method = "pending-reboot"
    },
    {
      name         = "max_worker_processes"
      value        = "8"
      apply_method = "pending-reboot"
    },
    {
      name         = "max_logical_replication_workers"
      value        = "10"
      apply_method = "pending-reboot"
    },
    {
      name         = "max_parallel_workers"
      value        = "8"
      apply_method = "pending-reboot"
    },
    {
      name         = "max_parallel_workers"
      value        = "8"
      apply_method = "pending-reboot"
    }
  ]

  context = module.this.context
}

module "dms_endpoint_aurora_postgres" {
  source = "cloudposse/dms/aws//modules/dms-endpoint"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  endpoint_type                   = "source"
  engine_name                     = "aurora-postgresql"
  server_name                     = module.aurora_postgres_cluster.reader_endpoint
  database_name                   = "postgres"
  port                            = 5432
  username                        = "admin_user"
  password                        = "admin_password"
  extra_connection_attributes     = ""
  secrets_manager_access_role_arn = null
  secrets_manager_arn             = null
  ssl_mode                        = "none"

  attributes = ["source"]
  context    = module.this.context
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id       = module.vpc.vpc_id
  service_name = "com.amazonaws.${var.region}.s3"
  tags         = module.this.tags
}

module "s3_bucket" {
  source  = "cloudposse/s3-bucket/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  acl                          = "private"
  versioning_enabled           = false
  allow_encrypted_uploads_only = false
  allow_ssl_requests_only      = false
  force_destroy                = true
  block_public_acls            = true
  block_public_policy          = true
  ignore_public_acls           = true
  restrict_public_buckets      = true

  context = module.this.context
}

module "dms_endpoint_s3_bucket" {
  source = "cloudposse/dms/aws//modules/dms-endpoint"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  endpoint_type = "target"
  engine_name   = "s3"

  s3_settings = {
    bucket_name                      = module.s3_bucket.bucket_id
    bucket_folder                    = null
    cdc_inserts_only                 = false
    csv_row_delimiter                = " "
    csv_delimiter                    = ","
    data_format                      = "parquet"
    compression_type                 = "GZIP"
    date_partition_delimiter         = "NONE"
    date_partition_enabled           = true
    date_partition_sequence          = "YYYYMMDD"
    include_op_for_full_load         = true
    parquet_timestamp_in_millisecond = true
    timestamp_column_name            = "timestamp"
    service_access_role_arn          = aws_iam_role.s3.arn
  }

  extra_connection_attributes = ""

  attributes = ["target"]
  context    = module.this.context
}

module "dms_replication_task" {
  source = "cloudposse/dms/aws//modules/dms-replication-task"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  replication_instance_arn = module.dms_replication_instance.replication_instance_arn
  start_replication_task   = true
  migration_type           = "full-load-and-cdc"
  source_endpoint_arn      = module.dms_endpoint_aurora_postgres.endpoint_arn
  target_endpoint_arn      = module.dms_endpoint_s3_bucket.endpoint_arn

  replication_task_settings = file("${path.module}/config/replication-task-settings.json")
  table_mappings            = file("${path.module}/config/replication-task-table-mappings.json")

  context = module.this.context
}

module "sns_topic" {
  source  = "cloudposse/sns-topic/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  sqs_dlq_enabled                        = false
  fifo_topic                             = false
  fifo_queue_enabled                     = false
  encryption_enabled                     = false

  allowed_aws_services_for_sns_published = [
    "cloudwatch.amazonaws.com",
    "dms.amazonaws.com"
  ]

  context = module.this.context
}

module "dms_replication_instance_event_subscription" {
  source = "cloudposse/dms/aws//modules/dms-event-subscription"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  event_subscription_enabled = true
  event_categories           = ["creation", "failure"]
  source_type                = "replication-instance"
  source_ids                 = [module.dms_replication_instance.replication_instance_id]
  sns_topic_arn              = module.sns_topic.sns_topic_arn

  attributes = ["instance"]
  context = module.this.context
}

module "dms_replication_task_event_subscription" {
  source = "cloudposse/dms/aws//modules/dms-event-subscription"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  event_subscription_enabled = true
  event_categories           = ["creation", "failure"]
  source_type                = "replication-task"
  source_ids                 = [module.dms_replication_task.replication_task_id]
  sns_topic_arn              = module.sns_topic.sns_topic_arn

  attributes = ["task"]
  context = module.this.context
}
```

