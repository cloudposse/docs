---
title: macie
sidebar_label: macie
sidebar_class_name: command
description: |-
  Terraform module to provision [Amazon Macie](https://aws.amazon.com/macie/) - a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS
custom_edit_url: https://github.com/cloudposse/terraform-aws-macie/blob/main/README.yaml
---

# Module: `macie`
Terraform module to provision [Amazon Macie](https://aws.amazon.com/macie/) - a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS






## Usage

```hcl
  provider "aws" {
    assume_role {
      role_arn = "arn:aws:iam::11111111111:role/my-org-root"
    }
  }
  provider "aws" {
    alias  = "macie_admin" # delegated admin
    assume_role {
      role_arn = "arn:aws:iam::22222222222:role/my-org-security"
    }
  }
  module "macie" {
    source = "cloudposse/macie/aws"
    # Cloud Posse recommends pinning every module to a specific version
    # version     = "x.x.x"
    providers = {
      aws.admin = aws
      aws       = aws.macie_admin
    }
  }
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-macie/examples/complete) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.15.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.38 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.38 |
| <a name="provider_aws.admin"></a> [aws.admin](#provider\_aws.admin) | >= 3.38 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_classification_job_label"></a> [classification\_job\_label](#module\_classification\_job\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_custom_data_identifier_label"></a> [custom\_data\_identifier\_label](#module\_custom\_data\_identifier\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_member_label"></a> [member\_label](#module\_member\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_macie2_account.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/macie2_account) | resource |
| [aws_macie2_classification_job.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/macie2_classification_job) | resource |
| [aws_macie2_custom_data_identifier.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/macie2_custom_data_identifier) | resource |
| [aws_macie2_member.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/macie2_member) | resource |
| [aws_macie2_organization_admin_account.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/macie2_organization_admin_account) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_account_status"></a> [account\_status](#input\_account\_status) | Macie account status. Possible values are `ENABLED` and `PAUSED`. Setting it to `ENABLED` will start all Macie activities for the account. | `bool` | `true` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_admin_account_ids"></a> [admin\_account\_ids](#input\_admin\_account\_ids) | The list of AWS account IDs for the account to designate as the delegated Amazon Macie administrator accounts for the organization. | `list(string)` | `[]` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_classification_jobs"></a> [classification\_jobs](#input\_classification\_jobs) | A list of maps of classification jobs.<br/>  name:<br/>    A custom name for the job.<br/>  description:<br/>    A custom description of the job.<br/>  tags:<br/>    A map of key-value pairs that specifies the tags to associate with the job.<br/>  sampling\_percentage:<br/>    The sampling depth, as a percentage, to apply when processing objects.<br/>    This value determines the percentage of eligible objects that the job analyzes.<br/>  initial\_run:<br/>    Whether to analyze all existing, eligible objects immediately after the job is created.<br/>  job\_type:<br/>    The schedule for running the job.<br/>    If you specify `SCHEDULED` value, use the `schedule_frequency` property to define the recurrence pattern for the job.<br/>    Possible values: `ONE_TIME`, `SCHEDULED`.<br/>  job\_status:<br/>    The status for the job.<br/>    Possible values: `CANCELLED`, `RUNNING` and `USER_PAUSED`.<br/><br/>  schedule\_frequency:<br/>    daily\_schedule:<br/>      Specifies a daily recurrence pattern for running the job.<br/>    weekly\_schedule:<br/>      Specifies a weekly recurrence pattern for running the job.<br/>    monthly\_schedule:<br/>      Specifies a monthly recurrence pattern for running the job. | `list(any)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_custom_data_identifiers"></a> [custom\_data\_identifiers](#input\_custom\_data\_identifiers) | A list of maps of custom data identifiers.<br/>A custom data identifier is a set of criteria that you defined to detect sensitive data in one or more data sources.<br/>  regex:<br/>    The regular expression (regex) that defines the pattern to match.<br/>    The expression can contain as many as 512 characters.<br/>  keywords:<br/>    An array that lists specific character sequences (keywords), one of which must be within proximity (`maximum_match_distance`) of the regular expression to match.<br/>    The array can contain as many as 50 keywords.<br/>    Each keyword can contain 3 - 90 characters. Keywords aren't case sensitive.<br/>  ignore\_words:<br/>    An array that lists specific character sequences (ignore words) to exclude from the results.<br/>    If the text matched by the regular expression is the same as any string in this array, Amazon Macie ignores it.<br/>    The array can contain as many as 10 ignore words.<br/>    Each ignore word can contain 4 - 90 characters.<br/>  maximum\_match\_distance:<br/>    The maximum number of characters that can exist between text that matches the regex pattern and the character sequences specified by the keywords array.<br/>    Macie includes or excludes a result based on the proximity of a keyword to text that matches the regex pattern.<br/>    The distance can be 1 - 300 characters. The default value is 50.<br/>  name:<br/>    A custom name for the custom data identifier.<br/>  description:<br/>    A custom description of the custom data identifier.<br/>  tags:<br/>    A map of key-value pairs that specifies the tags to associate with the custom data identifier. | `list(any)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_finding_publishing_frequency"></a> [finding\_publishing\_frequency](#input\_finding\_publishing\_frequency) | Specifies how often to publish updates to policy findings for the account. This includes publishing updates to AWS Security Hub and Amazon EventBridge (formerly called Amazon CloudWatch Events). Valid values are FIFTEEN\_MINUTES, ONE\_HOUR or SIX\_HOURS. | `string` | `"ONE_HOUR"` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_members"></a> [members](#input\_members) | A list of maps of Amazon Macie Members.<br/>  account\_id:<br/>    The AWS account ID for the account.<br/>  email:<br/>    The email address for the account.<br/>  tags:<br/>    A map of key-value pairs that specifies the tags to associate with the account in Amazon Macie.<br/>  status:<br/>    Specifies the status for the account.<br/>    Possible values: `ENABLED`, `PAUSED`.<br/>  invite:<br/>    Whether to send an invitation to a member.<br/>  invitation\_message:<br/>    A custom message to include in the invitation.<br/>    Amazon Macie adds this message to the standard content that it sends for an invitation.<br/>  invitation\_disable\_email\_notification:<br/>    Whether to send an email notification to the root user of each account that the invitation will be sent to. | `list(any)` | `[]` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_account_id"></a> [account\_id](#output\_account\_id) | The ID of the Macie account. |
| <a name="output_account_service_role_arn"></a> [account\_service\_role\_arn](#output\_account\_service\_role\_arn) | The service role ARN of the Macie account. |
| <a name="output_aws_account_to_org_admin_account_ids"></a> [aws\_account\_to\_org\_admin\_account\_ids](#output\_aws\_account\_to\_org\_admin\_account\_ids) | Map of the AWS account IDs to Macie organization admin account IDs |
| <a name="output_member_accounts"></a> [member\_accounts](#output\_member\_accounts) | List of AWS account IDs the Macie Admin is managing |
| <a name="output_org_admin_account_ids"></a> [org\_admin\_account\_ids](#output\_org\_admin\_account\_ids) | List of IDs of the Macie organization admin accounts. |
<!-- markdownlint-restore -->

