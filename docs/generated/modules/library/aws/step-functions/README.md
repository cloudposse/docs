---
title: step-functions
sidebar_label: step-functions
sidebar_class_name: command
description: |-
  Terraform module to provision [AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html).
tags:
  - aws
  - terraform
  - terraform-modules
  - workflow
  - step-function
  - state
  - state-machine
  - task
  - activity

custom_edit_url: https://github.com/cloudposse/terraform-aws-step-functions/blob/main/README.yaml
---

# Module: `step-functions`
Terraform module to provision [AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html).






## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-step-functions/tree/main/examples/complete)

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-step-functions/tree/main/test).

```hcl
  locals {
    enabled = module.this.enabled

    logging_configuration = {
      include_execution_data = true
      level                  = "ALL"
    }

    # https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html
    # https://docs.aws.amazon.com/step-functions/latest/dg/connect-parameters.html
    definition = {
      "Comment" = "Test Step Function"
      "StartAt" = "Hello"
      "States" = {
        "Hello" = {
          "Type"   = "Pass"
          "Result" = "Hello"
          "Next"   = "World"
        },
        "World" = {
          "Type"   = "Pass"
          "Result" = "World"
          "Next"   = "Send message to SQS"
        },
        # https://docs.aws.amazon.com/step-functions/latest/dg/connect-sqs.html
        "Send message to SQS" = {
          "Type"     = "Task"
          "Resource" = "arn:aws:states:::sqs:sendMessage"
          "Parameters" = {
            "QueueUrl"    = local.enabled ? aws_sqs_queue.default[0].url : ""
            "MessageBody" = "Hello World"
          }
          "Next" = "Publish to SNS"
        }
        # https://docs.aws.amazon.com/step-functions/latest/dg/connect-sns.html
        "Publish to SNS" = {
          "Type"     = "Task",
          "Resource" = "arn:aws:states:::sns:publish"
          "Parameters" = {
            "TopicArn" = module.sns.sns_topic_arn
            "Message"  = "Hello World"
          }
          "End" = true
        }
      }
    }

    iam_policies = {
      # https://docs.aws.amazon.com/step-functions/latest/dg/sns-iam.html
      "SnsAllowPublish" = {
        effect = "Allow"
        actions = [
          "sns:Publish"
        ]
        resources = [
          module.sns.sns_topic_arn
        ]
      }

      # https://docs.aws.amazon.com/step-functions/latest/dg/sqs-iam.html
      "SqsAllowSendMessage" = {
        effect = "Allow"
        actions = [
          "sqs:SendMessage"
        ]
        resources = [
          local.enabled ? aws_sqs_queue.default[0].arn : ""
        ]
      }
    }
  }

  module "step_function" {
    source = "cloudposse/step-functions/aws"
    # Cloud Posse recommends pinning every module to a specific version
    version = "x.x.x"

    type                                   = "EXPRESS"
    tracing_enabled                        = true
    logging_configuration                  = local.logging_configuration
    definition                             = local.definition
    iam_policies                           = local.iam_policies

    context = module.this.context
  }

  module "sns" {
    source  = "cloudposse/sns-topic/aws"
    version = "0.20.2"

    sqs_dlq_enabled    = true
    fifo_topic         = true
    fifo_queue_enabled = true

    context = module.this.context
  }

  resource "aws_sqs_queue" "default" {
    count = local.enabled ? 1 : 0

    name                       = module.this.id
    fifo_queue                 = false
    visibility_timeout_seconds = 30
    message_retention_seconds  = 86400
    max_message_size           = 2048
    delay_seconds              = 90
    receive_wait_time_seconds  = 10

    tags = module.this.tags
  }
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_logs_label"></a> [logs\_label](#module\_logs\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_log_group.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_iam_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy_attachment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy_attachment) | resource |
| [aws_iam_policy_attachment.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy_attachment) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_sfn_state_machine.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sfn_state_machine) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_cloudwatch_log_group_kms_key_id"></a> [cloudwatch\_log\_group\_kms\_key\_id](#input\_cloudwatch\_log\_group\_kms\_key\_id) | The ARN of the KMS Key to use when encrypting log data | `string` | `null` | no |
| <a name="input_cloudwatch_log_group_name"></a> [cloudwatch\_log\_group\_name](#input\_cloudwatch\_log\_group\_name) | Name of Cloudwatch Logs Group to use. If not provided, a name will be generated from the context | `string` | `null` | no |
| <a name="input_cloudwatch_log_group_retention_in_days"></a> [cloudwatch\_log\_group\_retention\_in\_days](#input\_cloudwatch\_log\_group\_retention\_in\_days) | Specifies the number of days to retain log events in the Log Group. Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, and 3653 | `number` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_definition"></a> [definition](#input\_definition) | The Amazon States Language definition for the Step Function. Refer to https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html for more details | `any` | n/a | yes |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_existing_aws_cloudwatch_log_group_arn"></a> [existing\_aws\_cloudwatch\_log\_group\_arn](#input\_existing\_aws\_cloudwatch\_log\_group\_arn) | The Amazon Resource Name (ARN) of the existing CloudWatch Log Group to use for the Step Function. If not provided, a new CloudWatch Log Group will be created | `string` | `null` | no |
| <a name="input_existing_iam_role_arn"></a> [existing\_iam\_role\_arn](#input\_existing\_iam\_role\_arn) | The Amazon Resource Name (ARN) of the existing IAM role to use for the Step Function. If not provided, a new IAM role will be created | `string` | `null` | no |
| <a name="input_iam_policies"></a> [iam\_policies](#input\_iam\_policies) | IAM policies to attach to the created IAM role for the Step Function. The map keys will be used as the policy SIDs | <pre>map(object({<br/>    effect        = string<br/>    actions       = optional(list(string))<br/>    not_actions   = optional(list(string))<br/>    resources     = optional(list(string))<br/>    not_resources = optional(list(string))<br/>    principals = optional(list(object({<br/>      type        = string<br/>      identifiers = list(string)<br/>    })))<br/>    not_principals = optional(list(object({<br/>      type        = string<br/>      identifiers = list(string)<br/>    })))<br/>    condition = optional(list(object({<br/>      test     = string<br/>      variable = string<br/>      values   = list(string)<br/>    })))<br/>  }))</pre> | `{}` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_logging_configuration"></a> [logging\_configuration](#input\_logging\_configuration) | Defines what execution history events are logged and where they are logged | <pre>object({<br/>    log_destination        = optional(string)<br/>    include_execution_data = bool<br/>    level                  = string<br/>  })</pre> | <pre>{<br/>  "include_execution_data": false,<br/>  "level": "OFF"<br/>}</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_role_description"></a> [role\_description](#input\_role\_description) | Description of the created IAM role | `string` | `null` | no |
| <a name="input_role_force_detach_policies"></a> [role\_force\_detach\_policies](#input\_role\_force\_detach\_policies) | Specifies to force detaching any policies the created IAM role has before destroying it | `bool` | `true` | no |
| <a name="input_role_name"></a> [role\_name](#input\_role\_name) | Name of the created IAM role. If not provided, a name will be generated from the context | `string` | `null` | no |
| <a name="input_role_path"></a> [role\_path](#input\_role\_path) | Path of the created IAM role | `string` | `null` | no |
| <a name="input_role_permissions_boundary"></a> [role\_permissions\_boundary](#input\_role\_permissions\_boundary) | The ARN of the policy that is used to set the permissions boundary for the created IAM role | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_step_function_name"></a> [step\_function\_name](#input\_step\_function\_name) | The name of the Step Function. If not provided, a name will be generated from the context | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_tracing_enabled"></a> [tracing\_enabled](#input\_tracing\_enabled) | When set to true, AWS X-Ray tracing is enabled. Make sure the State Machine has the correct IAM policies for logging | `bool` | `false` | no |
| <a name="input_type"></a> [type](#input\_type) | Determines whether a Standard or Express state machine is created. The default is STANDARD. Valid Values: STANDARD, EXPRESS | `string` | `"STANDARD"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_role_arn"></a> [role\_arn](#output\_role\_arn) | The ARN of the IAM role created for the Step Function |
| <a name="output_role_name"></a> [role\_name](#output\_role\_name) | The name of the IAM role created for the Step Function |
| <a name="output_state_machine_arn"></a> [state\_machine\_arn](#output\_state\_machine\_arn) | State machine ARN |
| <a name="output_state_machine_creation_date"></a> [state\_machine\_creation\_date](#output\_state\_machine\_creation\_date) | State machine creation date |
| <a name="output_state_machine_id"></a> [state\_machine\_id](#output\_state\_machine\_id) | State machine ID |
| <a name="output_state_machine_status"></a> [state\_machine\_status](#output\_state\_machine\_status) | State machine status |
<!-- markdownlint-restore -->

