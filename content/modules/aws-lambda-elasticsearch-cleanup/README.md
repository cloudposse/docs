---
title: aws-lambda-elasticsearch-cleanup
sidebar_label: aws-lambda-elasticsearch-cleanup
sidebar_class_name: command
description: |-
  Terraform module to provision a scheduled Lambda function which will
  delete old Elasticsearch indexes using [SigV4Auth](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html) authentication. The
  lambda function can optionally send output to an SNS topic if the
  topic ARN is given. This module was largely inspired by
  [aws-lambda-es-cleanup](https://github.com/cloudreach/aws-lambda-es-cleanup)
custom_edit_url: https://github.com/cloudposse/terraform-aws-lambda-elasticsearch-cleanup/edit/master/README.md
---

# Component: `aws-lambda-elasticsearch-cleanup`
Terraform module to provision a scheduled Lambda function which will
delete old Elasticsearch indexes using [SigV4Auth](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html) authentication. The
lambda function can optionally send output to an SNS topic if the
topic ARN is given. This module was largely inspired by
[aws-lambda-es-cleanup](https://github.com/cloudreach/aws-lambda-es-cleanup)






## Usage


For a complete example, see [examples/complete](examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](test).

```hcl
module "elasticsearch_cleanup" {
  source               = "https://github.com/cloudposse/terraform-aws-lambda-elasticsearch-cleanup.git?ref=master"
  es_endpoint          = module.elasticsearch.domain_endpoint
  es_domain_arn        = module.elasticsearch.domain_arn
  es_security_group_id = module.elasticsearch.security_group_id
  vpc_id               = module.vpc.vpc_id
  namespace            = "eg"
  stage                = "dev"
  schedule             = "cron(0 3 * * ? *)"
}
```

Indexes are expected to be in the format `name-date` where `date` is in the format specified by `var.index_format`.
By default, all indexes except for the ones added by Kibana will be deleted based on the date part of the full
index name. The actual creation date of the index is not used.

Index matching is done with unanchored regular expresssion, so "bar" matches index "foobarbaz".

- If the full index name, including the date part, matches `skip_index_re`, then the index will be skipped (never deleted).
  Kibana indexes are skipped by the default `skip_index_re` of `^\.kibana*` so if you specify a value for `skip_index_re`
  you must include the Kibana exception in your regex if you want it excepted. (Since Kibana indexes do not have a
  date part, this module should not delete them, but will complain about them having malformed dates if they are not excluded.)
- If the index name without the trailing `-date` part matches `index_re`, then it will be cleaned up according to the date part.

Keep in mind that, fundamentally, this module expects indexes to be in the format of `name-date` so it will not work
properly if the regexes end up selecting an index that does not end with `-date`. To avoid edge cases, it is wise not
to include dashes in your index name or date format.

## Migration

Prior to version 0.10.0, this moudle had inputs `index`, which was a comma-separated list of index names or the
special name "all" to indicate all but Kibana indexes, and `index_regex`, which was a regular expression for parsing
index name and date parts. There was no mechanism for specifying a list of indexes to exclude.
Starting with version 0.10.0 this module drops those inputs and instead takes `index_re` and `skip_index_re`,
both of which are regular expressions. (You probably want to anchor your regexes to the beginning of the index name
by starting with `^`).

| If you previously had | Now use |
|----------------------|----------|
|`index = "all"`| Default values for `index_re` and `skip_index_re`|
|`index = "a,xb,c0"` | `index_re = "^(a\|xb\|c0)"` and `skip_index_re = "^$"`|
|`index_regex = "(ipat)-(dpat)"`|`index_re = "ipat"` and be sure `index_format` is correct for your date format|






<!-- markdownlint-disable -->
## Makefile Targets
```text
Available targets:

  build                               Build Lambda function zip
  dependencies                        Install dependencies
  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```
<!-- markdownlint-restore -->
<!-- markdownlint-disable -->
## Module: cloudposse/terraform-aws-lambda-elasticsearch-cleanup

This module creates a scheduled Lambda function which will delete old
Elasticsearch indexes using SigV4Auth authentication. The lambda
function can optionally send output to an SNS topic if the topic ARN
is given

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_artifact"></a> [artifact](#module\_artifact) | cloudposse/module-artifact/external | 0.7.1 |
| <a name="module_label"></a> [label](#module\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_event_rule.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_rule) | resource |
| [aws_cloudwatch_event_target.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_event_target) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy_attachment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_function.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_permission.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_security_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.egress_from_lambda_to_es_cluster](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ingress_to_es_cluster_from_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.tcp_dns_egress_from_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.udp_dns_egress_from_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_iam_policy_document.assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.es_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.sns](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_artifact_git_ref"></a> [artifact\_git\_ref](#input\_artifact\_git\_ref) | Git ref of the lambda artifact to use. Use latest version if null. | `string` | `""` | no |
| <a name="input_artifact_url"></a> [artifact\_url](#input\_artifact\_url) | URL template for the remote artifact | `string` | `"https://artifacts.cloudposse.com/$${module_name}/$${git_ref}/$${filename}"` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delete_after"></a> [delete\_after](#input\_delete\_after) | Number of days to preserve | `number` | `15` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_es_domain_arn"></a> [es\_domain\_arn](#input\_es\_domain\_arn) | The Elasticsearch domain ARN | `string` | n/a | yes |
| <a name="input_es_endpoint"></a> [es\_endpoint](#input\_es\_endpoint) | The Elasticsearch endpoint for the Lambda function to connect to | `string` | n/a | yes |
| <a name="input_es_security_group_id"></a> [es\_security\_group\_id](#input\_es\_security\_group\_id) | The Elasticsearch cluster security group ID | `string` | n/a | yes |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_index_format"></a> [index\_format](#input\_index\_format) | Combined with 'index' variable and is used to evaluate the index age | `string` | `"%Y.%m.%d"` | no |
| <a name="input_index_re"></a> [index\_re](#input\_index\_re) | Regular Expression that matches the index names to clean up (not including trailing dash and date) | `string` | `".*"` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_python_version"></a> [python\_version](#input\_python\_version) | The Python version to use | `string` | `"3.7"` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_schedule"></a> [schedule](#input\_schedule) | CloudWatch Events rule schedule using cron or rate expression | `string` | `"cron(0 3 * * ? *)"` | no |
| <a name="input_skip_index_re"></a> [skip\_index\_re](#input\_skip\_index\_re) | Regular Expression that matches the index names to ignore (not clean up). Takes precedence over `index_re`.<br/>BY DEFAULT (when value is `null`), a pattern is used to exclude Kibana indexes.<br/>Use `"^$"` if you do not want to skip any indexes. Include an exclusion for `kibana` if you<br/>want to use a custom value and also exclude the kibana indexes. | `string` | `null` | no |
| <a name="input_sns_arn"></a> [sns\_arn](#input\_sns\_arn) | SNS ARN to publish alerts | `string` | `""` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | Subnet IDs | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_timeout"></a> [timeout](#input\_timeout) | Timeout for Lambda function in seconds | `number` | `300` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The VPC ID for the Lambda function | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_lambda_function_arn"></a> [lambda\_function\_arn](#output\_lambda\_function\_arn) | ARN of the Lambda Function |
| <a name="output_lambda_function_source_code_size"></a> [lambda\_function\_source\_code\_size](#output\_lambda\_function\_source\_code\_size) | The size in bytes of the function .zip file |
| <a name="output_security_group_id"></a> [security\_group\_id](#output\_security\_group\_id) | Security Group ID of the Lambda Function |
<!-- markdownlint-restore -->


