---
title: code-deploy
sidebar_label: code-deploy
sidebar_class_name: command
description: |-
  Terraform module to provision AWS Code Deploy app and group.
custom_edit_url: https://github.com/cloudposse/terraform-aws-code-deploy/blob/main/README.yaml
---

# Module: `code-deploy`
Terraform module to provision AWS Code Deploy app and group.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-code-deploy/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-code-deploy/tree/main/test).

```hcl
module "example" {
  source = "cloudposse/code-deploy/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-code-deploy/) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.2 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_sns_topic"></a> [sns\_topic](#module\_sns\_topic) | cloudposse/sns-topic/aws | 0.21.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_codedeploy_app.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codedeploy_app) | resource |
| [aws_codedeploy_deployment_config.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codedeploy_deployment_config) | resource |
| [aws_codedeploy_deployment_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codedeploy_deployment_group) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_alarm_configuration"></a> [alarm\_configuration](#input\_alarm\_configuration) | Configuration of deployment to stop when a CloudWatch alarm detects that a metric has fallen below or exceeded a defined threshold.<br/> alarms:<br/>   A list of alarms configured for the deployment group.<br/> ignore\_poll\_alarm\_failure:<br/>   Indicates whether a deployment should continue if information about the current state of alarms cannot be retrieved from CloudWatch. | <pre>object({<br/>    alarms                    = list(string)<br/>    ignore_poll_alarm_failure = bool<br/>  })</pre> | `null` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_auto_rollback_configuration_events"></a> [auto\_rollback\_configuration\_events](#input\_auto\_rollback\_configuration\_events) | The event type or types that trigger a rollback. Supported types are `DEPLOYMENT_FAILURE` and `DEPLOYMENT_STOP_ON_ALARM`. | `string` | `"DEPLOYMENT_FAILURE"` | no |
| <a name="input_autoscaling_groups"></a> [autoscaling\_groups](#input\_autoscaling\_groups) | A list of Autoscaling Groups associated with the deployment group. | `list(string)` | `[]` | no |
| <a name="input_blue_green_deployment_config"></a> [blue\_green\_deployment\_config](#input\_blue\_green\_deployment\_config) | Configuration block of the blue/green deployment options for a deployment group, <br/>see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codedeploy_deployment_group#blue_green_deployment_config | `any` | `null` | no |
| <a name="input_compute_platform"></a> [compute\_platform](#input\_compute\_platform) | The compute platform can either be `ECS`, `Lambda`, or `Server` | `string` | `"ECS"` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_default_service_role"></a> [create\_default\_service\_role](#input\_create\_default\_service\_role) | Whether to create default IAM role ARN that allows deployments. | `bool` | `true` | no |
| <a name="input_create_default_sns_topic"></a> [create\_default\_sns\_topic](#input\_create\_default\_sns\_topic) | Whether to create default SNS topic through which notifications are sent. | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_deployment_style"></a> [deployment\_style](#input\_deployment\_style) | Configuration of the type of deployment, either in-place or blue/green, <br/>you want to run and whether to route deployment traffic behind a load balancer.<br/><br/>deployment\_option:<br/>  Indicates whether to route deployment traffic behind a load balancer. <br/>  Possible values: `WITH_TRAFFIC_CONTROL`, `WITHOUT_TRAFFIC_CONTROL`.<br/>deployment\_type:<br/>  Indicates whether to run an in-place deployment or a blue/green deployment.<br/>  Possible values: `IN_PLACE`, `BLUE_GREEN`. | <pre>object({<br/>    deployment_option = string<br/>    deployment_type   = string<br/>  })</pre> | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_ec2_tag_filter"></a> [ec2\_tag\_filter](#input\_ec2\_tag\_filter) | The Amazon EC2 tags on which to filter. The deployment group includes EC2 instances with any of the specified tags.<br/>Cannot be used in the same call as ec2TagSet. | <pre>set(object({<br/>    key   = string<br/>    type  = string<br/>    value = string<br/>  }))</pre> | `[]` | no |
| <a name="input_ec2_tag_set"></a> [ec2\_tag\_set](#input\_ec2\_tag\_set) | A list of sets of tag filters. If multiple tag groups are specified,<br/>any instance that matches to at least one tag filter of every tag group is selected.<br/><br/>key:<br/>  The key of the tag filter.<br/>type:<br/>  The type of the tag filter, either `KEY_ONLY`, `VALUE_ONLY`, or `KEY_AND_VALUE`.<br/>value:<br/>  The value of the tag filter. | <pre>set(object(<br/>    {<br/>      ec2_tag_filter = set(object(<br/>        {<br/>          key   = string<br/>          type  = string<br/>          value = string<br/>        }<br/>      ))<br/>    }<br/>  ))</pre> | `[]` | no |
| <a name="input_ecs_service"></a> [ecs\_service](#input\_ecs\_service) | Configuration block(s) of the ECS services for a deployment group.<br/><br/>cluster\_name:<br/>  The name of the ECS cluster. <br/>service\_name:<br/>  The name of the ECS service. | <pre>list(object({<br/>    cluster_name = string<br/>    service_name = string<br/>  }))</pre> | `null` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_load_balancer_info"></a> [load\_balancer\_info](#input\_load\_balancer\_info) | Single configuration block of the load balancer to use in a blue/green deployment, <br/>see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/codedeploy_deployment_group#load_balancer_info | `map(any)` | `null` | no |
| <a name="input_minimum_healthy_hosts"></a> [minimum\_healthy\_hosts](#input\_minimum\_healthy\_hosts) | type:<br/>  The type can either be `FLEET_PERCENT` or `HOST_COUNT`.<br/>value:<br/>  The value when the type is `FLEET_PERCENT` represents the minimum number of healthy instances <br/>  as a percentage of the total number of instances in the deployment.<br/>  When the type is `HOST_COUNT`, the value represents the minimum number of healthy instances as an absolute value. | <pre>object({<br/>    type  = string<br/>    value = number<br/>  })</pre> | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_service_role_arn"></a> [service\_role\_arn](#input\_service\_role\_arn) | The service IAM role ARN that allows deployments. | `string` | `null` | no |
| <a name="input_sns_topic_arn"></a> [sns\_topic\_arn](#input\_sns\_topic\_arn) | The ARN of the SNS topic through which notifications are sent. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_traffic_routing_config"></a> [traffic\_routing\_config](#input\_traffic\_routing\_config) | type:<br/>  Type of traffic routing config. One of `TimeBasedCanary`, `TimeBasedLinear`, `AllAtOnce`.<br/>interval:<br/>  The number of minutes between the first and second traffic shifts of a deployment.<br/>percentage:<br/>  The percentage of traffic to shift in the first increment of a deployment. | <pre>object({<br/>    type       = string<br/>    interval   = number<br/>    percentage = number<br/>  })</pre> | `null` | no |
| <a name="input_trigger_events"></a> [trigger\_events](#input\_trigger\_events) | The event type or types for which notifications are triggered. <br/>Some values that are supported: <br/>  `DeploymentStart`, `DeploymentSuccess`, `DeploymentFailure`, `DeploymentStop`, <br/>  `DeploymentRollback`, `InstanceStart`, `InstanceSuccess`, `InstanceFailure`. <br/>See the CodeDeploy documentation for all possible values.<br/>http://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-sns-event-notifications-create-trigger.html | `list(string)` | <pre>[<br/>  "DeploymentFailure"<br/>]</pre> | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_deployment_config_id"></a> [deployment\_config\_id](#output\_deployment\_config\_id) | The deployment config ID. |
| <a name="output_deployment_config_name"></a> [deployment\_config\_name](#output\_deployment\_config\_name) | The deployment group's config name. |
| <a name="output_group_id"></a> [group\_id](#output\_group\_id) | The application group ID. |
| <a name="output_id"></a> [id](#output\_id) | The application ID. |
| <a name="output_name"></a> [name](#output\_name) | The application's name. |
<!-- markdownlint-restore -->

