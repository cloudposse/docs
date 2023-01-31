---
title: aws-guardduty
sidebar_label: aws-guardduty
sidebar_class_name: command
description: |-
  This module enables AWS GuardDuty in one region of one account and optionally sets up an SNS topic to receive 
  notifications of its findings.
custom_edit_url: https://github.com/cloudposse/terraform-aws-guardduty/edit/master/README.md
---

# Component: `aws-guardduty`
This module enables AWS GuardDuty in one region of one account and optionally sets up an SNS topic to receive 
notifications of its findings.






## Usage

Here's how to invoke this example module in your projects

```hcl
module "example" {
  source = "https://github.com/cloudposse/terraform-aws-guardduty.git?ref=master"

  create_sns_topic = true
  subscribers = {
    opsgenie = {
      protocol = "https"
      endpoint = "https://api.example.com/v1/"
      endpoint_auto_confirms = true
    }
  }
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-guardduty/tree/master/examples/complete) - complete example of using this module



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
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_findings_label"></a> [findings\_label](#module\_findings\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_sns_topic"></a> [sns\_topic](#module\_sns\_topic) | cloudposse/sns-topic/aws | 0.20.1 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_event_rule.findings](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.imported_findings](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_guardduty_detector.guardduty](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/guardduty_detector) | resource |
| [aws_sns_topic_policy.sns_topic_publish_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_policy) | resource |
| [aws_iam_policy_document.sns_topic_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_cloudwatch_event_rule_pattern_detail_type"></a> [cloudwatch\_event\_rule\_pattern\_detail\_type](#input\_cloudwatch\_event\_rule\_pattern\_detail\_type) | The detail-type pattern used to match events that will be sent to SNS.<br/><br/>For more information, see:<br/>https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html<br/>https://docs.aws.amazon.com/eventbridge/latest/userguide/event-types.html<br/>https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_cloudwatch.html | `string` | `"GuardDuty Finding"` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_sns_topic"></a> [create\_sns\_topic](#input\_create\_sns\_topic) | Flag to indicate whether an SNS topic should be created for notifications.<br/>If you want to send findings to a new SNS topic, set this to true and provide a valid configuration for subscribers. | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enable_cloudwatch"></a> [enable\_cloudwatch](#input\_enable\_cloudwatch) | Flag to indicate whether an CloudWatch logging should be enabled for GuardDuty | `bool` | `false` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_finding_publishing_frequency"></a> [finding\_publishing\_frequency](#input\_finding\_publishing\_frequency) | The frequency of notifications sent for finding occurrences. If the detector is a GuardDuty member account, the value<br/>is determined by the GuardDuty master account and cannot be modified, otherwise it defaults to SIX\_HOURS.<br/><br/>For standalone and GuardDuty master accounts, it must be configured in Terraform to enable drift detection.<br/>Valid values for standalone and master accounts: FIFTEEN\_MINUTES, ONE\_HOUR, SIX\_HOURS."<br/><br/>For more information, see:<br/>https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_cloudwatch.html#guardduty_findings_cloudwatch_notification_frequency | `string` | `null` | no |
| <a name="input_findings_notification_arn"></a> [findings\_notification\_arn](#input\_findings\_notification\_arn) | The ARN for an SNS topic to send findings notifications to. This is only used if create\_sns\_topic is false.<br/>If you want to send findings to an existing SNS topic, set the value of this to the ARN of the existing topic and set<br/>create\_sns\_topic to false. | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_s3_protection_enabled"></a> [s3\_protection\_enabled](#input\_s3\_protection\_enabled) | Flag to indicate whether S3 protection will be turned on in GuardDuty.<br/><br/>For more information, see:<br/>https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/guardduty_detector | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subscribers"></a> [subscribers](#input\_subscribers) | A map of subscription configurations for SNS topics<br/><br/>For more information, see:<br/>https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription#argument-reference<br/><br/>protocol:<br/>  The protocol to use. The possible values for this are: sqs, sms, lambda, application. (http or https are partially<br/>  supported, see link) (email is an option but is unsupported in terraform, see link).<br/>endpoint:<br/>  The endpoint to send data to, the contents will vary with the protocol. (see link for more information)<br/>endpoint\_auto\_confirms:<br/>  Boolean indicating whether the end point is capable of auto confirming subscription e.g., PagerDuty. Default is<br/>  false<br/>raw\_message\_delivery:<br/>  Boolean indicating whether or not to enable raw message delivery (the original message is directly passed, not wrapped in JSON with the original message in the message property).<br/>  Default is false | <pre>map(object({<br/>    protocol               = string<br/>    endpoint               = string<br/>    endpoint_auto_confirms = bool<br/>    raw_message_delivery   = bool<br/>  }))</pre> | `{}` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_guardduty_detector"></a> [guardduty\_detector](#output\_guardduty\_detector) | GuardDuty detector |
| <a name="output_sns_topic"></a> [sns\_topic](#output\_sns\_topic) | SNS topic |
| <a name="output_sns_topic_subscriptions"></a> [sns\_topic\_subscriptions](#output\_sns\_topic\_subscriptions) | SNS topic subscriptions |
<!-- markdownlint-restore -->


