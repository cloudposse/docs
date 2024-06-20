---
title: health-events
sidebar_label: health-events
sidebar_class_name: command
description: |-
  This module creates EventBridge (formerly CloudWatch Events) rules for AWS Personal Health Dashboard Events and an SNS topic. EventBridge will publish messages to this SNS topic, which can be subcribed to using this module as well.
  Since AWS Personal Health Dashboard is a global service, but since the KMS key and SNS topic are regional, this module is technically regional but only needs to be deployed once per account.
custom_edit_url: https://github.com/cloudposse/terraform-aws-health-events/blob/main/README.yaml
---

# Module: `health-events`
This module creates EventBridge (formerly CloudWatch Events) rules for AWS Personal Health Dashboard Events and an SNS topic. EventBridge will publish messages to this SNS topic, which can be subcribed to using this module as well.
Since AWS Personal Health Dashboard is a global service, but since the KMS key and SNS topic are regional, this module is technically regional but only needs to be deployed once per account.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-health-events/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-health-events/tree/main/test).

Here's how to invoke this module in your projects:
```hcl
module "monitor_yaml_config" {
  source  = "cloudposse/config/yaml"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  map_config_local_base_path = path.module
  map_config_paths           = ["catalog/event_rules/*.yaml"]

  context = module.this.context
}

module "health_events" {
  source = "cloudposse/health-events/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  event_rules = module.event_rules_yaml_config.list_configs
  subscribers = {
    opsgenie = {
      protocol               = "https"
      endpoint               = "https://api.example.com/v1/"
      endpoint_auto_confirms = true
      raw_message_delivery   = false
    }
  }

  context = module.this.context
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-health-events/examples/complete) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_health_events_label"></a> [health\_events\_label](#module\_health\_events\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_sns_kms_key"></a> [sns\_kms\_key](#module\_sns\_kms\_key) | cloudposse/kms-key/aws | 0.12.1 |
| <a name="module_sns_topic"></a> [sns\_topic](#module\_sns\_topic) | cloudposse/sns-topic/aws | 0.20.1 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_event_rule.health_events](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.sns](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_caller_identity.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.sns_kms_key_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

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
| <a name="input_event_rules"></a> [event\_rules](#input\_event\_rules) | A list of Event Rules to use when creating EventBridge Rules for the AWS Personal Health Service.<br/><br/>name:<br/>  The base name of the Event Rule (final name will be used in tandem with context attributes)<br/>description:<br/>  The description to use for the Event Rule<br/>event\_rule\_pattern:<br/>  The Event Rule Pattern to use when creating the Event Rule.<br/>  For more information, see: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html | <pre>list(object({<br/>    name        = string<br/>    description = string<br/>    event_rule_pattern = object({<br/>      detail = object({<br/>        service             = string<br/>        event_type_category = string<br/>        event_type_codes    = list(string)<br/>      })<br/>    })<br/>  }))</pre> | n/a | yes |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kms_master_key_id"></a> [kms\_master\_key\_id](#input\_kms\_master\_key\_id) | The ID or alias of the customer master key (CMK) to use for encrypting the Amazon SNS topic.<br/>  The CMK must have its resource-based policy allow the service `cloudwatch.amazonaws.com` to perform `kms:Decrypt` and `kms:GenerateDataKey` on it.<br/>  If this variable is not supplied, a CMK with the sufficient resource-based policy will be created and used when configuring encryption for<br/>  the SNS topic. | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subscribers"></a> [subscribers](#input\_subscribers) | Required configuration for subscribers to SNS topic. | <pre>map(object({<br/>    protocol = string<br/>    # The protocol to use. The possible values for this are: sqs, sms, lambda, application. (http or https are partially supported, see below) (email is an option but is unsupported, see below).<br/>    endpoint = string<br/>    # The endpoint to send data to, the contents will vary with the protocol. (see below for more information)<br/>    endpoint_auto_confirms = bool<br/>    # Boolean indicating whether the end point is capable of auto confirming subscription e.g., PagerDuty (default is false)<br/>    raw_message_delivery = bool<br/>    # Boolean indicating whether or not to enable raw message delivery (the original message is directly passed, not wrapped in JSON with the original message in the message property) (default is false)<br/>  }))</pre> | `{}` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_event_rule_arns"></a> [event\_rule\_arns](#output\_event\_rule\_arns) | The ARNs of the created EventBridge Rules. |
| <a name="output_event_rule_names"></a> [event\_rule\_names](#output\_event\_rule\_names) | The names of the created EventBridge Rules. |
<!-- markdownlint-restore -->

