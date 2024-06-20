---
title: cloudtrail-cloudwatch-alarms
sidebar_label: cloudtrail-cloudwatch-alarms
sidebar_class_name: command
description: |-
  Terraform module for creating alarms for tracking important changes and occurances from cloudtrail.

  This module creates a set of filter metrics and alarms based on the security best practices covered in the [AWS CIS Foundations Benchmark](https://d0.awsstatic.com/whitepapers/compliance/AWS_CIS_Foundations_Benchmark.pdf) guide.
custom_edit_url: https://github.com/cloudposse/terraform-aws-cloudtrail-cloudwatch-alarms/blob/main/README.yaml
---

# Module: `cloudtrail-cloudwatch-alarms`
Terraform module for creating alarms for tracking important changes and occurances from cloudtrail.

This module creates a set of filter metrics and alarms based on the security best practices covered in the [AWS CIS Foundations Benchmark](https://d0.awsstatic.com/whitepapers/compliance/AWS_CIS_Foundations_Benchmark.pdf) guide.






## Usage

```hcl
module "metric_configs" {
  source  = "cloudposse/config/yaml"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  map_config_local_base_path = "./catalog"
  map_config_paths           = "*.yaml"

  context = module.this.context
}

module "cloudtrail_api_alarms" {
  source  = "cloudposse/cloudtrail-cloudwatch-alarms/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  log_group_name = "${aws_cloudwatch_log_group.default.name}"
  metrics = module.metric_configs.map_configs
}
```
For detailed usage which includes setting up cloudtrail, cloudwatch logs, roles, policies, and the s3 bucket - as well as using this module see the [example directory](https://github.com/cloudposse/terraform-aws-cloudtrail-cloudwatch-alarms/tree/main/examples/complete)

For aditional CIS rules and controls https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html#securityhub-cis-controls-3.8




## Examples

Here's a complete [example](https://github.com/cloudposse/terraform-aws-cloudtrail-cloudwatch-alarms/tree/main/examples/complete/main.tf) of using this `terraform-aws-cloudtrail-cloudwatch-alarms` module.



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_aws_sns_topic_label"></a> [aws\_sns\_topic\_label](#module\_aws\_sns\_topic\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_sns_kms_key"></a> [sns\_kms\_key](#module\_sns\_kms\_key) | cloudposse/kms-key/aws | 0.10.0 |
| <a name="module_sns_kms_key_label"></a> [sns\_kms\_key\_label](#module\_sns\_kms\_key\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_dashboard.combined](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) | resource |
| [aws_cloudwatch_dashboard.individual](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_dashboard) | resource |
| [aws_cloudwatch_log_metric_filter.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_metric_filter) | resource |
| [aws_cloudwatch_metric_alarm.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_sns_topic.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic) | resource |
| [aws_sns_topic_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sns_topic_policy) | resource |
| [aws_caller_identity.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.sns_kms_key_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.sns_topic_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_endpoint_arns"></a> [additional\_endpoint\_arns](#input\_additional\_endpoint\_arns) | Any alert endpoints, such as autoscaling, or app scaling endpoint arns that will respond to an alert | `list(string)` | `[]` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_dashboard_enabled"></a> [dashboard\_enabled](#input\_dashboard\_enabled) | When true a dashboard that displays the statistics as a line graph will be created in CloudWatch | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kms_master_key_id"></a> [kms\_master\_key\_id](#input\_kms\_master\_key\_id) | The ID or alias of the customer master key (CMK) to use for encrypting the Amazon SNS topic.<br/>  The CMK must have its resource-based policy allow the service `cloudwatch.amazonaws.com` to perform `kms:Decrypt` and `kms:GenerateDataKey` on it.<br/>  If this variable is not supplied, a CMK with the sufficient resource-based policy will be created and used when configuring encryption for<br/>  the SNS topic. | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_log_group_name"></a> [log\_group\_name](#input\_log\_group\_name) | The cloudtrail cloudwatch log group name | `string` | n/a | yes |
| <a name="input_log_group_region"></a> [log\_group\_region](#input\_log\_group\_region) | The log group region that should be monitored for unauthorised AWS API Access. Current region used if none provided. | `string` | `""` | no |
| <a name="input_metric_namespace"></a> [metric\_namespace](#input\_metric\_namespace) | A namespace for grouping all of the metrics together | `string` | `"CISBenchmark"` | no |
| <a name="input_metrics"></a> [metrics](#input\_metrics) | The cloudwatch metrics and corresponding alarm definitions | <pre>map(object({<br/>    metric_name               = string<br/>    filter_pattern            = string<br/>    metric_namespace          = string<br/>    metric_value              = string<br/>    alarm_name                = string<br/>    alarm_comparison_operator = string<br/>    alarm_evaluation_periods  = string<br/>    alarm_period              = string<br/>    alarm_statistic           = string<br/>    alarm_treat_missing_data  = string<br/>    alarm_threshold           = string<br/>    alarm_description         = string<br/>  }))</pre> | `{}` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_sns_policy_enabled"></a> [sns\_policy\_enabled](#input\_sns\_policy\_enabled) | Attach a policy that allows the notifications through to the SNS topic endpoint | `bool` | `false` | no |
| <a name="input_sns_topic_arn"></a> [sns\_topic\_arn](#input\_sns\_topic\_arn) | An SNS topic ARN that has already been created. Its policy must already allow access from CloudWatch Alarms, or set `add_sns_policy` to `true` | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_dashboard_combined"></a> [dashboard\_combined](#output\_dashboard\_combined) | URL to CloudWatch Combined Metric Dashboard |
| <a name="output_dashboard_individual"></a> [dashboard\_individual](#output\_dashboard\_individual) | URL to CloudWatch Individual Metric Dashboard |
| <a name="output_sns_topic_arn"></a> [sns\_topic\_arn](#output\_sns\_topic\_arn) | The ARN of the SNS topic used |
<!-- markdownlint-restore -->
## Metrics Tracked

|  Alarm's Name |  Description       |
|:--------------|:-------------------|
|  `AuthorizationFailureCount`       |  Alarms when an unauthorized API call is made.  |
|  `S3BucketActivityEventCount`      |  Alarms when an API call is made to S3 to put or delete a Bucket, Bucket Policy or Bucket ACL.  |
|  `SecurityGroupEventCount`         |  Alarms when an API call is made to create, update or delete a Security Group.  |
|  `NetworkAclEventCount`            |  Alarms when an API call is made to create, update or delete a Network ACL.  |
|  `GatewayEventCount`               |  Alarms when an API call is made to create, update or delete a Customer or Internet Gateway.  |
|  `VpcEventCount`                   |  Alarms when an API call is made to create, update or delete a VPC, VPC peering connection or VPC connection to classic.  |
|  `EC2InstanceEventCount`           |  Alarms when an API call is made to create, terminate, start, stop or reboot an EC2 instance.  |
|  `EC2LargeInstanceEventCount`      |  Alarms when an API call is made to create, terminate, start, stop or reboot a 4x-large or greater EC2 instance.  |
|  `CloudTrailEventCount`            |  Alarms when an API call is made to create, update or delete a .cloudtrail. trail, or to start or stop logging to a trail.  |
|  `ConsoleSignInFailureCount`       |  Alarms when an unauthenticated API call is made to sign into the console.  |
|  `IAMPolicyEventCount`             |  Alarms when an API call is made to change an IAM policy.   |
|  `ConsoleSignInWithoutMfaCount`    |  Alarms when a user logs into the console without MFA.   |
|  `RootAccountUsageCount`           |  Alarms when a root account usage is detected.   |
|  `KMSKeyPendingDeletionErrorCount` |  Alarms when a customer created KMS key is pending deletion.    |
|  `AWSConfigChangeCount`            |  Alarms when AWS Config changes.   |
|  `RouteTableChangesCount`          |  Alarms when route table changes are detected.   |

## Dashboard Created

Two CloudWatch Dashboards can be created as well, and will be automatically created by default.

![CloudWatch Dashboard](https://github.com/cloudposse/terraform-aws-cloudtrail-cloudwatch-alarms/tree/main/docs/screen1.png)

## Credits

The alarm metric names, descriptions, and filters [from this repository were used](https://github.com/TeliaSoneraNorge/telia-terraform-modules/tree/master/cloudtrail-forwarder).

With many thanks to [Anton Babenko](https://github.com/antonbabenko) for pointing it out and saving us a lot of time scouring reference documents and describing alarms!



