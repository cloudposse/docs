---
title: managed-grafana
sidebar_label: managed-grafana
sidebar_class_name: command
description: |-
  This module is responsible for provisioning an Amazon Managed Grafana workspace.
custom_edit_url: https://github.com/cloudposse/terraform-aws-managed-grafana/blob/main/README.yaml
---

# Module: `managed-grafana`
This module is responsible for provisioning an Amazon Managed Grafana workspace.




## Introduction

Amazon Managed Grafana is a fully managed service for Grafana, a popular open-source analytics platform that enables you to query, visualize, and alert on your metrics, logs, and traces.

Deploy this module alongside [terraform-aws-managed-prometheus](https://github.com/cloudposse/terraform-aws-managed-prometheus) to visual metrics or add a Grafana Loki data source to visualize logs.



## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-managed-grafana/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-managed-grafana/tree/main/test).

```hcl
locals {
  enabled = module.this.enabled

  # These are pulled from the output of the cloudposse/terraform-aws-managed-prometheus module
  additional_allowed_roles = compact([for prometheus in module.prometheus : prometheus.outputs.access_role_arn])
}

module "security_group" {
  source  = "cloudposse/security-group/aws"
  version = "2.2.0"

  enabled = local.enabled && var.private_network_access_enabled

  allow_all_egress = true
  rules            = []
  vpc_id           = module.vpc.outputs.vpc_id

  context = module.this.context
}

module "managed_grafana" {
  source  = "cloudposse/managed-grafana/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  enabled = local.enabled

  prometheus_policy_enabled = var.prometheus_policy_enabled
  additional_allowed_roles  = local.additional_allowed_roles

  sso_role_associations = [
    {
      "role" = "ADMIN"
      "group_ids" = ["xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"]
    }
  ]

  vpc_configuration = var.private_network_access_enabled ? {
    subnet_ids         = module.vpc.outputs.private_subnet_ids
    security_group_ids = [module.security_group.id]
  } : {}

  context = module.this.context
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-managed-grafana/) - complete example of using this module



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
| <a name="module_additional_allowed_role_label"></a> [additional\_allowed\_role\_label](#module\_additional\_allowed\_role\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_prometheus_policy_label"></a> [prometheus\_policy\_label](#module\_prometheus\_policy\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_grafana_role_association.sso](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/grafana_role_association) | resource |
| [aws_grafana_workspace.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/grafana_workspace) | resource |
| [aws_iam_role.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_policy_document.aps](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_allowed_roles"></a> [additional\_allowed\_roles](#input\_additional\_allowed\_roles) | A list of IAM Role ARNs that this Grafana IAM role will be allowed to assume. Use this to set up cross-account access. | `list(string)` | `[]` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_authentication_providers"></a> [authentication\_providers](#input\_authentication\_providers) | The authentication providers for the workspace. Valid values are `AWS_SSO`, `SAML`, or both. | `list(string)` | <pre>[<br/>  "AWS_SSO"<br/>]</pre> | no |
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
| <a name="input_permission_type"></a> [permission\_type](#input\_permission\_type) | The permission type of the workspace. If `SERVICE_MANAGED` is specified, the IAM roles and IAM policy attachments are generated automatically. If `CUSTOMER_MANAGED` is specified, the IAM roles and IAM policy attachments will not be created. | `string` | `"SERVICE_MANAGED"` | no |
| <a name="input_prometheus_policy_enabled"></a> [prometheus\_policy\_enabled](#input\_prometheus\_policy\_enabled) | Set this to `true` to allow this Grafana workspace to access Amazon Managed Prometheus (AMP). | `bool` | `false` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_sso_role_associations"></a> [sso\_role\_associations](#input\_sso\_role\_associations) | A list of role to group ID list associations for granting Amazon Grafana access. Only used if `var.authentication_providers` includes `AWS_SSO` | <pre>list(object({<br/>    role      = string<br/>    group_ids = list(string)<br/>  }))</pre> | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_configuration"></a> [vpc\_configuration](#input\_vpc\_configuration) | If defined, this map defines the VPC configuration to connect your Grafana workspace to a private network | <pre>object({<br/>    security_group_ids = list(string)<br/>    subnet_ids         = list(string)<br/>  })</pre> | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_workspace_arn"></a> [workspace\_arn](#output\_workspace\_arn) | The ARN of the Amazon Managed Grafana workspace |
| <a name="output_workspace_endpoint"></a> [workspace\_endpoint](#output\_workspace\_endpoint) | The URL of the Amazon Managed Grafana workspace |
| <a name="output_workspace_id"></a> [workspace\_id](#output\_workspace\_id) | The ID of the Amazon Managed Grafana workspace |
<!-- markdownlint-restore -->

