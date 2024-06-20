---
title: config
sidebar_label: config
sidebar_class_name: command
description: |-
  This module enables [AWS Config](https://aws.amazon.com/config/) and optionally sets up an SNS topic to receive notifications of its findings.
custom_edit_url: https://github.com/cloudposse/terraform-aws-config/blob/main/README.yaml
---

# Module: `config`
This module enables [AWS Config](https://aws.amazon.com/config/) and optionally sets up an SNS topic to receive notifications of its findings.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-config/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-config/tree/main/test).

```hcl
module "example" {
  source = "cloudposse/config/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  create_sns_topic = true
  create_iam_role  = true

  managed_rules = {
    account-part-of-organizations = {
      description  = "Checks whether AWS account is part of AWS Organizations. The rule is NON_COMPLIANT if an AWS account is not part of AWS Organizations or AWS Organizations master account ID does not match rule parameter MasterAccountId.",
      identifier   = "ACCOUNT_PART_OF_ORGANIZATIONS",
      trigger_type = "PERIODIC"
      enabled      = true
    }
  }
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-config/) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.38.0 |
| <a name="requirement_http"></a> [http](#requirement\_http) | >= 3.4.1 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.38.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_aws_config_aggregator_label"></a> [aws\_config\_aggregator\_label](#module\_aws\_config\_aggregator\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_aws_config_findings_label"></a> [aws\_config\_findings\_label](#module\_aws\_config\_findings\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_aws_config_label"></a> [aws\_config\_label](#module\_aws\_config\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_iam_role"></a> [iam\_role](#module\_iam\_role) | cloudposse/iam-role/aws | 0.19.0 |
| <a name="module_iam_role_organization_aggregator"></a> [iam\_role\_organization\_aggregator](#module\_iam\_role\_organization\_aggregator) | cloudposse/iam-role/aws | 0.19.0 |
| <a name="module_sns_topic"></a> [sns\_topic](#module\_sns\_topic) | cloudposse/sns-topic/aws | 0.20.1 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_config_aggregate_authorization.central](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_aggregate_authorization) | resource |
| [aws_config_aggregate_authorization.child](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_aggregate_authorization) | resource |
| [aws_config_config_rule.rules](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_config_rule) | resource |
| [aws_config_configuration_aggregator.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_configuration_aggregator) | resource |
| [aws_config_configuration_recorder.recorder](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_configuration_recorder) | resource |
| [aws_config_configuration_recorder_status.recorder_status](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_configuration_recorder_status) | resource |
| [aws_config_delivery_channel.channel](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/config_delivery_channel) | resource |
| [aws_iam_role_policy_attachment.config_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.organization_config_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_caller_identity.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy.aws_config_built_in_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy) | data source |
| [aws_iam_policy.aws_config_organization_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy) | data source |
| [aws_iam_policy_document.config_s3_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.config_sns_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |
| [aws_region.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_allowed_aws_services_for_sns_published"></a> [allowed\_aws\_services\_for\_sns\_published](#input\_allowed\_aws\_services\_for\_sns\_published) | AWS services that will have permission to publish to SNS topic. Used when no external JSON policy is used | `list(string)` | `[]` | no |
| <a name="input_allowed_iam_arns_for_sns_publish"></a> [allowed\_iam\_arns\_for\_sns\_publish](#input\_allowed\_iam\_arns\_for\_sns\_publish) | IAM role/user ARNs that will have permission to publish to SNS topic. Used when no external json policy is used. | `list(string)` | `[]` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_central_resource_collector_account"></a> [central\_resource\_collector\_account](#input\_central\_resource\_collector\_account) | The account ID of a central account that will aggregate AWS Config from other accounts | `string` | `null` | no |
| <a name="input_child_resource_collector_accounts"></a> [child\_resource\_collector\_accounts](#input\_child\_resource\_collector\_accounts) | The account IDs of other accounts that will send their AWS Configuration to this account | `set(string)` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_iam_role"></a> [create\_iam\_role](#input\_create\_iam\_role) | Flag to indicate whether an IAM Role should be created to grant the proper permissions for AWS Config | `bool` | `false` | no |
| <a name="input_create_organization_aggregator_iam_role"></a> [create\_organization\_aggregator\_iam\_role](#input\_create\_organization\_aggregator\_iam\_role) | Flag to indicate whether an IAM Role should be created to grant the proper permissions for AWS Config to send logs from organization accounts | `bool` | `false` | no |
| <a name="input_create_sns_topic"></a> [create\_sns\_topic](#input\_create\_sns\_topic) | Flag to indicate whether an SNS topic should be created for notifications<br/>If you want to send findings to a new SNS topic, set this to true and provide a valid configuration for subscribers | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_disabled_aggregation_regions"></a> [disabled\_aggregation\_regions](#input\_disabled\_aggregation\_regions) | A list of regions where config aggregation is disabled | `list(string)` | <pre>[<br/>  "ap-northeast-3"<br/>]</pre> | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_findings_notification_arn"></a> [findings\_notification\_arn](#input\_findings\_notification\_arn) | The ARN for an SNS topic to send findings notifications to. This is only used if create\_sns\_topic is false.<br/>If you want to send findings to an existing SNS topic, set the value of this to the ARN of the existing topic and set<br/>create\_sns\_topic to false. | `string` | `null` | no |
| <a name="input_force_destroy"></a> [force\_destroy](#input\_force\_destroy) | A boolean that indicates all objects should be deleted from the bucket so that the bucket can be destroyed without error. These objects are not recoverable | `bool` | `false` | no |
| <a name="input_global_resource_collector_region"></a> [global\_resource\_collector\_region](#input\_global\_resource\_collector\_region) | The region that collects AWS Config data for global resources such as IAM | `string` | n/a | yes |
| <a name="input_iam_role_arn"></a> [iam\_role\_arn](#input\_iam\_role\_arn) | The ARN for an IAM Role AWS Config uses to make read or write requests to the delivery channel and to describe the<br/>AWS resources associated with the account. This is only used if create\_iam\_role is false.<br/><br/>If you want to use an existing IAM Role, set the value of this to the ARN of the existing topic and set<br/>create\_iam\_role to false.<br/><br/>See the AWS Docs for further information:<br/>http://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html | `string` | `null` | no |
| <a name="input_iam_role_organization_aggregator_arn"></a> [iam\_role\_organization\_aggregator\_arn](#input\_iam\_role\_organization\_aggregator\_arn) | The ARN for an IAM Role that AWS Config uses for the organization aggregator that fetches AWS config data from AWS accounts. <br/>This is only used if create\_organization\_aggregator\_iam\_role is false.<br/><br/>If you want to use an existing IAM Role, set the value of this to the ARN of the existing role and set<br/>create\_organization\_aggregator\_iam\_role to false.<br/><br/>See the AWS docs for further information:<br/>http://docs.aws.amazon.com/config/latest/developerguide/iamrole-permissions.html | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_is_organization_aggregator"></a> [is\_organization\_aggregator](#input\_is\_organization\_aggregator) | The aggregator is an AWS Organizations aggregator | `bool` | `false` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_managed_rules"></a> [managed\_rules](#input\_managed\_rules) | A list of AWS Managed Rules that should be enabled on the account.<br/><br/>See the following for a list of possible rules to enable:<br/>https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html | <pre>map(object({<br/>    description      = string<br/>    identifier       = string<br/>    input_parameters = any<br/>    tags             = map(string)<br/>    enabled          = bool<br/>  }))</pre> | `{}` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_recording_mode"></a> [recording\_mode](#input\_recording\_mode) | The mode for AWS Config to record configuration changes. <br/><br/>recording\_frequency:<br/>The frequency with which AWS Config records configuration changes (service defaults to CONTINUOUS).<br/>- CONTINUOUS<br/>- DAILY<br/><br/>You can also override the recording frequency for specific resource types.<br/>recording\_mode\_override:<br/>  description:<br/>    A description for the override.<br/>  recording\_frequency:<br/>    The frequency with which AWS Config records configuration changes for the specified resource types.<br/>    - CONTINUOUS<br/>    - DAILY<br/>  resource\_types:<br/>    A list of resource types for which AWS Config records configuration changes. For example, AWS::EC2::Instance.<br/><br/>See the following for more information:<br/>https://docs.aws.amazon.com/config/latest/developerguide/stop-start-recorder.html<br/><br/>/*<br/>recording\_mode = {<br/>  recording\_frequency = "DAILY"<br/>  recording\_mode\_override = {<br/>    description         = "Override for specific resource types"<br/>    recording\_frequency = "CONTINUOUS"<br/>    resource\_types      = ["AWS::EC2::Instance"]<br/>  }<br/>}<br/>*/ | <pre>object({<br/>    recording_frequency = string<br/>    recording_mode_override = optional(object({<br/>      description         = string<br/>      recording_frequency = string<br/>      resource_types      = list(string)<br/>    }))<br/>  })</pre> | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_s3_bucket_arn"></a> [s3\_bucket\_arn](#input\_s3\_bucket\_arn) | The ARN of the S3 bucket used to store the configuration history | `string` | n/a | yes |
| <a name="input_s3_bucket_id"></a> [s3\_bucket\_id](#input\_s3\_bucket\_id) | The id (name) of the S3 bucket used to store the configuration history | `string` | n/a | yes |
| <a name="input_s3_key_prefix"></a> [s3\_key\_prefix](#input\_s3\_key\_prefix) | The prefix for AWS Config objects stored in the the S3 bucket. If this variable is set to null, the default, no<br/>prefix will be used.<br/><br/>Examples:<br/><br/>with prefix:    {S3\_BUCKET NAME}:/{S3\_KEY\_PREFIX}/AWSLogs/{ACCOUNT\_ID}/Config/*.<br/>without prefix: {S3\_BUCKET NAME}:/AWSLogs/{ACCOUNT\_ID}/Config/*. | `string` | `null` | no |
| <a name="input_sns_encryption_key_id"></a> [sns\_encryption\_key\_id](#input\_sns\_encryption\_key\_id) | The ID of an AWS-managed customer master key (CMK) for Amazon SNS or a custom CMK. | `string` | `""` | no |
| <a name="input_sqs_queue_kms_master_key_id"></a> [sqs\_queue\_kms\_master\_key\_id](#input\_sqs\_queue\_kms\_master\_key\_id) | The ID of an AWS-managed customer master key (CMK) for Amazon SQS Queue or a custom CMK | `string` | `""` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subscribers"></a> [subscribers](#input\_subscribers) | A map of subscription configurations for SNS topics<br/><br/>For more information, see:<br/>https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_subscription#argument-reference<br/><br/>protocol:<br/>  The protocol to use. The possible values for this are: sqs, sms, lambda, application. (http or https are partially<br/>  supported, see link) (email is an option but is unsupported in terraform, see link).<br/>endpoint:<br/>  The endpoint to send data to, the contents will vary with the protocol. (see link for more information)<br/>endpoint\_auto\_confirms (Optional):<br/>  Boolean indicating whether the end point is capable of auto confirming subscription e.g., PagerDuty. Default is<br/>  false<br/>raw\_message\_delivery (Optional):<br/>  Boolean indicating whether or not to enable raw message delivery (the original message is directly passed, not wrapped in JSON with the original message in the message property). Default is false. | `map(any)` | `{}` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_aws_config_configuration_recorder_id"></a> [aws\_config\_configuration\_recorder\_id](#output\_aws\_config\_configuration\_recorder\_id) | The ID of the AWS Config Recorder |
| <a name="output_iam_role"></a> [iam\_role](#output\_iam\_role) | IAM Role used to make read or write requests to the delivery channel and to describe the AWS resources associated with <br/>the account. |
| <a name="output_iam_role_organization_aggregator"></a> [iam\_role\_organization\_aggregator](#output\_iam\_role\_organization\_aggregator) | IAM Role used to make read or write requests to the delivery channel and to describe the AWS resources associated with <br/>the account. |
| <a name="output_sns_topic"></a> [sns\_topic](#output\_sns\_topic) | SNS topic |
| <a name="output_sns_topic_subscriptions"></a> [sns\_topic\_subscriptions](#output\_sns\_topic\_subscriptions) | SNS topic subscriptions |
| <a name="output_storage_bucket_arn"></a> [storage\_bucket\_arn](#output\_storage\_bucket\_arn) | Bucket ARN |
| <a name="output_storage_bucket_id"></a> [storage\_bucket\_id](#output\_storage\_bucket\_id) | Bucket Name (aka ID) |
<!-- markdownlint-restore -->

