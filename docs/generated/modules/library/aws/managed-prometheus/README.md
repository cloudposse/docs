---
title: managed-prometheus
sidebar_label: managed-prometheus
sidebar_class_name: command
description: |-
  This module is responsible for provisioning a workspace for Amazon Managed Service for Prometheus, also known as Amazon Managed Prometheus (AMP).
custom_edit_url: https://github.com/cloudposse/terraform-aws-managed-prometheus/blob/main/README.yaml
---

# Module: `managed-prometheus`
This module is responsible for provisioning a workspace for Amazon Managed Service for Prometheus, also known as Amazon Managed Prometheus (AMP).




## Introduction

Amazon Managed Service for Prometheus provides highly available, secure, and managed monitoring for your containers. It automatically scales as your ingestion and query needs grow, and gives you access to remote write metrics from existing Prometheus servers and to query metrics using PromQL.

Deploy this module alongside a managed collector to read metrics from EKS and visualize them with Grafana. For example, see [terraform-aws-managed-grafana](https://github.com/cloudposse/terraform-aws-managed-grafana).



## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-managed-prometheus/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-managed-prometheus/tree/main/test).

```hcl
locals {
  grafana_account_id = "123456789012"
}

# Create a standard label resource. See [null-label](https://github.com/cloudposse/terraform-null-label/#terraform-null-label--)
module "label" {
  source  = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version, though usually you want to use the current one
  # version = "x.x.x"

  namespace = "eg"
  name      = "example"
}

module "prometheus" {
  source  = "cloudposse/managed-prometheus/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  allowed_account_id       = local.grafana_account_id # The ID of another account allowed to access this Managed Prometheus Workspace
  scraper_deployed         = true

  vpc_id = var.vpc_id # The ID of some VPC allowed to access this Managed Prometheus Workspace

  context = module.label.this
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-managed-prometheus/) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_access_role"></a> [access\_role](#module\_access\_role) | cloudposse/label/null | 0.25.0 |
| <a name="module_account_access_policy_label"></a> [account\_access\_policy\_label](#module\_account\_access\_policy\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |
| <a name="module_vpc_endpoint_policy"></a> [vpc\_endpoint\_policy](#module\_vpc\_endpoint\_policy) | cloudposse/iam-policy/aws | v2.0.1 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.account_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_prometheus_alert_manager_definition.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/prometheus_alert_manager_definition) | resource |
| [aws_prometheus_rule_group_namespace.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/prometheus_rule_group_namespace) | resource |
| [aws_prometheus_workspace.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/prometheus_workspace) | resource |
| [aws_vpc_endpoint.prometheus](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_endpoint) | resource |
| [aws_iam_policy_document.aps](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_alert_manager_definition"></a> [alert\_manager\_definition](#input\_alert\_manager\_definition) | The alert manager definition that you want to be applied. | `string` | `""` | no |
| <a name="input_allowed_account_id"></a> [allowed\_account\_id](#input\_allowed\_account\_id) | The Account ID of another AWS account allowed to access Amazon Managed Prometheus in this account. If defined, this module will create a cross-account IAM role for accessing APS. Use this for cross-account Grafana. If not defined, no roles will be created. | `string` | `""` | no |
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
| <a name="input_rule_group_namespaces"></a> [rule\_group\_namespaces](#input\_rule\_group\_namespaces) | A list of name, data objects for each Amazon Managed Service for Prometheus (AMP) Rule Group Namespace | <pre>list(object({<br/>    name = string<br/>    data = string<br/>  }))</pre> | `[]` | no |
| <a name="input_scraper_deployed"></a> [scraper\_deployed](#input\_scraper\_deployed) | When connecting an Amazon Managed Collector, also known as a scraper, Amazon will add a tag to this AMP workspace. Set this value to `true` to resolve Terraform drift. | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | If set, the ID of the VPC in which the endpoint will be used. If not set, no VPC endpoint will be created. | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_access_role_arn"></a> [access\_role\_arn](#output\_access\_role\_arn) | If enabled with `var.allowed_account_id`, the Role ARN used for accessing Amazon Managed Prometheus in this account |
| <a name="output_workspace_arn"></a> [workspace\_arn](#output\_workspace\_arn) | The ARN of this Amazon Managed Prometheus workspace |
| <a name="output_workspace_endpoint"></a> [workspace\_endpoint](#output\_workspace\_endpoint) | The endpoint URL of this Amazon Managed Prometheus workspace |
| <a name="output_workspace_id"></a> [workspace\_id](#output\_workspace\_id) | The ID of this Amazon Managed Prometheus workspace |
<!-- markdownlint-restore -->

