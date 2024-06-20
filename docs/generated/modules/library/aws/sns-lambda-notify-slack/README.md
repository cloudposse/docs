---
title: sns-lambda-notify-slack
sidebar_label: sns-lambda-notify-slack
sidebar_class_name: command
description: |-
  Terraform module to provision a lambda function that subscribes to SNS and notifies to Slack.
custom_edit_url: https://github.com/cloudposse/terraform-aws-sns-lambda-notify-slack/blob/main/README.yaml
---

# Module: `sns-lambda-notify-slack`
Terraform module to provision a lambda function that subscribes to SNS and notifies to Slack.






## Usage

```hcl
module "notify_slack" {
  source            = "git::https://github.com/cloudposse/terraform-aws-sns-lambda-notify-slack?ref=tags/0.1.0"
  namespace         = "eg"
  stage             = "staging"
  name              = "app"
  slack_webhook_url = "https://hooks.slack.com/services/AAAAAAAA/BBBBBBBB/CCCCCCC"
  slack_channel     = "aws-services"
  slack_username    = "reporter"
}
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_archive"></a> [archive](#requirement\_archive) | >=1.3 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.3 |
| <a name="requirement_null"></a> [null](#requirement\_null) | >= 2.0 |
| <a name="requirement_template"></a> [template](#requirement\_template) | >= 2.2 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_default_label"></a> [default\_label](#module\_default\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_notify_slack"></a> [notify\_slack](#module\_notify\_slack) | terraform-aws-modules/notify-slack/aws | 5.6 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_sns_topic"></a> [create\_sns\_topic](#input\_create\_sns\_topic) | Whether to create new SNS topic | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kms_key_arn"></a> [kms\_key\_arn](#input\_kms\_key\_arn) | ARN of the KMS key used for decrypting slack webhook url | `string` | `""` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_lambda_source_path"></a> [lambda\_source\_path](#input\_lambda\_source\_path) | The source path of the custom Lambda function | `string` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_slack_channel"></a> [slack\_channel](#input\_slack\_channel) | The name of the channel in Slack for notifications | `string` | n/a | yes |
| <a name="input_slack_emoji"></a> [slack\_emoji](#input\_slack\_emoji) | A custom emoji that will appear on Slack messages | `string` | `":aws:"` | no |
| <a name="input_slack_username"></a> [slack\_username](#input\_slack\_username) | The username that will appear on Slack messages | `string` | n/a | yes |
| <a name="input_slack_webhook_url"></a> [slack\_webhook\_url](#input\_slack\_webhook\_url) | The URL of Slack webhook | `string` | n/a | yes |
| <a name="input_sns_topic_name"></a> [sns\_topic\_name](#input\_sns\_topic\_name) | Name of the SNS topic to subscribe to. | `string` | `""` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_security_group_ids"></a> [vpc\_security\_group\_ids](#input\_vpc\_security\_group\_ids) | List of security group ids when the notifying Lambda Function should run in the VPC. | `list(string)` | `null` | no |
| <a name="input_vpc_subnet_ids"></a> [vpc\_subnet\_ids](#input\_vpc\_subnet\_ids) | List of subnet ids when the notifying Lambda Function should run in the VPC. Usually private or intra subnets. | `list(string)` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_lambda_cloudwatch_log_group_arn"></a> [lambda\_cloudwatch\_log\_group\_arn](#output\_lambda\_cloudwatch\_log\_group\_arn) | The Amazon Resource Name (ARN) specifying the log group |
| <a name="output_lambda_iam_role_arn"></a> [lambda\_iam\_role\_arn](#output\_lambda\_iam\_role\_arn) | The ARN of the IAM role used by Lambda function |
| <a name="output_lambda_iam_role_name"></a> [lambda\_iam\_role\_name](#output\_lambda\_iam\_role\_name) | The name of the IAM role used by Lambda function |
| <a name="output_notify_slack_lambda_function_arn"></a> [notify\_slack\_lambda\_function\_arn](#output\_notify\_slack\_lambda\_function\_arn) | The ARN of the Lambda function |
| <a name="output_notify_slack_lambda_function_invoke_arn"></a> [notify\_slack\_lambda\_function\_invoke\_arn](#output\_notify\_slack\_lambda\_function\_invoke\_arn) | The ARN to be used for invoking Lambda function from API Gateway |
| <a name="output_notify_slack_lambda_function_last_modified"></a> [notify\_slack\_lambda\_function\_last\_modified](#output\_notify\_slack\_lambda\_function\_last\_modified) | The date Lambda function was last modified |
| <a name="output_notify_slack_lambda_function_name"></a> [notify\_slack\_lambda\_function\_name](#output\_notify\_slack\_lambda\_function\_name) | The name of the Lambda function |
| <a name="output_notify_slack_lambda_function_version"></a> [notify\_slack\_lambda\_function\_version](#output\_notify\_slack\_lambda\_function\_version) | Latest published version of your Lambda function |
| <a name="output_slack_topic_arn"></a> [slack\_topic\_arn](#output\_slack\_topic\_arn) | The ARN of the SNS topic from which messages will be sent to Slack |
<!-- markdownlint-restore -->

