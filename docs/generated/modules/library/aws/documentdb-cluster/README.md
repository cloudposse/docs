---
title: documentdb-cluster
sidebar_label: documentdb-cluster
sidebar_class_name: command
description: |-
  Terraform module to provision an [`Amazon DocumentDB`](https://aws.amazon.com/documentdb/) cluster.
tags:
  - aws
  - terraform
  - terraform-modules
  - databases
  - documentdb
  - mongodb
  - cluster

custom_edit_url: https://github.com/cloudposse/terraform-aws-documentdb-cluster/blob/main/README.yaml
---

# Module: `documentdb-cluster`
Terraform module to provision an [`Amazon DocumentDB`](https://aws.amazon.com/documentdb/) cluster.






## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-documentdb-cluster/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-documentdb-cluster/tree/main/test).

```hcl
module "documentdb_cluster" {
  source = "cloudposse/documentdb-cluster/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  namespace               = "eg"
  stage                   = "testing"
  name                    = "docdb"
  cluster_size            = 3
  master_username         = "admin1"
  master_password         = "Test123456789"
  instance_class          = "db.r4.large"
  vpc_id                  = "vpc-xxxxxxxx"
  subnet_ids              = ["subnet-xxxxxxxx", "subnet-yyyyyyyy"]
  allowed_security_groups = ["sg-xxxxxxxx"]
  zone_id                 = "Zxxxxxxxx"
}
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.3 |
| <a name="requirement_random"></a> [random](#requirement\_random) | >= 1.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |
| <a name="provider_random"></a> [random](#provider\_random) | >= 1.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dns_master"></a> [dns\_master](#module\_dns\_master) | cloudposse/route53-cluster-hostname/aws | 0.12.2 |
| <a name="module_dns_replicas"></a> [dns\_replicas](#module\_dns\_replicas) | cloudposse/route53-cluster-hostname/aws | 0.12.2 |
| <a name="module_ssm_write_db_password"></a> [ssm\_write\_db\_password](#module\_ssm\_write\_db\_password) | cloudposse/ssm-parameter-store/aws | 0.11.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_docdb_cluster.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/docdb_cluster) | resource |
| [aws_docdb_cluster_instance.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/docdb_cluster_instance) | resource |
| [aws_docdb_cluster_parameter_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/docdb_cluster_parameter_group) | resource |
| [aws_docdb_subnet_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/docdb_subnet_group) | resource |
| [aws_security_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.allow_ingress_from_self](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_cidr_blocks](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_security_groups](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [random_password.password](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/password) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_allow_ingress_from_self"></a> [allow\_ingress\_from\_self](#input\_allow\_ingress\_from\_self) | Adds the Document DB security group itself as a source for ingress rules. Useful when this security group will be shared with applications. | `bool` | `false` | no |
| <a name="input_allowed_cidr_blocks"></a> [allowed\_cidr\_blocks](#input\_allowed\_cidr\_blocks) | List of CIDR blocks to be allowed to connect to the DocumentDB cluster | `list(string)` | `[]` | no |
| <a name="input_allowed_egress_cidr_blocks"></a> [allowed\_egress\_cidr\_blocks](#input\_allowed\_egress\_cidr\_blocks) | List of CIDR blocks to be allowed to send traffic outside of the DocumentDB cluster | `list(string)` | <pre>[<br/>  "0.0.0.0/0"<br/>]</pre> | no |
| <a name="input_allowed_security_groups"></a> [allowed\_security\_groups](#input\_allowed\_security\_groups) | List of existing Security Groups to be allowed to connect to the DocumentDB cluster | `list(string)` | `[]` | no |
| <a name="input_apply_immediately"></a> [apply\_immediately](#input\_apply\_immediately) | Specifies whether any cluster modifications are applied immediately, or during the next maintenance window | `bool` | `true` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_auto_minor_version_upgrade"></a> [auto\_minor\_version\_upgrade](#input\_auto\_minor\_version\_upgrade) | Specifies whether any minor engine upgrades will be applied automatically to the DB instance during the maintenance window or not | `bool` | `true` | no |
| <a name="input_ca_cert_identifier"></a> [ca\_cert\_identifier](#input\_ca\_cert\_identifier) | The identifier of the CA certificate for the DB instance | `string` | `null` | no |
| <a name="input_cluster_dns_name"></a> [cluster\_dns\_name](#input\_cluster\_dns\_name) | Name of the cluster CNAME record to create in the parent DNS zone specified by `zone_id`. If left empty, the name will be auto-asigned using the format `master.var.name` | `string` | `""` | no |
| <a name="input_cluster_family"></a> [cluster\_family](#input\_cluster\_family) | The family of the DocumentDB cluster parameter group. For more details, see https://docs.aws.amazon.com/documentdb/latest/developerguide/db-cluster-parameter-group-create.html | `string` | `"docdb3.6"` | no |
| <a name="input_cluster_parameters"></a> [cluster\_parameters](#input\_cluster\_parameters) | List of DB parameters to apply | <pre>list(object({<br/>    apply_method = string<br/>    name         = string<br/>    value        = string<br/>  }))</pre> | `[]` | no |
| <a name="input_cluster_size"></a> [cluster\_size](#input\_cluster\_size) | Number of DB instances to create in the cluster | `number` | `3` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_db_port"></a> [db\_port](#input\_db\_port) | DocumentDB port | `number` | `27017` | no |
| <a name="input_deletion_protection"></a> [deletion\_protection](#input\_deletion\_protection) | A value that indicates whether the DB cluster has deletion protection enabled | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_egress_from_port"></a> [egress\_from\_port](#input\_egress\_from\_port) | [from\_port]DocumentDB initial port range for egress (e.g. `0`) | `number` | `0` | no |
| <a name="input_egress_protocol"></a> [egress\_protocol](#input\_egress\_protocol) | DocumentDB protocol for egress (e.g. `-1`, `tcp`) | `string` | `"-1"` | no |
| <a name="input_egress_to_port"></a> [egress\_to\_port](#input\_egress\_to\_port) | [to\_port]DocumentDB initial port range for egress (e.g. `65535`) | `number` | `0` | no |
| <a name="input_enable_performance_insights"></a> [enable\_performance\_insights](#input\_enable\_performance\_insights) | Specifies whether to enable Performance Insights for the DB Instance. | `bool` | `false` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_enabled_cloudwatch_logs_exports"></a> [enabled\_cloudwatch\_logs\_exports](#input\_enabled\_cloudwatch\_logs\_exports) | List of log types to export to cloudwatch. The following log types are supported: `audit`, `error`, `general`, `slowquery` | `list(string)` | `[]` | no |
| <a name="input_engine"></a> [engine](#input\_engine) | The name of the database engine to be used for this DB cluster. Defaults to `docdb`. Valid values: `docdb` | `string` | `"docdb"` | no |
| <a name="input_engine_version"></a> [engine\_version](#input\_engine\_version) | The version number of the database engine to use | `string` | `"3.6.0"` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_external_security_group_id_list"></a> [external\_security\_group\_id\_list](#input\_external\_security\_group\_id\_list) | List of external security group IDs to attach to the Document DB | `list(string)` | `[]` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_instance_class"></a> [instance\_class](#input\_instance\_class) | The instance class to use. For more details, see https://docs.aws.amazon.com/documentdb/latest/developerguide/db-instance-classes.html#db-instance-class-specs | `string` | `"db.r4.large"` | no |
| <a name="input_kms_key_id"></a> [kms\_key\_id](#input\_kms\_key\_id) | The ARN for the KMS encryption key. When specifying `kms_key_id`, `storage_encrypted` needs to be set to `true` | `string` | `""` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_master_password"></a> [master\_password](#input\_master\_password) | (Required unless a snapshot\_identifier is provided) Password for the master DB user. Note that this may show up in logs, and it will be stored in the state file. Please refer to the DocumentDB Naming Constraints | `string` | `""` | no |
| <a name="input_master_username"></a> [master\_username](#input\_master\_username) | (Required unless a snapshot\_identifier is provided) Username for the master DB user | `string` | `"admin1"` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_preferred_backup_window"></a> [preferred\_backup\_window](#input\_preferred\_backup\_window) | Daily time range during which the backups happen | `string` | `"07:00-09:00"` | no |
| <a name="input_preferred_maintenance_window"></a> [preferred\_maintenance\_window](#input\_preferred\_maintenance\_window) | The window to perform maintenance in. Syntax: `ddd:hh24:mi-ddd:hh24:mi`. | `string` | `"Mon:22:00-Mon:23:00"` | no |
| <a name="input_reader_dns_name"></a> [reader\_dns\_name](#input\_reader\_dns\_name) | Name of the reader endpoint CNAME record to create in the parent DNS zone specified by `zone_id`. If left empty, the name will be auto-asigned using the format `replicas.var.name` | `string` | `""` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_retention_period"></a> [retention\_period](#input\_retention\_period) | Number of days to retain backups for | `number` | `5` | no |
| <a name="input_skip_final_snapshot"></a> [skip\_final\_snapshot](#input\_skip\_final\_snapshot) | Determines whether a final DB snapshot is created before the DB cluster is deleted | `bool` | `true` | no |
| <a name="input_snapshot_identifier"></a> [snapshot\_identifier](#input\_snapshot\_identifier) | Specifies whether or not to create this cluster from a snapshot. You can use either the name or ARN when specifying a DB cluster snapshot, or the ARN when specifying a DB snapshot | `string` | `""` | no |
| <a name="input_ssm_parameter_enabled"></a> [ssm\_parameter\_enabled](#input\_ssm\_parameter\_enabled) | Whether an SSM parameter store value is created to store the database password. | `bool` | `false` | no |
| <a name="input_ssm_parameter_path_prefix"></a> [ssm\_parameter\_path\_prefix](#input\_ssm\_parameter\_path\_prefix) | The path prefix for the created SSM parameter e.g. '/docdb/master-password/dev'. `ssm_parameter_enabled` must be set to `true` for this to take affect. | `string` | `"/docdb/master-password/"` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_storage_encrypted"></a> [storage\_encrypted](#input\_storage\_encrypted) | Specifies whether the DB cluster is encrypted | `bool` | `true` | no |
| <a name="input_storage_type"></a> [storage\_type](#input\_storage\_type) | The storage type to associate with the DB cluster. Valid values: standard, iopt1 | `string` | `"standard"` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | List of VPC subnet IDs to place DocumentDB instances in | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID to create the cluster in (e.g. `vpc-a22222ee`) | `string` | n/a | yes |
| <a name="input_zone_id"></a> [zone\_id](#input\_zone\_id) | Route53 parent zone ID. If provided (not empty), the module will create sub-domain DNS records for the DocumentDB master and replicas | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | Amazon Resource Name (ARN) of the cluster |
| <a name="output_cluster_name"></a> [cluster\_name](#output\_cluster\_name) | Cluster Identifier |
| <a name="output_endpoint"></a> [endpoint](#output\_endpoint) | Endpoint of the DocumentDB cluster |
| <a name="output_master_host"></a> [master\_host](#output\_master\_host) | DB master hostname |
| <a name="output_master_password"></a> [master\_password](#output\_master\_password) | Password for the master DB user |
| <a name="output_master_username"></a> [master\_username](#output\_master\_username) | Username for the master DB user |
| <a name="output_reader_endpoint"></a> [reader\_endpoint](#output\_reader\_endpoint) | A read-only endpoint of the DocumentDB cluster, automatically load-balanced across replicas |
| <a name="output_replicas_host"></a> [replicas\_host](#output\_replicas\_host) | DB replicas hostname |
| <a name="output_security_group_arn"></a> [security\_group\_arn](#output\_security\_group\_arn) | ARN of the DocumentDB cluster Security Group |
| <a name="output_security_group_id"></a> [security\_group\_id](#output\_security\_group\_id) | ID of the DocumentDB cluster Security Group |
| <a name="output_security_group_name"></a> [security\_group\_name](#output\_security\_group\_name) | Name of the DocumentDB cluster Security Group |
<!-- markdownlint-restore -->

