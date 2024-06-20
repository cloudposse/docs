---
title: ses-lambda-forwarder
sidebar_label: ses-lambda-forwarder
sidebar_class_name: command
description: |-
  This is a terraform module that creates an email forwarder using a combination of AWS SES and Lambda running the [aws-lambda-ses-forwarder](https://www.npmjs.com/package/aws-lambda-ses-forwarder) NPM module.
custom_edit_url: https://github.com/cloudposse/terraform-aws-ses-lambda-forwarder/blob/main/README.yaml
---

# Module: `ses-lambda-forwarder`
This is a terraform module that creates an email forwarder using a combination of AWS SES and Lambda running the [aws-lambda-ses-forwarder](https://www.npmjs.com/package/aws-lambda-ses-forwarder) NPM module.




## Introduction

This module provisions a NodeJS script as a AWS Lambda function that uses the inbound/outbound capabilities of AWS Simple Email Service (SES) to run a "serverless" email forwarding service.

Use this module instead of setting up an email server on a dedicated EC2 instance to handle email redirects. It uses AWS SES to receive email and then trigger a Lambda function to process it and forward it on to the chosen destination.  This script will allow forwarding emails from any sender to verified destination emails (e.g. opt-in).

## Limitations

The SES service only allows sending email from verified addresses or domains. As such, it's mostly suitable for transactional emails (e.g. alerts or notifications). The incoming messages are modified to allow forwarding through SES and reflect the original sender. This script adds a `Reply-To` header with the original sender's email address, but the `From` header is changed to display the SES email address.

For example, an email sent by `John Doe <jonh@example.com>` to `hello@example.com` will be transformed to:
```
From: John Doe at john@example.com <hello@example.com>
Reply-To: john@example.com
```

To override this behavior, set a verified `fromEmail` address (e.g., `noreply@example.com`) in the config
object and the header will look like this.
```
From: John Doe <noreply@example.com>
Reply-To: john@example.com
```

__NOTE__: SES only allows receiving email sent to addresses within verified domains. For more information,
see: http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html
```

Initially SES users are in a sandbox environment that has a number of limitations. See:
http://docs.aws.amazon.com/ses/latest/DeveloperGuide/limits.html



## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-ses-lambda-forwarder/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-ses-lambda-forwarder/tree/main/test).

```hcl
variable "relay_email" {
  default     = "example@example.com"
  description = "Email that used to relay from"
}

variable "forward_emails" {
  type = map(list(string))

  default = {
    "some_email@example.com"  = ["my_email@example.com"]
    "other_email@example.com" = ["my_email@example.com"]
  }

  description = "Emails forward map"
}

module "ses_lambda_forwarder" {
  source = "cloudposse/ses-lambda-forwarder/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  namespace  = var.namespace
  stage      = var.stage
  name       = var.name
  delimiter  = var.delimiter
  attributes = var.attributes
  tags       = var.tags

  region = var.region
  domain = var.domain

  relay_email    = var.relay_email
  forward_emails = var.forward_emails
}
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_external"></a> [external](#requirement\_external) | >= 1.2 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.3 |
| <a name="requirement_template"></a> [template](#requirement\_template) | >= 2.2 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_artifact"></a> [artifact](#module\_artifact) | cloudposse/module-artifact/external | 0.7.1 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_alias.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_alias) | resource |
| [aws_lambda_function.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_permission.ses](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_route53_record.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.mx](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_route53_record.txt](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_record) | resource |
| [aws_s3_bucket.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy) | resource |
| [aws_ses_active_receipt_rule_set.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_active_receipt_rule_set) | resource |
| [aws_ses_domain_identity.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_domain_identity) | resource |
| [aws_ses_domain_identity_verification.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_domain_identity_verification) | resource |
| [aws_ses_receipt_rule.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_receipt_rule) | resource |
| [aws_ses_receipt_rule_set.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ses_receipt_rule_set) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.assume](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.s3](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_route53_zone.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route53_zone) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_access_log_bucket_name"></a> [access\_log\_bucket\_name](#input\_access\_log\_bucket\_name) | Name of the S3 bucket where s3 access log will be sent to | `string` | `""` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_artifact_filename"></a> [artifact\_filename](#input\_artifact\_filename) | Artifact filename | `string` | `"lambda.zip"` | no |
| <a name="input_artifact_url"></a> [artifact\_url](#input\_artifact\_url) | URL template for the remote artifact | `string` | `"https://artifacts.cloudposse.com/$${module_name}/$${git_ref}/$${filename}"` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_domain"></a> [domain](#input\_domain) | Root domain name | `string` | n/a | yes |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_forward_emails"></a> [forward\_emails](#input\_forward\_emails) | Map of forward emails | `map(list(string))` | <pre>{<br/>  "ops@example.com": [<br/>    "destination@example.com"<br/>  ]<br/>}</pre> | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_lambda_runtime"></a> [lambda\_runtime](#input\_lambda\_runtime) | Lambda runtime | `string` | `"nodejs12.x"` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS Region the SES should reside in | `string` | n/a | yes |
| <a name="input_relay_email"></a> [relay\_email](#input\_relay\_email) | Email that used to relay from | `string` | n/a | yes |
| <a name="input_s3_bucket_encryption_enabled"></a> [s3\_bucket\_encryption\_enabled](#input\_s3\_bucket\_encryption\_enabled) | When set to 'true' the 'aws\_s3\_bucket' resource will have AES256 encryption enabled by default | `bool` | `true` | no |
| <a name="input_spf"></a> [spf](#input\_spf) | DNS SPF record value | `string` | `"v=spf1 include:amazonses.com -all"` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_tracing_config_mode"></a> [tracing\_config\_mode](#input\_tracing\_config\_mode) | Can be either PassThrough or Active. If PassThrough, Lambda will only trace the request from an upstream service if it contains a tracing header with 'sampled=1'. If Active, Lambda will respect any tracing header it receives from an upstream service. | `string` | `"PassThrough"` | no |
| <a name="input_versioning_enabled"></a> [versioning\_enabled](#input\_versioning\_enabled) | A state of versioning. Versioning is a means of keeping multiple variants of an object in the same bucket | `bool` | `true` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_artifact_base64sha256"></a> [artifact\_base64sha256](#output\_artifact\_base64sha256) | Base64 encoded SHA256 hash of the artifact file |
| <a name="output_artifact_file"></a> [artifact\_file](#output\_artifact\_file) | Full path to the locally downloaded artifact |
| <a name="output_artifact_git_ref"></a> [artifact\_git\_ref](#output\_artifact\_git\_ref) | Git commit hash corresponding to the artifact |
| <a name="output_artifact_url"></a> [artifact\_url](#output\_artifact\_url) | URL corresponding to the artifact |
| <a name="output_lambda_function_arn"></a> [lambda\_function\_arn](#output\_lambda\_function\_arn) | Lamnda Function ARN |
| <a name="output_lambda_function_source_code_size"></a> [lambda\_function\_source\_code\_size](#output\_lambda\_function\_source\_code\_size) | The size in bytes of the Lambda Function .zip file |
| <a name="output_lambda_function_version"></a> [lambda\_function\_version](#output\_lambda\_function\_version) | Latest published version of the Lambda Function |
| <a name="output_lambda_iam_policy_arn"></a> [lambda\_iam\_policy\_arn](#output\_lambda\_iam\_policy\_arn) | Lamnda IAM Policy ARN |
| <a name="output_lambda_iam_policy_id"></a> [lambda\_iam\_policy\_id](#output\_lambda\_iam\_policy\_id) | Lamnda IAM Policy ID |
| <a name="output_lambda_iam_policy_name"></a> [lambda\_iam\_policy\_name](#output\_lambda\_iam\_policy\_name) | Lamnda IAM Policy name |
| <a name="output_s3_bucket_arn"></a> [s3\_bucket\_arn](#output\_s3\_bucket\_arn) | Lamnda IAM Policy ARN |
| <a name="output_s3_bucket_domain_name"></a> [s3\_bucket\_domain\_name](#output\_s3\_bucket\_domain\_name) | Lamnda IAM Policy ARN |
| <a name="output_s3_bucket_id"></a> [s3\_bucket\_id](#output\_s3\_bucket\_id) | Lamnda IAM Policy name |
| <a name="output_ses_domain_identity_arn"></a> [ses\_domain\_identity\_arn](#output\_ses\_domain\_identity\_arn) | The ARN of the domain identity |
| <a name="output_ses_domain_identity_verification_arn"></a> [ses\_domain\_identity\_verification\_arn](#output\_ses\_domain\_identity\_verification\_arn) | The ARN of the domain identity |
| <a name="output_ses_receipt_rule_name"></a> [ses\_receipt\_rule\_name](#output\_ses\_receipt\_rule\_name) | The name of the SES receipt rule |
| <a name="output_ses_receipt_rule_set_name"></a> [ses\_receipt\_rule\_set\_name](#output\_ses\_receipt\_rule\_set\_name) | The name of the SES receipt rule set |
<!-- markdownlint-restore -->

