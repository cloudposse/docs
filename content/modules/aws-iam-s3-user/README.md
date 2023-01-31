---
title: aws-iam-s3-user
sidebar_label: aws-iam-s3-user
sidebar_class_name: command
description: |-
  Terraform module to provision a basic IAM user with permissions to access S3 resources, 
  e.g. to give the user read/write/delete access to the objects in an S3 bucket.

  Suitable for CI/CD systems (_e.g._ TravisCI, CircleCI) or systems which are *external* to AWS 
  that cannot leverage [AWS IAM Instance Profiles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)
  or [AWS OIDC](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html).

  By default, IAM users, groups, and roles have no access to AWS resources. 
  IAM policies are the means by which privileges are granted to users, groups, or roles. 
  It is recommended that IAM policies be applied directly to groups and roles but not users.
  **This module intentionally attaches an IAM policy directly to the user and does not use groups**

  The IAM user name is constructed using [terraform-null-label](https://github.com/cloudposse/terraform-null-label)
  and some input is required. The simplest input is `name`. By default the name will be converted to lower case
  and all non-alphanumeric characters except for hyphen will be removed. See the documentation for `terraform-null-label`
  to learn how to override these defaults if desired.

  If an AWS Access Key is created, it is stored either in SSM Parameter Store or is provided as a module output,
  but not both. Using SSM Parameter Store is recommended because module outputs are stored in plaintext in
  the Terraform state file.
custom_edit_url: https://github.com/cloudposse/terraform-aws-iam-s3-user/edit/master/README.md
---

# Component: `aws-iam-s3-user`
Terraform module to provision a basic IAM user with permissions to access S3 resources, 
e.g. to give the user read/write/delete access to the objects in an S3 bucket.

Suitable for CI/CD systems (_e.g._ TravisCI, CircleCI) or systems which are *external* to AWS 
that cannot leverage [AWS IAM Instance Profiles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html)
or [AWS OIDC](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html).

By default, IAM users, groups, and roles have no access to AWS resources. 
IAM policies are the means by which privileges are granted to users, groups, or roles. 
It is recommended that IAM policies be applied directly to groups and roles but not users.
**This module intentionally attaches an IAM policy directly to the user and does not use groups**

The IAM user name is constructed using [terraform-null-label](https://github.com/cloudposse/terraform-null-label)
and some input is required. The simplest input is `name`. By default the name will be converted to lower case
and all non-alphanumeric characters except for hyphen will be removed. See the documentation for `terraform-null-label`
to learn how to override these defaults if desired.

If an AWS Access Key is created, it is stored either in SSM Parameter Store or is provided as a module output,
but not both. Using SSM Parameter Store is recommended because module outputs are stored in plaintext in
the Terraform state file.






## Usage

This example will create an IAM user and allow read access to all objects in the S3 bucket `examplebucket`


```hcl
module "s3_user" {
  source = "cloudposse/iam-s3-user/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace    = "eg"
  stage        = "test"
  name         = "app"
  s3_actions   = ["s3:GetObject"]
  s3_resources = "arn:aws:s3:::examplebucket/*"
}
```






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
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_s3_user"></a> [s3\_user](#module\_s3\_user) | cloudposse/iam-system-user/aws | 1.0.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_user_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_policy) | resource |
| [aws_iam_policy_document.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_iam_access_key"></a> [create\_iam\_access\_key](#input\_create\_iam\_access\_key) | Set `true` to create an IAM Access Key for the user.<br/>To rotate the key, set `false` to delete it and then back to `true` to create a new key.<br/>Best practice is to never create a key and instead authenticate with OIDC or some other mechanism<br/>that does not require long-lived bearer tokens. | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_force_destroy"></a> [force\_destroy](#input\_force\_destroy) | Destroy even if it has non-Terraform-managed IAM access keys, login profiles or MFA devices | `bool` | `false` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_path"></a> [path](#input\_path) | Path in which to create the user | `string` | `"/"` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_s3_actions"></a> [s3\_actions](#input\_s3\_actions) | Actions to allow in the policy | `list(string)` | <pre>[<br/>  "s3:GetObject"<br/>]</pre> | no |
| <a name="input_s3_resources"></a> [s3\_resources](#input\_s3\_resources) | S3 resources to apply the actions specified in the policy | `list(string)` | n/a | yes |
| <a name="input_ssm_base_path"></a> [ssm\_base\_path](#input\_ssm\_base\_path) | The base path for SSM parameters where secrets are stored | `string` | `"/s3_user/"` | no |
| <a name="input_ssm_enabled"></a> [ssm\_enabled](#input\_ssm\_enabled) | Set `true` to store secrets in SSM Parameter Store,<br/>`false` to store secrets in Terraform state as outputs.<br/>Since Terraform state would contain the secrets in plaintext,<br/>use of SSM Parameter Store is recommended. | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_access_key_id"></a> [access\_key\_id](#output\_access\_key\_id) | Access Key ID |
| <a name="output_access_key_id_ssm_path"></a> [access\_key\_id\_ssm\_path](#output\_access\_key\_id\_ssm\_path) | The SSM Path under which the S3 User's access key ID is stored |
| <a name="output_secret_access_key"></a> [secret\_access\_key](#output\_secret\_access\_key) | Secret Access Key. This will be written to the state file in plain-text |
| <a name="output_secret_access_key_ssm_path"></a> [secret\_access\_key\_ssm\_path](#output\_secret\_access\_key\_ssm\_path) | The SSM Path under which the S3 User's secret access key is stored |
| <a name="output_user_arn"></a> [user\_arn](#output\_user\_arn) | The ARN assigned by AWS for the user |
| <a name="output_user_name"></a> [user\_name](#output\_user\_name) | Normalized IAM user name |
| <a name="output_user_unique_id"></a> [user\_unique\_id](#output\_user\_unique\_id) | The user unique ID assigned by AWS |
<!-- markdownlint-restore -->


