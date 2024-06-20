---
title: rds-db-proxy
sidebar_label: rds-db-proxy
sidebar_class_name: command
description: |-
  Terraform module to provision an Amazon [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) for MySQL or Postgres.
tags:
  - aws
  - terraform
  - terraform-modules
  - databases
  - rds
  - rds-database
  - proxy
  - proxy-pool
  - database-proxy
  - connection
  - connections
  - pool
  - connection-pool
  - aurora
  - mysql
  - postgres
  - cluster

custom_edit_url: https://github.com/cloudposse/terraform-aws-rds-db-proxy/blob/main/README.yaml
---

# Module: `rds-db-proxy`
Terraform module to provision an Amazon [RDS Proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) for MySQL or Postgres.






## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-rds-db-proxy/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-rds-db-proxy/tree/main/test).

```hcl
module "vpc" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  cidr_block = "172.16.0.0/16"

  context = module.this.context
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  availability_zones   = var.availability_zones
  vpc_id               = module.vpc.vpc_id
  igw_id               = module.vpc.igw_id
  cidr_block           = module.vpc.vpc_cidr_block
  nat_gateway_enabled  = false
  nat_instance_enabled = false

  context = module.this.context
}

resource "random_password" "admin_password" {
  count  = var.database_password == "" || var.database_password == null ? 1 : 0
  length           = 33
  special          = false
  override_special = "!#$%^&*()<>-_"
}

locals {
  database_password = var.database_password != "" && var.database_password != null ? var.database_password : join("", random_password.admin_password.*.result)

  username_password = {
    username = var.database_user
    password = local.database_password
  }

  auth = [
    {
      auth_scheme = "SECRETS"
      description = "Access the database instance using username and password from AWS Secrets Manager"
      iam_auth    = "DISABLED"
      secret_arn  = aws_secretsmanager_secret.rds_username_and_password.arn
    }
  ]
}

module "rds_instance" {
  source  = "cloudposse/rds/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  database_name       = var.database_name
  database_user       = var.database_user
  database_password   = local.database_password
  database_port       = var.database_port
  multi_az            = var.multi_az
  storage_type        = var.storage_type
  allocated_storage   = var.allocated_storage
  storage_encrypted   = var.storage_encrypted
  engine              = var.engine
  engine_version      = var.engine_version
  instance_class      = var.instance_class
  db_parameter_group  = var.db_parameter_group
  publicly_accessible = var.publicly_accessible
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.subnets.private_subnet_ids
  security_group_ids  = [module.vpc.vpc_default_security_group_id]
  apply_immediately   = var.apply_immediately

  context = module.this.context
}

resource "aws_secretsmanager_secret" "rds_username_and_password" {
  name                    = module.this.id
  description             = "RDS username and password"
  recovery_window_in_days = 0
  tags                    = module.this.tags
}

resource "aws_secretsmanager_secret_version" "rds_username_and_password" {
  secret_id     = aws_secretsmanager_secret.rds_username_and_password.id
  secret_string = jsonencode(local.username_password)
}

module "rds_proxy" {
  source  = "cloudposse/rds-db-proxy/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  db_instance_identifier = module.rds_instance.instance_id
  auth                   = local.auth
  vpc_security_group_ids = [module.vpc.vpc_default_security_group_id]
  vpc_subnet_ids         = module.subnets.public_subnet_ids

  debug_logging                = var.debug_logging
  engine_family                = var.engine_family
  idle_client_timeout          = var.idle_client_timeout
  require_tls                  = var.require_tls
  connection_borrow_timeout    = var.connection_borrow_timeout
  init_query                   = var.init_query
  max_connections_percent      = var.max_connections_percent
  max_idle_connections_percent = var.max_idle_connections_percent
  session_pinning_filters      = var.session_pinning_filters
  existing_iam_role_arn        = var.existing_iam_role_arn

  context = module.this.context
}
```




## Examples

