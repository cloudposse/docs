---
title: dms
sidebar_label: dms
sidebar_class_name: command
description: |-
  Terraform modules for provisioning and managing AWS [DMS](https://aws.amazon.com/dms/) resources. 

  The following DMS resources are supported:

    - [IAM Roles for DMS](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-iam)
    - [DMS Endpoints](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-endpoint)
    - [DMS Replication Instances](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-replication-instance)
    - [DMS Replication Tasks](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-replication-task)
    - [DMS Event Subscriptions](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-event-subscription)

  Refer to [modules](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules) for more details.
custom_edit_url: https://github.com/cloudposse/terraform-aws-dms/blob/main/README.yaml
---

# Module: `dms`
Terraform modules for provisioning and managing AWS [DMS](https://aws.amazon.com/dms/) resources. 

The following DMS resources are supported:

  - [IAM Roles for DMS](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-iam)
  - [DMS Endpoints](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-endpoint)
  - [DMS Replication Instances](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-replication-instance)
  - [DMS Replication Tasks](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-replication-task)
  - [DMS Event Subscriptions](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules/dms-event-subscription)

Refer to [modules](https://github.com/cloudposse/terraform-aws-dms/tree/main/modules) for more details.






## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-dms/tree/main/examples/complete).

For automated tests of the example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-dms/tree/main/test).




## Examples


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
    vpc_endpoint_type = "Gateway"
    vpc_id            = module.vpc.vpc_id
    service_name      = "com.amazonaws.${var.region}.s3"
    route_table_ids   = module.subnets.private_route_table_ids

    tags = module.this.tags
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

    context    = module.this.context
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
    source_type                = "replication-instance"
    source_ids                 = [module.dms_replication_instance.replication_instance_id]
    sns_topic_arn              = module.sns_topic.sns_topic_arn

    # https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dms/describe-event-categories.html
    event_categories = [
      "low storage",
      "configuration change",
      "maintenance",
      "deletion",
      "creation",
      "failover",
      "failure"
    ]

    attributes = ["instance"]
    context = module.this.context
  }

  module "dms_replication_task_event_subscription" {
    source = "cloudposse/dms/aws//modules/dms-event-subscription"
    # Cloud Posse recommends pinning every module to a specific version
    # version     = "x.x.x"

    event_subscription_enabled = true
    source_type                = "replication-task"
    source_ids                 = [module.dms_replication_task.replication_task_id]
    sns_topic_arn              = module.sns_topic.sns_topic_arn

    # https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dms/describe-event-categories.html
    event_categories = [
      "configuration change",
      "state change",
      "deletion",
      "creation",
      "failure"
    ]

    attributes = ["task"]
    context = module.this.context
  }
```

__NOTE:__  If a replication task is in "Failed" state (for any reason, e.g. network connectivity issues, database table issues, configuration issues), 
it can't be destroyed with Terraform (but can be updated). 
The task needs to be updated/fixed and moved to any other state like "Running", "Stopped", "Starting", "Ready", etc.

You can monitor the progress of your task by checking the task status and by monitoring the task's control table. 
The task status indicates the condition of an AWS DMS task and its associated resources. 
It includes such indications as if the task is being created, starting, running, stopped, or failed. 
It also includes the current state of the tables that the task is migrating, such as if a full load of a table has begun 
or is in progress and details such as the number of inserts, deletes, and updates have occurred for the table.

Refer to [Monitoring DMS Task Status](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Monitoring.html#CHAP_Tasks.Status) for more information.



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.0 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

No outputs.
<!-- markdownlint-restore -->

