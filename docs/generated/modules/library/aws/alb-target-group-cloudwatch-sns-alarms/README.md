---
title: alb-target-group-cloudwatch-sns-alarms
sidebar_label: alb-target-group-cloudwatch-sns-alarms
sidebar_class_name: command
description: |-
  Terraform module for creating alarms for tracking important changes and occurrences from ALBs.
custom_edit_url: https://github.com/cloudposse/terraform-aws-alb-target-group-cloudwatch-sns-alarms/blob/main/README.yaml
---

# Module: `alb-target-group-cloudwatch-sns-alarms`
Terraform module for creating alarms for tracking important changes and occurrences from ALBs.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-alb-target-group-cloudwatch-sns-alarms/tree/main/examples/complete).

For automated tests of the complete example using `bats` and `Terratest`, see [test](https://github.com/cloudposse/terraform-aws-alb-target-group-cloudwatch-sns-alarms/tree/main/test).

```hcl
module "alb_alarms" {
  source = "cloudposse/alb-target-group-cloudwatch-sns-alarms/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace               = "eg"
  stage                   = "staging"
  name                    = "app"
  alb_arn_suffix          = "XXXXXXXXX"
  target_group_arn_suffix = "YYYYYYYYY"
}
```






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
| <a name="module_httpcode_elb_5xx_alarm_label"></a> [httpcode\_elb\_5xx\_alarm\_label](#module\_httpcode\_elb\_5xx\_alarm\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_httpcode_target_3xx_alarm_label"></a> [httpcode\_target\_3xx\_alarm\_label](#module\_httpcode\_target\_3xx\_alarm\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_httpcode_target_4xx_alarm_label"></a> [httpcode\_target\_4xx\_alarm\_label](#module\_httpcode\_target\_4xx\_alarm\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_httpcode_target_5xx_alarm_label"></a> [httpcode\_target\_5xx\_alarm\_label](#module\_httpcode\_target\_5xx\_alarm\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_target_response_time_alarm_label"></a> [target\_response\_time\_alarm\_label](#module\_target\_response\_time\_alarm\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_metric_alarm.httpcode_elb_5xx_count](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.httpcode_target_3xx_count](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.httpcode_target_4xx_count](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.httpcode_target_5xx_count](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.target_response_time_average](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_alarm_actions"></a> [alarm\_actions](#input\_alarm\_actions) | A list of ARNs (i.e. SNS Topic ARN) to execute when this alarm transitions into an ALARM state from any other state.  If set, this list takes precedence over notify\_arns | `list(string)` | <pre>[<br/>  ""<br/>]</pre> | no |
| <a name="input_alb_arn_suffix"></a> [alb\_arn\_suffix](#input\_alb\_arn\_suffix) | The ARN suffix of ALB | `string` | n/a | yes |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_elb_5xx_count_threshold"></a> [elb\_5xx\_count\_threshold](#input\_elb\_5xx\_count\_threshold) | The maximum count of ELB 5XX requests over a period. A negative value will disable the alert | `number` | `25` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_evaluation_periods"></a> [evaluation\_periods](#input\_evaluation\_periods) | Number of periods to evaluate for the alarm | `number` | `1` | no |
| <a name="input_httpcode_alarm_description"></a> [httpcode\_alarm\_description](#input\_httpcode\_alarm\_description) | The string to format and use as the httpcode alarm description | `string` | `"HTTPCode %v count for %v over %v last %d minute(s) over %v period(s)"` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_insufficient_data_actions"></a> [insufficient\_data\_actions](#input\_insufficient\_data\_actions) | A list of ARNs (i.e. SNS Topic ARN) to execute when this alarm transitions into an INSUFFICIENT\_DATA state from any other state. If set, this list takes precedence over notify\_arns | `list(string)` | <pre>[<br/>  ""<br/>]</pre> | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_notify_arns"></a> [notify\_arns](#input\_notify\_arns) | A list of ARNs (i.e. SNS Topic ARN) to execute when this alarm transitions into ANY state from any other state. May be overridden by the value of a more specific {alarm,ok,insufficient\_data}\_actions variable. | `list(string)` | <pre>[<br/>  ""<br/>]</pre> | no |
| <a name="input_ok_actions"></a> [ok\_actions](#input\_ok\_actions) | A list of ARNs (i.e. SNS Topic ARN) to execute when this alarm transitions into an OK state from any other state. If set, this list takes precedence over notify\_arns | `list(string)` | <pre>[<br/>  ""<br/>]</pre> | no |
| <a name="input_period"></a> [period](#input\_period) | Duration in seconds to evaluate for the alarm | `number` | `300` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_target_3xx_count_threshold"></a> [target\_3xx\_count\_threshold](#input\_target\_3xx\_count\_threshold) | The maximum count of 3XX requests over a period. A negative value will disable the alert | `number` | `25` | no |
| <a name="input_target_4xx_count_threshold"></a> [target\_4xx\_count\_threshold](#input\_target\_4xx\_count\_threshold) | The maximum count of 4XX requests over a period. A negative value will disable the alert | `number` | `25` | no |
| <a name="input_target_5xx_count_threshold"></a> [target\_5xx\_count\_threshold](#input\_target\_5xx\_count\_threshold) | The maximum count of 5XX requests over a period. A negative value will disable the alert | `number` | `25` | no |
| <a name="input_target_group_arn_suffix"></a> [target\_group\_arn\_suffix](#input\_target\_group\_arn\_suffix) | The ARN suffix of ALB Target Group | `string` | n/a | yes |
| <a name="input_target_response_time_alarm_description"></a> [target\_response\_time\_alarm\_description](#input\_target\_response\_time\_alarm\_description) | The string to format and use as the target response time alarm description | `string` | `"Target Response Time average for %v over %v last %d minute(s) over %v period(s)"` | no |
| <a name="input_target_response_time_threshold"></a> [target\_response\_time\_threshold](#input\_target\_response\_time\_threshold) | The maximum average target response time (in seconds) over a period. A negative value will disable the alert | `number` | `0.5` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_treat_missing_data"></a> [treat\_missing\_data](#input\_treat\_missing\_data) | Sets how alarms handle missing data points. Values supported: missing, ignore, breaching and notBreaching | `string` | `"missing"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_httpcode_elb_5xx_count_cloudwatch_metric_alarm_arn"></a> [httpcode\_elb\_5xx\_count\_cloudwatch\_metric\_alarm\_arn](#output\_httpcode\_elb\_5xx\_count\_cloudwatch\_metric\_alarm\_arn) | ELB 5xx count CloudWatch metric alarm ARN |
| <a name="output_httpcode_elb_5xx_count_cloudwatch_metric_alarm_id"></a> [httpcode\_elb\_5xx\_count\_cloudwatch\_metric\_alarm\_id](#output\_httpcode\_elb\_5xx\_count\_cloudwatch\_metric\_alarm\_id) | ELB 5xx count CloudWatch metric alarm ID |
| <a name="output_httpcode_target_3xx_count_cloudwatch_metric_alarm_arn"></a> [httpcode\_target\_3xx\_count\_cloudwatch\_metric\_alarm\_arn](#output\_httpcode\_target\_3xx\_count\_cloudwatch\_metric\_alarm\_arn) | Target Group 3xx count CloudWatch metric alarm ARN |
| <a name="output_httpcode_target_3xx_count_cloudwatch_metric_alarm_id"></a> [httpcode\_target\_3xx\_count\_cloudwatch\_metric\_alarm\_id](#output\_httpcode\_target\_3xx\_count\_cloudwatch\_metric\_alarm\_id) | Target Group 3xx count CloudWatch metric alarm ID |
| <a name="output_httpcode_target_4xx_count_cloudwatch_metric_alarm_arn"></a> [httpcode\_target\_4xx\_count\_cloudwatch\_metric\_alarm\_arn](#output\_httpcode\_target\_4xx\_count\_cloudwatch\_metric\_alarm\_arn) | Target Group 4xx count CloudWatch metric alarm ARN |
| <a name="output_httpcode_target_4xx_count_cloudwatch_metric_alarm_id"></a> [httpcode\_target\_4xx\_count\_cloudwatch\_metric\_alarm\_id](#output\_httpcode\_target\_4xx\_count\_cloudwatch\_metric\_alarm\_id) | Target Group 4xx count CloudWatch metric alarm ID |
| <a name="output_httpcode_target_5xx_count_cloudwatch_metric_alarm_arn"></a> [httpcode\_target\_5xx\_count\_cloudwatch\_metric\_alarm\_arn](#output\_httpcode\_target\_5xx\_count\_cloudwatch\_metric\_alarm\_arn) | Target Group 5xx count CloudWatch metric alarm ARN |
| <a name="output_httpcode_target_5xx_count_cloudwatch_metric_alarm_id"></a> [httpcode\_target\_5xx\_count\_cloudwatch\_metric\_alarm\_id](#output\_httpcode\_target\_5xx\_count\_cloudwatch\_metric\_alarm\_id) | Target Group 5xx count CloudWatch metric alarm ID |
| <a name="output_target_response_time_average_cloudwatch_metric_alarm_arn"></a> [target\_response\_time\_average\_cloudwatch\_metric\_alarm\_arn](#output\_target\_response\_time\_average\_cloudwatch\_metric\_alarm\_arn) | Target Group response time average CloudWatch metric alarm ARN |
| <a name="output_target_response_time_average_cloudwatch_metric_alarm_id"></a> [target\_response\_time\_average\_cloudwatch\_metric\_alarm\_id](#output\_target\_response\_time\_average\_cloudwatch\_metric\_alarm\_id) | Target Group response time average CloudWatch metric alarm ID |
<!-- markdownlint-restore -->