Review the [complete example](https://github.com/cloudposse/terraform-aws-rds-db-proxy/tree/main/examples/complete) to see how to use this module.



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.1.15 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.1.15 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_role_label"></a> [role\_label](#module\_role\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_db_proxy.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_proxy) | resource |
| [aws_db_proxy_default_target_group.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_proxy_default_target_group) | resource |
| [aws_db_proxy_target.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/db_proxy_target) | resource |
| [aws_iam_policy.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_kms_key.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/kms_key) | data source |
| [aws_region.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_auth"></a> [auth](#input\_auth) | Configuration blocks with authorization mechanisms to connect to the associated database instances or clusters | <pre>list(object({<br/>    auth_scheme = string<br/>    description = string<br/>    iam_auth    = string<br/>    secret_arn  = string<br/>  }))</pre> | n/a | yes |
| <a name="input_connection_borrow_timeout"></a> [connection\_borrow\_timeout](#input\_connection\_borrow\_timeout) | The number of seconds for a proxy to wait for a connection to become available in the connection pool. Only applies when the proxy has opened its maximum number of connections and all connections are busy with client sessions | `number` | `120` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_db_cluster_identifier"></a> [db\_cluster\_identifier](#input\_db\_cluster\_identifier) | DB cluster identifier. Either `db_instance_identifier` or `db_cluster_identifier` should be specified and both should not be specified together | `string` | `null` | no |
| <a name="input_db_instance_identifier"></a> [db\_instance\_identifier](#input\_db\_instance\_identifier) | DB instance identifier. Either `db_instance_identifier` or `db_cluster_identifier` should be specified and both should not be specified together | `string` | `null` | no |
| <a name="input_debug_logging"></a> [debug\_logging](#input\_debug\_logging) | Whether the proxy includes detailed information about SQL statements in its logs | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_engine_family"></a> [engine\_family](#input\_engine\_family) | The kinds of databases that the proxy can connect to. This value determines which database network protocol the proxy recognizes when it interprets network traffic to and from the database. The engine family applies to MySQL and PostgreSQL for both RDS and Aurora. Valid values are MYSQL and POSTGRESQL | `string` | `"MYSQL"` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_existing_iam_role_arn"></a> [existing\_iam\_role\_arn](#input\_existing\_iam\_role\_arn) | The ARN of an existing IAM role that the proxy can use to access secrets in AWS Secrets Manager. If not provided, the module will create a role to access secrets in Secrets Manager | `string` | `null` | no |
| <a name="input_iam_role_attributes"></a> [iam\_role\_attributes](#input\_iam\_role\_attributes) | Additional attributes to add to the ID of the IAM role that the proxy uses to access secrets in AWS Secrets Manager | `list(string)` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_idle_client_timeout"></a> [idle\_client\_timeout](#input\_idle\_client\_timeout) | The number of seconds that a connection to the proxy can be inactive before the proxy disconnects it | `number` | `1800` | no |
| <a name="input_init_query"></a> [init\_query](#input\_init\_query) | One or more SQL statements for the proxy to run when opening each new database connection | `string` | `null` | no |
| <a name="input_kms_key_id"></a> [kms\_key\_id](#input\_kms\_key\_id) | The ARN or Id of the AWS KMS customer master key (CMK) to encrypt the secret values in the versions stored in secrets. If you don't specify this value, then Secrets Manager defaults to using the AWS account's default CMK (the one named `aws/secretsmanager`) | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_max_connections_percent"></a> [max\_connections\_percent](#input\_max\_connections\_percent) | The maximum size of the connection pool for each target in a target group | `number` | `100` | no |
| <a name="input_max_idle_connections_percent"></a> [max\_idle\_connections\_percent](#input\_max\_idle\_connections\_percent) | Controls how actively the proxy closes idle database connections in the connection pool. A high value enables the proxy to leave a high percentage of idle connections open. A low value causes the proxy to close idle client connections and return the underlying database connections to the connection pool | `number` | `50` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_proxy_create_timeout"></a> [proxy\_create\_timeout](#input\_proxy\_create\_timeout) | Proxy creation timeout | `string` | `"30m"` | no |
| <a name="input_proxy_delete_timeout"></a> [proxy\_delete\_timeout](#input\_proxy\_delete\_timeout) | Proxy delete timeout | `string` | `"60m"` | no |
| <a name="input_proxy_update_timeout"></a> [proxy\_update\_timeout](#input\_proxy\_update\_timeout) | Proxy update timeout | `string` | `"30m"` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_require_tls"></a> [require\_tls](#input\_require\_tls) | A Boolean parameter that specifies whether Transport Layer Security (TLS) encryption is required for connections to the proxy. By enabling this setting, you can enforce encrypted TLS connections to the proxy | `bool` | `false` | no |
| <a name="input_session_pinning_filters"></a> [session\_pinning\_filters](#input\_session\_pinning\_filters) | Each item in the list represents a class of SQL operations that normally cause all later statements in a session using a proxy to be pinned to the same underlying database connection | `list(string)` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_security_group_ids"></a> [vpc\_security\_group\_ids](#input\_vpc\_security\_group\_ids) | One or more VPC security group IDs to associate with the proxy | `set(string)` | n/a | yes |
| <a name="input_vpc_subnet_ids"></a> [vpc\_subnet\_ids](#input\_vpc\_subnet\_ids) | One or more VPC subnet IDs to associate with the proxy | `set(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_proxy_arn"></a> [proxy\_arn](#output\_proxy\_arn) | Proxy ARN |
| <a name="output_proxy_default_target_group_arn"></a> [proxy\_default\_target\_group\_arn](#output\_proxy\_default\_target\_group\_arn) | The Amazon Resource Name (ARN) representing the default target group |
| <a name="output_proxy_default_target_group_name"></a> [proxy\_default\_target\_group\_name](#output\_proxy\_default\_target\_group\_name) | The name of the default target group |
| <a name="output_proxy_endpoint"></a> [proxy\_endpoint](#output\_proxy\_endpoint) | Proxy endpoint |
| <a name="output_proxy_iam_role_arn"></a> [proxy\_iam\_role\_arn](#output\_proxy\_iam\_role\_arn) | The ARN of the IAM role that the proxy uses to access secrets in AWS Secrets Manager |
| <a name="output_proxy_id"></a> [proxy\_id](#output\_proxy\_id) | Proxy ID |
| <a name="output_proxy_target_endpoint"></a> [proxy\_target\_endpoint](#output\_proxy\_target\_endpoint) | Hostname for the target RDS DB Instance. Only returned for `RDS_INSTANCE` type |
| <a name="output_proxy_target_id"></a> [proxy\_target\_id](#output\_proxy\_target\_id) | Identifier of `db_proxy_name`, `target_group_name`, `target type` (e.g. `RDS_INSTANCE` or `TRACKED_CLUSTER`), and resource identifier separated by forward slashes (`/`) |
| <a name="output_proxy_target_port"></a> [proxy\_target\_port](#output\_proxy\_target\_port) | Port for the target RDS DB instance or Aurora DB cluster |
| <a name="output_proxy_target_rds_resource_id"></a> [proxy\_target\_rds\_resource\_id](#output\_proxy\_target\_rds\_resource\_id) | Identifier representing the DB instance or DB cluster target |
| <a name="output_proxy_target_target_arn"></a> [proxy\_target\_target\_arn](#output\_proxy\_target\_target\_arn) | Amazon Resource Name (ARN) for the DB instance or DB cluster |
| <a name="output_proxy_target_tracked_cluster_id"></a> [proxy\_target\_tracked\_cluster\_id](#output\_proxy\_target\_tracked\_cluster\_id) | DB Cluster identifier for the DB instance target. Not returned unless manually importing an `RDS_INSTANCE` target that is part of a DB cluster |
| <a name="output_proxy_target_type"></a> [proxy\_target\_type](#output\_proxy\_target\_type) | Type of target. e.g. `RDS_INSTANCE` or `TRACKED_CLUSTER` |
<!-- markdownlint-restore -->

