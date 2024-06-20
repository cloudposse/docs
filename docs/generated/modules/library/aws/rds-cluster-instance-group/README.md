---
title: rds-cluster-instance-group
sidebar_label: rds-cluster-instance-group
sidebar_class_name: command
description: |-
  Terraform module to provision an [`RDS Aurora`](https://aws.amazon.com/rds/aurora) instance group for MySQL or Postgres along with a dedicated endpoint.

  Use this module together with our [`terraform-aws-rds-cluster`](https://github.com/cloudposse/terraform-aws-rds-cluster) to provision pools of RDS instances.  This is useful for creating reporting clusters that don't impact the production databases.

  Supports [Amazon Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/).
tags:
  - aws
  - terraform
  - terraform-modules
  - databases
  - rds
  - rds-database
  - rds-cluster
  - rds-instance
  - aurora
  - mysql
  - cluster

custom_edit_url: https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group/blob/main/README.yaml
---

# Module: `rds-cluster-instance-group`
Terraform module to provision an [`RDS Aurora`](https://aws.amazon.com/rds/aurora) instance group for MySQL or Postgres along with a dedicated endpoint.

Use this module together with our [`terraform-aws-rds-cluster`](https://github.com/cloudposse/terraform-aws-rds-cluster) to provision pools of RDS instances.  This is useful for creating reporting clusters that don't impact the production databases.

Supports [Amazon Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/).






## Usage


[Basic example](https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group/tree/main/examples/basic)

```hcl
module "rds_cluster_replicas" {
  source             = "git::https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group.git?ref=master"
  name               = "postgres"
  namespace          = "eg"
  stage              = "dev"
  attributes         = ["replicas"]
  cluster_identifier = "eg-dev-db"
  cluster_size       = "2"
  db_port            = "5432"
  instance_type      = "db.r4.large"
  vpc_id             = "vpc-xxxxxxxx"
  security_groups    = ["sg-xxxxxxxx"]
  subnets            = ["subnet-xxxxxxxx", "subnet-xxxxxxxx"]
  zone_id            = "Zxxxxxxxx"
}
```

[With cluster parameters](https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group/tree/main/examples/with_cluster_parameters)

```hcl
module "rds_cluster_reporting" {
  source             = "git::https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group.git?ref=master"
  cluster_size       = "2"
  namespace          = "eg"
  stage              = "dev"
  name               = "db"
  attributes         = ["reporting"]
  cluster_identifier = "eg-dev-db"
  instance_type      = "db.t2.small"
  vpc_id             = "vpc-xxxxxxx"
  security_groups    = ["sg-xxxxxxxx"]
  subnets            = ["subnet-xxxxxxxx", "subnet-xxxxxxxx"]
  zone_id            = "Zxxxxxxxx"

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

[With enhanced monitoring](https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group/tree/main/examples/enhanced_monitoring)

```hcl
# create IAM role for monitoring
resource "aws_iam_role" "enhanced_monitoring" {
  name               = "rds-cluster-example-1"
  assume_role_policy = "${data.aws_iam_policy_document.enhanced_monitoring.json}"
}

# Attach Amazon's managed policy for RDS enhanced monitoring
resource "aws_iam_role_policy_attachment" "enhanced_monitoring" {
  role       = "${aws_iam_role.enhanced_monitoring.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# allow rds to assume this role
data "aws_iam_policy_document" "enhanced_monitoring" {
  statement {
      actions = [
      "sts:AssumeRole",
    ]

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["monitoring.rds.amazonaws.com"]
    }
  }
}

module "rds_cluster_reporting" {
  source             = "git::https://github.com/cloudposse/terraform-aws-rds-cluster-instance-group.git?ref=master"
  cluster_size       = "2"
  namespace          = "eg"
  stage              = "dev"
  name               = "db"
  attributes         = ["reporting"]
  cluster_identifier = "eg-dev-db"
  db_port            = "5432"
  instance_type      = "db.r4.large"
  vpc_id             = "vpc-xxxxxxx"
  security_groups    = ["sg-xxxxxxxx"]
  subnets            = ["subnet-xxxxxxxx", "subnet-xxxxxxxx"]
  zone_id            = "Zxxxxxxxx"

  # enable monitoring every 30 seconds
  rds_monitoring_interval = "30"

  # reference iam role created above
  rds_monitoring_role_arn = "${aws_iam_role.enhanced_monitoring.arn}"
}
```






<!-- markdownlint-disable -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dns"></a> [dns](#module\_dns) | git::https://github.com/cloudposse/terraform-aws-route53-cluster-hostname.git | tags/0.2.5 |
| <a name="module_label"></a> [label](#module\_label) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.3.5 |

## Resources

| Name | Type |
|------|------|
| [aws_db_parameter_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_parameter_group) | resource |
| [aws_rds_cluster_endpoint.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_endpoint) | resource |
| [aws_rds_cluster_instance.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster_instance) | resource |
| [aws_security_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.allow_egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.allow_ingress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.allow_ingress_cidr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_rds_cluster.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/rds_cluster) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_allowed_cidr_blocks"></a> [allowed\_cidr\_blocks](#input\_allowed\_cidr\_blocks) | List of CIDR blocks allowed to access | `list` | `[]` | no |
| <a name="input_apply_immediately"></a> [apply\_immediately](#input\_apply\_immediately) | Specifies whether any cluster modifications are applied immediately, or during the next maintenance window | `string` | `"true"` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `1`) | `list` | <pre>[<br/>  "replicas"<br/>]</pre> | no |
| <a name="input_cluster_family"></a> [cluster\_family](#input\_cluster\_family) | The family of the DB cluster parameter group | `string` | `"aurora5.6"` | no |
| <a name="input_cluster_identifier"></a> [cluster\_identifier](#input\_cluster\_identifier) | The cluster identifier | `string` | n/a | yes |
| <a name="input_cluster_size"></a> [cluster\_size](#input\_cluster\_size) | Number of DB instances to create in the cluster | `string` | `"2"` | no |
| <a name="input_custom_endpoint_type"></a> [custom\_endpoint\_type](#input\_custom\_endpoint\_type) | The type of the endpoint. One of: READER, ANY | `string` | `"READER"` | no |
| <a name="input_db_port"></a> [db\_port](#input\_db\_port) | Database port | `string` | `"3306"` | no |
| <a name="input_db_subnet_group_name"></a> [db\_subnet\_group\_name](#input\_db\_subnet\_group\_name) | A DB subnet group to associate with this DB instance. NOTE: This must match the db\_subnet\_group\_name of the attached aws\_rds\_cluster. | `string` | `""` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `name`, `namespace`, `stage` and `attributes` | `string` | `"-"` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `string` | `"true"` | no |
| <a name="input_engine"></a> [engine](#input\_engine) | The name of the database engine to be used for this DB cluster. Valid values: `aurora`, `aurora-mysql`, `aurora-postgresql` | `string` | `"aurora"` | no |
| <a name="input_instance_parameters"></a> [instance\_parameters](#input\_instance\_parameters) | List of DB instance parameters to apply | `list` | `[]` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | Instance type to use | `string` | `"db.t2.small"` | no |
| <a name="input_name"></a> [name](#input\_name) | Name of the application | `string` | n/a | yes |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `eg` or `cp`) | `string` | n/a | yes |
| <a name="input_promotion_tier"></a> [promotion\_tier](#input\_promotion\_tier) | Failover Priority setting on instance level. The reader who has lower tier has higher priority to get promoted to writer (values can range from 0-15). | `string` | `"15"` | no |
| <a name="input_publicly_accessible"></a> [publicly\_accessible](#input\_publicly\_accessible) | Set to true if you want your cluster to be publicly accessible (such as via QuickSight) | `string` | `"false"` | no |
| <a name="input_rds_monitoring_interval"></a> [rds\_monitoring\_interval](#input\_rds\_monitoring\_interval) | Interval in seconds that metrics are collected, 0 to disable (values can only be 0, 1, 5, 10, 15, 30, 60) | `string` | `"0"` | no |
| <a name="input_rds_monitoring_role_arn"></a> [rds\_monitoring\_role\_arn](#input\_rds\_monitoring\_role\_arn) | The ARN for the IAM role that can send monitoring metrics to CloudWatch Logs | `string` | `""` | no |
| <a name="input_security_group_ids"></a> [security\_group\_ids](#input\_security\_group\_ids) | The IDs of the security groups from which to allow `ingress` traffic to the DB instances | `list` | `[]` | no |
| <a name="input_security_groups"></a> [security\_groups](#input\_security\_groups) | List of security groups to be allowed to connect to the DB instances | `list` | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `string` | n/a | yes |
| <a name="input_storage_encrypted"></a> [storage\_encrypted](#input\_storage\_encrypted) | Specifies whether the DB cluster is encrypted. The default is `false` for `provisioned` `engine_mode` and `true` for `serverless` `engine_mode` | `string` | `"true"` | no |
| <a name="input_subnets"></a> [subnets](#input\_subnets) | List of VPC subnet IDs | `list` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. map(`BusinessUnit`,`XYZ`) | `map` | `{}` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID to create the cluster in (e.g. `vpc-a22222ee`) | `string` | n/a | yes |
| <a name="input_zone_id"></a> [zone\_id](#input\_zone\_id) | Route53 parent zone ID. If provided (not empty), the module will create sub-domain DNS record for the cluster endpoint | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_endpoint"></a> [endpoint](#output\_endpoint) | The endpoint for the Aurora cluster, automatically load-balanced across replicas |
| <a name="output_hostname"></a> [hostname](#output\_hostname) | The DNS address for the endpoint of the Aurora cluster |
<!-- markdownlint-restore -->

