---
title: aws-dynamodb-autoscaler
sidebar_label: aws-dynamodb-autoscaler
sidebar_class_name: command
description: |-
  Terraform module to provision DynamoDB autoscaler.

  Autoscaler scales up/down the provisioned OPS for a DynamoDB table based on the load.
tags:
  - aws
  - terraform
  - terraform-modules
  - databases
  - autoscaling
  - dynamodb
  - dynamodb-table
  - dynamodb-database
  - iops
  - table

custom_edit_url: https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler/edit/master/README.md
---

# Component: `aws-dynamodb-autoscaler`
Terraform module to provision DynamoDB autoscaler.

Autoscaler scales up/down the provisioned OPS for a DynamoDB table based on the load.






## Usage

```hcl
module "dynamodb_autoscaler" {
  source = "cloudposse/dynamodb-autoscaler/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace                    = "eg"
  stage                        = "dev"
  name                         = "cluster"
  dynamodb_table_name          = "eg-dev-cluster-terraform-state-lock"
  dynamodb_indexes             = ["first-index", "second-index"]
  dynamodb_table_arn           = "arn:aws:dynamodb:us-east-1:123456789012:table/eg-dev-cluster-terraform-state-lock"
  autoscale_write_target       = 50
  autoscale_read_target        = 50
  autoscale_min_read_capacity  = 5
  autoscale_max_read_capacity  = 20
  autoscale_min_write_capacity = 5
  autoscale_max_write_capacity = 20
}
```






<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```
<!-- markdownlint-restore -->
<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_appautoscaling_policy.read_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.read_policy_index](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.write_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.write_policy_index](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_target.read_target](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_appautoscaling_target.read_target_index](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_appautoscaling_target.write_target](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_appautoscaling_target.write_target_index](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_autoscale_max_read_capacity"></a> [autoscale\_max\_read\_capacity](#input\_autoscale\_max\_read\_capacity) | DynamoDB autoscaling max read capacity | `number` | `20` | no |
| <a name="input_autoscale_max_read_capacity_index"></a> [autoscale\_max\_read\_capacity\_index](#input\_autoscale\_max\_read\_capacity\_index) | DynamoDB autoscaling max read capacity of the index | `number` | `null` | no |
| <a name="input_autoscale_max_write_capacity"></a> [autoscale\_max\_write\_capacity](#input\_autoscale\_max\_write\_capacity) | DynamoDB autoscaling max write capacity | `number` | `20` | no |
| <a name="input_autoscale_max_write_capacity_index"></a> [autoscale\_max\_write\_capacity\_index](#input\_autoscale\_max\_write\_capacity\_index) | DynamoDB autoscaling max write capacity of the index | `number` | `null` | no |
| <a name="input_autoscale_min_read_capacity"></a> [autoscale\_min\_read\_capacity](#input\_autoscale\_min\_read\_capacity) | DynamoDB autoscaling min read capacity | `number` | `5` | no |
| <a name="input_autoscale_min_read_capacity_index"></a> [autoscale\_min\_read\_capacity\_index](#input\_autoscale\_min\_read\_capacity\_index) | DynamoDB autoscaling min read capacity of the index | `number` | `null` | no |
| <a name="input_autoscale_min_write_capacity"></a> [autoscale\_min\_write\_capacity](#input\_autoscale\_min\_write\_capacity) | DynamoDB autoscaling min write capacity | `number` | `5` | no |
| <a name="input_autoscale_min_write_capacity_index"></a> [autoscale\_min\_write\_capacity\_index](#input\_autoscale\_min\_write\_capacity\_index) | DynamoDB autoscaling min write capacity of the index | `number` | `null` | no |
| <a name="input_autoscale_read_target"></a> [autoscale\_read\_target](#input\_autoscale\_read\_target) | The target value for DynamoDB read autoscaling | `number` | `50` | no |
| <a name="input_autoscale_read_target_index"></a> [autoscale\_read\_target\_index](#input\_autoscale\_read\_target\_index) | The target value for DynamoDB read autoscaling of the index | `number` | `null` | no |
| <a name="input_autoscale_write_target"></a> [autoscale\_write\_target](#input\_autoscale\_write\_target) | The target value for DynamoDB write autoscaling | `number` | `50` | no |
| <a name="input_autoscale_write_target_index"></a> [autoscale\_write\_target\_index](#input\_autoscale\_write\_target\_index) | The target value for DynamoDB write autoscaling of the index | `number` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_dynamodb_indexes"></a> [dynamodb\_indexes](#input\_dynamodb\_indexes) | List of DynamoDB indexes | `list(string)` | `[]` | no |
| <a name="input_dynamodb_table_arn"></a> [dynamodb\_table\_arn](#input\_dynamodb\_table\_arn) | DynamoDB table ARN | `string` | n/a | yes |
| <a name="input_dynamodb_table_name"></a> [dynamodb\_table\_name](#input\_dynamodb\_table\_name) | DynamoDB table name | `string` | n/a | yes |
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

| Name | Description |
|------|-------------|
| <a name="output_appautoscaling_read_policy_arn"></a> [appautoscaling\_read\_policy\_arn](#output\_appautoscaling\_read\_policy\_arn) | Appautoscaling read policy ARN |
| <a name="output_appautoscaling_write_policy_arn"></a> [appautoscaling\_write\_policy\_arn](#output\_appautoscaling\_write\_policy\_arn) | Appautoscaling write policy ARN |
<!-- markdownlint-restore -->


