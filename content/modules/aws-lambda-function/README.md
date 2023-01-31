---
title: aws-lambda-function
sidebar_label: aws-lambda-function
sidebar_class_name: command
description: |-
  This module deploys an AWS Lambda function from a Zip file or from a Docker image. Additionally, it creates an IAM 
  role for the Lambda function, which optionally attaches policies to allow for CloudWatch Logs, Cloudwatch Insights, 
  VPC Access and X-Ray tracing.
custom_edit_url: https://github.com/cloudposse/terraform-aws-lambda-function/edit/main/README.md
---

# Component: `aws-lambda-function`
This module deploys an AWS Lambda function from a Zip file or from a Docker image. Additionally, it creates an IAM 
role for the Lambda function, which optionally attaches policies to allow for CloudWatch Logs, Cloudwatch Insights, 
VPC Access and X-Ray tracing.






## Usage

For a complete example, see [examples/complete](examples/complete).
For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](test).

```hcl
module "lambda" {
  source  = "cloudposse/lambda-function/aws"
  version = "xxxx"

  filename      = "lambda.zip"
  function_name = "my-function"
  handler       = "handler.handler"
  runtime       = "nodejs14.x"
}
```




## Examples

- [`examples/complete`](https://github.com/cloudposse/terraform-aws-lambda-function/blob/main/examples/complete) - complete example of using this module
- [`examples/docker-image`](https://github.com/cloudposse/terraform-aws-lambda-function/blob/main/examples/docker-image) - example of using Lambda with Docker images



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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cloudwatch_log_group"></a> [cloudwatch\_log\_group](#module\_cloudwatch\_log\_group) | cloudposse/cloudwatch-logs/aws | 0.6.6 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.cloudwatch_insights](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.cloudwatch_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.custom](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.vpc_access](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_iam_role_policy_attachment.xray](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_function.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_caller_identity.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.assume_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_partition.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/partition) | data source |
| [aws_region.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_architectures"></a> [architectures](#input\_architectures) | Instruction set architecture for your Lambda function. Valid values are ["x86\_64"] and ["arm64"].<br/>    Default is ["x86\_64"]. Removing this attribute, function's architecture stay the same. | `list(string)` | `null` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_cloudwatch_event_rules"></a> [cloudwatch\_event\_rules](#input\_cloudwatch\_event\_rules) | Creates EventBridge (CloudWatch Events) rules for invoking the Lambda Function along with the required permissions. | `map(any)` | `{}` | no |
| <a name="input_cloudwatch_lambda_insights_enabled"></a> [cloudwatch\_lambda\_insights\_enabled](#input\_cloudwatch\_lambda\_insights\_enabled) | Enable CloudWatch Lambda Insights for the Lambda Function. | `bool` | `false` | no |
| <a name="input_cloudwatch_log_subscription_filters"></a> [cloudwatch\_log\_subscription\_filters](#input\_cloudwatch\_log\_subscription\_filters) | CloudWatch Logs subscription filter resources. Currently supports only Lambda functions as destinations. | `map(any)` | `{}` | no |
| <a name="input_cloudwatch_logs_kms_key_arn"></a> [cloudwatch\_logs\_kms\_key\_arn](#input\_cloudwatch\_logs\_kms\_key\_arn) | The ARN of the KMS Key to use when encrypting log data. | `string` | `null` | no |
| <a name="input_cloudwatch_logs_retention_in_days"></a> [cloudwatch\_logs\_retention\_in\_days](#input\_cloudwatch\_logs\_retention\_in\_days) | Specifies the number of days you want to retain log events in the specified log group. Possible values are:<br/>  1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653, and 0. If you select 0, the events in the<br/>  log group are always retained and never expire. | `number` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_custom_iam_policy_arns"></a> [custom\_iam\_policy\_arns](#input\_custom\_iam\_policy\_arns) | ARNs of custom policies to be attached to the lambda role | `set(string)` | `[]` | no |
| <a name="input_dead_letter_config_target_arn"></a> [dead\_letter\_config\_target\_arn](#input\_dead\_letter\_config\_target\_arn) | ARN of an SNS topic or SQS queue to notify when an invocation fails. If this option is used, the function's IAM role<br/>  must be granted suitable access to write to the target object, which means allowing either the sns:Publish or<br/>  sqs:SendMessage action on this ARN, depending on which service is targeted." | `string` | `null` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_description"></a> [description](#input\_description) | Description of what the Lambda Function does. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_event_source_mappings"></a> [event\_source\_mappings](#input\_event\_source\_mappings) | Creates event source mappings to allow the Lambda function to get events from Kinesis, DynamoDB and SQS. The IAM role<br/>  of this Lambda function will be enhanced with necessary minimum permissions to get those events. | `any` | `{}` | no |
| <a name="input_filename"></a> [filename](#input\_filename) | The path to the function's deployment package within the local filesystem. If defined, The s3\_-prefixed options and image\_uri cannot be used. | `string` | `null` | no |
| <a name="input_function_name"></a> [function\_name](#input\_function\_name) | Unique name for the Lambda Function. | `string` | n/a | yes |
| <a name="input_handler"></a> [handler](#input\_handler) | The function entrypoint in your code. | `string` | `null` | no |
| <a name="input_iam_policy_description"></a> [iam\_policy\_description](#input\_iam\_policy\_description) | Description of the IAM policy for the Lambda IAM role | `string` | `"Provides minimum SSM read permissions."` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_ignore_external_function_updates"></a> [ignore\_external\_function\_updates](#input\_ignore\_external\_function\_updates) | Ignore updates to the Lambda Function executed externally to the Terraform lifecycle. Set this to `true` if you're<br/>  using CodeDeploy, aws CLI or other external tools to update the Lambda Function code." | `bool` | `false` | no |
| <a name="input_image_config"></a> [image\_config](#input\_image\_config) | The Lambda OCI [image configurations](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#image_config)<br/>  block with three (optional) arguments:<br/>  - *entry\_point* - The ENTRYPOINT for the docker image (type `list(string)`).<br/>  - *command* - The CMD for the docker image (type `list(string)`).<br/>  - *working\_directory* - The working directory for the docker image (type `string`). | `any` | `{}` | no |
| <a name="input_image_uri"></a> [image\_uri](#input\_image\_uri) | The ECR image URI containing the function's deployment package. Conflicts with filename, s3\_bucket, s3\_key, and s3\_object\_version. | `string` | `null` | no |
| <a name="input_kms_key_arn"></a> [kms\_key\_arn](#input\_kms\_key\_arn) | Amazon Resource Name (ARN) of the AWS Key Management Service (KMS) key that is used to encrypt environment variables.<br/>  If this configuration is not provided when environment variables are in use, AWS Lambda uses a default service key.<br/>  If this configuration is provided when environment variables are not in use, the AWS Lambda API does not save this<br/>  configuration and Terraform will show a perpetual difference of adding the key. To fix the perpetual difference,<br/>  remove this configuration. | `string` | `""` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_lambda_at_edge_enabled"></a> [lambda\_at\_edge\_enabled](#input\_lambda\_at\_edge\_enabled) | Enable Lambda@Edge for your Node.js or Python functions. The required trust relationship and publishing of function versions will be configured in this module. | `bool` | `false` | no |
| <a name="input_lambda_environment"></a> [lambda\_environment](#input\_lambda\_environment) | Environment (e.g. env variables) configuration for the Lambda function enable you to dynamically pass settings to your function code and libraries. | <pre>object({<br/>    variables = map(string)<br/>  })</pre> | `null` | no |
| <a name="input_layers"></a> [layers](#input\_layers) | List of Lambda Layer Version ARNs (maximum of 5) to attach to the Lambda Function. | `list(string)` | `[]` | no |
| <a name="input_memory_size"></a> [memory\_size](#input\_memory\_size) | Amount of memory in MB the Lambda Function can use at runtime. | `number` | `128` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_package_type"></a> [package\_type](#input\_package\_type) | The Lambda deployment package type. Valid values are Zip and Image. | `string` | `"Zip"` | no |
| <a name="input_permissions_boundary"></a> [permissions\_boundary](#input\_permissions\_boundary) | ARN of the policy that is used to set the permissions boundary for the role | `string` | `""` | no |
| <a name="input_publish"></a> [publish](#input\_publish) | Whether to publish creation/change as new Lambda Function Version. | `bool` | `false` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_reserved_concurrent_executions"></a> [reserved\_concurrent\_executions](#input\_reserved\_concurrent\_executions) | The amount of reserved concurrent executions for this lambda function. A value of 0 disables lambda from being triggered and -1 removes any concurrency limitations. | `number` | `-1` | no |
| <a name="input_runtime"></a> [runtime](#input\_runtime) | The runtime environment for the Lambda function you are uploading. | `string` | `null` | no |
| <a name="input_s3_bucket"></a> [s3\_bucket](#input\_s3\_bucket) | The S3 bucket location containing the function's deployment package. Conflicts with filename and image\_uri.<br/>  This bucket must reside in the same AWS region where you are creating the Lambda function. | `string` | `null` | no |
| <a name="input_s3_key"></a> [s3\_key](#input\_s3\_key) | The S3 key of an object containing the function's deployment package. Conflicts with filename and image\_uri. | `string` | `null` | no |
| <a name="input_s3_object_version"></a> [s3\_object\_version](#input\_s3\_object\_version) | The object version containing the function's deployment package. Conflicts with filename and image\_uri. | `string` | `null` | no |
| <a name="input_sns_subscriptions"></a> [sns\_subscriptions](#input\_sns\_subscriptions) | Creates subscriptions to SNS topics which trigger the Lambda Function. Required Lambda invocation permissions will be generated. | `map(any)` | `{}` | no |
| <a name="input_source_code_hash"></a> [source\_code\_hash](#input\_source\_code\_hash) | Used to trigger updates. Must be set to a base64-encoded SHA256 hash of the package file specified with either<br/>  filename or s3\_key. The usual way to set this is filebase64sha256('file.zip') where 'file.zip' is the local filename<br/>  of the lambda function source archive. | `string` | `""` | no |
| <a name="input_ssm_parameter_names"></a> [ssm\_parameter\_names](#input\_ssm\_parameter\_names) | List of AWS Systems Manager Parameter Store parameter names. The IAM role of this Lambda function will be enhanced<br/>  with read permissions for those parameters. Parameters must start with a forward slash and can be encrypted with the<br/>  default KMS key. | `list(string)` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_timeout"></a> [timeout](#input\_timeout) | The amount of time the Lambda Function has to run in seconds. | `number` | `3` | no |
| <a name="input_tracing_config_mode"></a> [tracing\_config\_mode](#input\_tracing\_config\_mode) | Tracing config mode of the Lambda function. Can be either PassThrough or Active. | `string` | `null` | no |
| <a name="input_vpc_config"></a> [vpc\_config](#input\_vpc\_config) | Provide this to allow your function to access your VPC (if both 'subnet\_ids' and 'security\_group\_ids' are empty then<br/>  vpc\_config is considered to be empty or unset, see https://docs.aws.amazon.com/lambda/latest/dg/vpc.html for details). | <pre>object({<br/>    security_group_ids = list(string)<br/>    subnet_ids         = list(string)<br/>  })</pre> | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_arn"></a> [arn](#output\_arn) | ARN of the lambda function |
| <a name="output_function_name"></a> [function\_name](#output\_function\_name) | Lambda function name |
| <a name="output_invoke_arn"></a> [invoke\_arn](#output\_invoke\_arn) | Invoke ARN of the lambda function |
| <a name="output_qualified_arn"></a> [qualified\_arn](#output\_qualified\_arn) | ARN identifying your Lambda Function Version (if versioning is enabled via publish = true) |
| <a name="output_role_arn"></a> [role\_arn](#output\_role\_arn) | Lambda IAM role ARN |
| <a name="output_role_name"></a> [role\_name](#output\_role\_name) | Lambda IAM role name |
<!-- markdownlint-restore -->


