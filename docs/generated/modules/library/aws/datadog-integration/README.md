---
title: datadog-integration
sidebar_label: datadog-integration
sidebar_class_name: command
description: |-
  Terraform module to configure [Datadog AWS integration](https://docs.datadoghq.com/api/v1/aws-integration/).
tags:
  - aws
  - terraform
  - terraform-modules
  - logging
  - monitoring
  - datadog

custom_edit_url: https://github.com/cloudposse/terraform-aws-datadog-integration/blob/main/README.yaml
---

# Module: `datadog-integration`
Terraform module to configure [Datadog AWS integration](https://docs.datadoghq.com/api/v1/aws-integration/).






## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-datadog-integration/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-datadog-integration/tree/main/test).

**Note:** At the moment this module supports a limited set of IAM policies to support Datadog integrations. More can be added as needed.

### Structure

This module follows [Datadog's documentation](https://docs.datadoghq.com/integrations/amazon_web_services/)
by supporting a `core` integration which is the minimum set of permissions needed for any Datadog integration,
plus an additional integration per service which contains the additional permissions Datadog has documented
are required for that service.

To make things easier, this module also implements an `all` integration which includes all the permissions Datadog
lists under "All Permissions" as the maximal set of permissions required, so you can just set
`integrations = ["all"]` and be done.

### Installation

Include this module in your existing terraform code:

```hcl
module "datadog_integration" {
  source = "cloudposse/datadog-integration/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  namespace                  = "eg"
  stage                      = "test"
  name                       = "datadog"
  integrations               = ["all"]
}
```

The DataDog integration will be linked with your configured datadog account via the provider's `api_key`.




## Examples

Review the [complete example](https://github.com/cloudposse/terraform-aws-datadog-integration/tree/main/examples/complete) to see how to use this module.



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |
| <a name="requirement_datadog"></a> [datadog](#requirement\_datadog) | >= 3.9 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |
| <a name="provider_datadog"></a> [datadog](#provider\_datadog) | >= 3.9 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_all_label"></a> [all\_label](#module\_all\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_core_label"></a> [core\_label](#module\_core\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.all](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.core](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.all](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.core](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.security_audit](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [datadog_integration_aws.integration](https://registry.terraform.io/providers/datadog/datadog/latest/docs/resources/integration_aws) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.all](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.core](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_account_specific_namespace_rules"></a> [account\_specific\_namespace\_rules](#input\_account\_specific\_namespace\_rules) | An object, (in the form {"namespace1":true/false, "namespace2":true/false} ), that enables or disables metric collection for specific AWS namespaces for this AWS account only | `map(string)` | `null` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_cspm_resource_collection_enabled"></a> [cspm\_resource\_collection\_enabled](#input\_cspm\_resource\_collection\_enabled) | Whether Datadog collects cloud security posture management resources from your AWS account. | `bool` | `null` | no |
| <a name="input_datadog_aws_account_id"></a> [datadog\_aws\_account\_id](#input\_datadog\_aws\_account\_id) | The AWS account ID Datadog's integration servers use for all integrations | `string` | `"464622532012"` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_excluded_regions"></a> [excluded\_regions](#input\_excluded\_regions) | An array of AWS regions to exclude from metrics collection | `list(string)` | `null` | no |
| <a name="input_filter_tags"></a> [filter\_tags](#input\_filter\_tags) | An array of EC2 tags (in the form `key:value`) that defines a filter that Datadog use when collecting metrics from EC2. Wildcards, such as ? (for single characters) and * (for multiple characters) can also be used | `list(string)` | `null` | no |
| <a name="input_host_tags"></a> [host\_tags](#input\_host\_tags) | An array of tags (in the form `key:value`) to add to all hosts and metrics reporting through this integration | `list(string)` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_integrations"></a> [integrations](#input\_integrations) | List of AWS permission names to apply for different integrations (e.g. 'all', 'core') | `list(string)` | n/a | yes |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_metrics_collection_enabled"></a> [metrics\_collection\_enabled](#input\_metrics\_collection\_enabled) | Whether Datadog collects metrics for this AWS account. | `bool` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_resource_collection_enabled"></a> [resource\_collection\_enabled](#input\_resource\_collection\_enabled) | Whether Datadog collects a standard set of resources from your AWS account. | `bool` | `null` | no |
| <a name="input_security_audit_policy_enabled"></a> [security\_audit\_policy\_enabled](#input\_security\_audit\_policy\_enabled) | Enable/disable attaching the AWS managed `SecurityAudit` policy to the Datadog IAM role to collect information about how AWS resources are configured (used in Datadog Cloud Security Posture Management to read security configuration metadata). If var.cspm\_resource\_collection\_enabled, this is enabled automatically. | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_aws_account_id"></a> [aws\_account\_id](#output\_aws\_account\_id) | AWS Account ID of the IAM Role for Datadog to use for this integration |
| <a name="output_aws_role_arn"></a> [aws\_role\_arn](#output\_aws\_role\_arn) | ARN of the AWS IAM Role for Datadog to use for this integration |
| <a name="output_aws_role_name"></a> [aws\_role\_name](#output\_aws\_role\_name) | Name of the AWS IAM Role for Datadog to use for this integration |
| <a name="output_datadog_external_id"></a> [datadog\_external\_id](#output\_datadog\_external\_id) | Datadog integration external ID |
<!-- markdownlint-restore -->

