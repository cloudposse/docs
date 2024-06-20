---
title: mwaa
sidebar_label: mwaa
sidebar_class_name: command
description: |-
  Terraform module to provision Amazon Managed Workflows for Apache Airflow
custom_edit_url: https://github.com/cloudposse/terraform-aws-mwaa/blob/main/README.yaml
---

# Module: `mwaa`
Terraform module to provision Amazon Managed Workflows for Apache Airflow






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-mwaa/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-mwaa/tree/main/test).

```hcl
module "mwaa" {
  source = "cloudposse/mwaa/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  vpc_id                      = var.vpc_id
  subnet_ids                  = var.subnet_ids
  airflow_version             = "2.0.2"
  dag_s3_path                 = "dags"
  environment_class           = "mw1.small"
  min_workers                 = 1
  max_workers                 = 10
  webserver_access_mode       = "PRIVATE_ONLY"
  dag_processing_logs_enabled = true
  dag_processing_logs_level   = "INFO"
  name                        = "app"
  stage                       = "test"
  namespace                   = "eg"
  enabled                     = true
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-mwaa/) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_iam_label"></a> [iam\_label](#module\_iam\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_mwaa_iam_role"></a> [mwaa\_iam\_role](#module\_mwaa\_iam\_role) | cloudposse/iam-role/aws | 0.16.2 |
| <a name="module_mwaa_s3_bucket"></a> [mwaa\_s3\_bucket](#module\_mwaa\_s3\_bucket) | cloudposse/s3-bucket/aws | 4.0.0 |
| <a name="module_mwaa_security_group"></a> [mwaa\_security\_group](#module\_mwaa\_security\_group) | cloudposse/security-group/aws | 1.0.1 |
| <a name="module_s3_label"></a> [s3\_label](#module\_s3\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_sg_label"></a> [sg\_label](#module\_sg\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_mwaa_environment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/mwaa_environment) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_security_group_rules"></a> [additional\_security\_group\_rules](#input\_additional\_security\_group\_rules) | A list of Security Group rule objects to add to the created security group, in addition to the ones<br/>this module normally creates. (To suppress the module's rules, set `create_security_group` to false<br/>and supply your own security group(s) via `associated_security_group_ids`.)<br/>The keys and values of the objects are fully compatible with the `aws_security_group_rule` resource, except<br/>for `security_group_id` which will be ignored, and the optional "key" which, if provided, must be unique and known at "plan" time.<br/>For more info see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule<br/>and https://github.com/cloudposse/terraform-aws-security-group. | `list(any)` | `[]` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_airflow_configuration_options"></a> [airflow\_configuration\_options](#input\_airflow\_configuration\_options) | The Airflow override options | `any` | `null` | no |
| <a name="input_airflow_version"></a> [airflow\_version](#input\_airflow\_version) | Airflow version of the MWAA environment, will be set by default to the latest version that MWAA supports. | `string` | `""` | no |
| <a name="input_allow_all_egress"></a> [allow\_all\_egress](#input\_allow\_all\_egress) | If `true`, the created security group will allow egress on all ports and protocols to all IP addresses.<br/>If this is false and no egress rules are otherwise specified, then no egress will be allowed. | `bool` | `true` | no |
| <a name="input_allowed_cidr_blocks"></a> [allowed\_cidr\_blocks](#input\_allowed\_cidr\_blocks) | A list of IPv4 CIDRs to allow access to the security group created by this module.<br/>The length of this list must be known at "plan" time. | `list(string)` | `[]` | no |
| <a name="input_allowed_security_group_ids"></a> [allowed\_security\_group\_ids](#input\_allowed\_security\_group\_ids) | A list of IDs of Security Groups to allow access to the security group created by this module.<br/>The length of this list must be known at "plan" time. | `list(string)` | `[]` | no |
| <a name="input_associated_security_group_ids"></a> [associated\_security\_group\_ids](#input\_associated\_security\_group\_ids) | A list of IDs of Security Groups to associate the created resource with, in addition to the created security group.<br/>These security groups will not be modified and, if `create_security_group` is `false`, must have rules providing the desired access. | `list(string)` | `[]` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_iam_role"></a> [create\_iam\_role](#input\_create\_iam\_role) | Enabling or disabling the creatation of a default IAM Role for AWS MWAA | `bool` | `true` | no |
| <a name="input_create_s3_bucket"></a> [create\_s3\_bucket](#input\_create\_s3\_bucket) | Enabling or disabling the creatation of an S3 bucket for AWS MWAA | `bool` | `true` | no |
| <a name="input_create_security_group"></a> [create\_security\_group](#input\_create\_security\_group) | Set `true` to create and configure a new security group. If false, `associated_security_group_ids` must be provided. | `bool` | `true` | no |
| <a name="input_dag_processing_logs_enabled"></a> [dag\_processing\_logs\_enabled](#input\_dag\_processing\_logs\_enabled) | Enabling or disabling the collection of logs for processing DAGs | `bool` | `false` | no |
| <a name="input_dag_processing_logs_level"></a> [dag\_processing\_logs\_level](#input\_dag\_processing\_logs\_level) | DAG processing logging level. Valid values: CRITICAL, ERROR, WARNING, INFO, DEBUG | `string` | `"INFO"` | no |
| <a name="input_dag_s3_path"></a> [dag\_s3\_path](#input\_dag\_s3\_path) | The relative path to the DAG folder on your Amazon S3 storage bucket. | `string` | `"dags"` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_environment_class"></a> [environment\_class](#input\_environment\_class) | Environment class for the cluster. Possible options are mw1.small, mw1.medium, mw1.large. | `string` | `"mw1.small"` | no |
| <a name="input_execution_role_arn"></a> [execution\_role\_arn](#input\_execution\_role\_arn) | If `create_iam_role` is `false` then set this to the target MWAA execution role | `string` | `""` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kms_key"></a> [kms\_key](#input\_kms\_key) | The Amazon Resource Name (ARN) of your KMS key that you want to use for encryption. Will be set to the ARN of the managed KMS key aws/airflow by default. | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_max_workers"></a> [max\_workers](#input\_max\_workers) | The maximum number of workers that can be automatically scaled up. Value need to be between 1 and 25. | `number` | `10` | no |
| <a name="input_min_workers"></a> [min\_workers](#input\_min\_workers) | The minimum number of workers that you want to run in your environment. | `number` | `1` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_plugins_s3_object_version"></a> [plugins\_s3\_object\_version](#input\_plugins\_s3\_object\_version) | The plugins.zip file version you want to use. | `string` | `null` | no |
| <a name="input_plugins_s3_path"></a> [plugins\_s3\_path](#input\_plugins\_s3\_path) | The relative path to the plugins.zip file on your Amazon S3 storage bucket. For example, plugins.zip. If a relative path is provided in the request, then plugins\_s3\_object\_version is required | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS region | `string` | n/a | yes |
| <a name="input_requirements_s3_object_version"></a> [requirements\_s3\_object\_version](#input\_requirements\_s3\_object\_version) | The requirements.txt file version you | `string` | `null` | no |
| <a name="input_requirements_s3_path"></a> [requirements\_s3\_path](#input\_requirements\_s3\_path) | The relative path to the requirements.txt file on your Amazon S3 storage bucket. For example, requirements.txt. If a relative path is provided in the request, then requirements\_s3\_object\_version is required | `string` | `null` | no |
| <a name="input_scheduler_logs_enabled"></a> [scheduler\_logs\_enabled](#input\_scheduler\_logs\_enabled) | Enabling or disabling the collection of logs for the schedulers | `bool` | `false` | no |
| <a name="input_scheduler_logs_level"></a> [scheduler\_logs\_level](#input\_scheduler\_logs\_level) | Schedulers logging level. Valid values: CRITICAL, ERROR, WARNING, INFO, DEBUG | `string` | `"INFO"` | no |
| <a name="input_security_group_create_before_destroy"></a> [security\_group\_create\_before\_destroy](#input\_security\_group\_create\_before\_destroy) | Set `true` to enable Terraform `create_before_destroy` behavior on the created security group.<br/>We only recommend setting this `false` if you are upgrading this module and need to keep<br/>the existing security group from being replaced.<br/>Note that changing this value will always cause the security group to be replaced. | `bool` | `true` | no |
| <a name="input_security_group_create_timeout"></a> [security\_group\_create\_timeout](#input\_security\_group\_create\_timeout) | How long to wait for the security group to be created. | `string` | `"10m"` | no |
| <a name="input_security_group_delete_timeout"></a> [security\_group\_delete\_timeout](#input\_security\_group\_delete\_timeout) | How long to retry on `DependencyViolation` errors during security group deletion from<br/>lingering ENIs left by certain AWS services such as Elastic Load Balancing. | `string` | `"15m"` | no |
| <a name="input_security_group_description"></a> [security\_group\_description](#input\_security\_group\_description) | Security Group for AWS MWAA | `string` | `"Managed by Terraform"` | no |
| <a name="input_security_group_name"></a> [security\_group\_name](#input\_security\_group\_name) | The name to assign to the created security group. Must be unique within the VPC.<br/>If not provided, will be derived from the `null-label.context` passed in.<br/>If `create_before_destroy` is true, will be used as a name prefix. | `list(string)` | `[]` | no |
| <a name="input_source_bucket_arn"></a> [source\_bucket\_arn](#input\_source\_bucket\_arn) | If `create_s3_bucket` is `false` then set this to the Amazon Resource Name (ARN) of your Amazon S3 storage bucket. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_startup_script_s3_object_version"></a> [startup\_script\_s3\_object\_version](#input\_startup\_script\_s3\_object\_version) | The version of the startup shell script you want to use. You must specify the version ID that Amazon S3 assigns to the file every time you update the script. | `string` | `null` | no |
| <a name="input_startup_script_s3_path"></a> [startup\_script\_s3\_path](#input\_startup\_script\_s3\_path) | The relative path to the script hosted in your bucket. The script runs as your environment starts before starting the Apache Airflow process. | `string` | `null` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | The private subnet IDs in which the environment should be created. MWAA requires two subnets | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_task_logs_enabled"></a> [task\_logs\_enabled](#input\_task\_logs\_enabled) | Enabling or disabling the collection of logs for DAG tasks | `bool` | `false` | no |
| <a name="input_task_logs_level"></a> [task\_logs\_level](#input\_task\_logs\_level) | DAG tasks logging level. Valid values: CRITICAL, ERROR, WARNING, INFO, DEBUG | `string` | `"INFO"` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The ID of the VPC where the Security Group will be created. | `string` | n/a | yes |
| <a name="input_webserver_access_mode"></a> [webserver\_access\_mode](#input\_webserver\_access\_mode) | Specifies whether the webserver should be accessible over the internet or via your specified VPC. Possible options: PRIVATE\_ONLY (default) and PUBLIC\_ONLY. | `string` | `"PRIVATE_ONLY"` | no |
| <a name="input_webserver_logs_enabled"></a> [webserver\_logs\_enabled](#input\_webserver\_logs\_enabled) | Enabling or disabling the collection of logs for the webservers | `bool` | `false` | no |
| <a name="input_webserver_logs_level"></a> [webserver\_logs\_level](#input\_webserver\_logs\_level) | Webserver logging level. Valid values: CRITICAL, ERROR, WARNING, INFO, DEBUG | `string` | `"INFO"` | no |
| <a name="input_weekly_maintenance_window_start"></a> [weekly\_maintenance\_window\_start](#input\_weekly\_maintenance\_window\_start) | Specifies the start date for the weekly maintenance window. | `string` | `null` | no |
| <a name="input_worker_logs_enabled"></a> [worker\_logs\_enabled](#input\_worker\_logs\_enabled) | Enabling or disabling the collection of logs for the workers | `bool` | `false` | no |
| <a name="input_worker_logs_level"></a> [worker\_logs\_level](#input\_worker\_logs\_level) | Workers logging level. Valid values: CRITICAL, ERROR, WARNING, INFO, DEBUG | `string` | `"INFO"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | The ARN of the Amazon MWAA Environment |
| <a name="output_created_at"></a> [created\_at](#output\_created\_at) | The Created At date of the Amazon MWAA Environment |
| <a name="output_execution_role_arn"></a> [execution\_role\_arn](#output\_execution\_role\_arn) | IAM Role ARN for Amazon MWAA Execution Role |
| <a name="output_logging_configuration"></a> [logging\_configuration](#output\_logging\_configuration) | The Logging Configuration of the Amazon MWAA Environment |
| <a name="output_s3_bucket_arn"></a> [s3\_bucket\_arn](#output\_s3\_bucket\_arn) | ARN of the S3 bucket |
| <a name="output_security_group_arn"></a> [security\_group\_arn](#output\_security\_group\_arn) | The ARN of the created security group |
| <a name="output_security_group_id"></a> [security\_group\_id](#output\_security\_group\_id) | The ID of the created security group |
| <a name="output_security_group_name"></a> [security\_group\_name](#output\_security\_group\_name) | The name of the created security group |
| <a name="output_service_role_arn"></a> [service\_role\_arn](#output\_service\_role\_arn) | The Service Role ARN of the Amazon MWAA Environment |
| <a name="output_status"></a> [status](#output\_status) | The status of the Amazon MWAA Environment |
| <a name="output_tags_all"></a> [tags\_all](#output\_tags\_all) | A map of tags assigned to the resource, including those inherited from the provider for the Amazon MWAA Environment |
| <a name="output_webserver_url"></a> [webserver\_url](#output\_webserver\_url) | The webserver URL of the Amazon MWAA Environment |
<!-- markdownlint-restore -->

