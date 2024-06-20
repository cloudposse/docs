---
title: iam-user
sidebar_label: iam-user
sidebar_class_name: command
description: |-
  Terraform Module to provision a basic IAM user suitable for humans. It will establish a login profile and associate the user with IAM groups. 

  We do not recommend creating IAM users for any other purpose. For external systems (e.g. CI/CD) check out our [`terraform-aws-iam-system-user`](https://github.com/cloudposse/terraform-aws-iam-system-user) module.
custom_edit_url: https://github.com/cloudposse/terraform-aws-iam-user/blob/main/README.yaml
---

# Module: `iam-user`
Terraform Module to provision a basic IAM user suitable for humans. It will establish a login profile and associate the user with IAM groups. 

We do not recommend creating IAM users for any other purpose. For external systems (e.g. CI/CD) check out our [`terraform-aws-iam-system-user`](https://github.com/cloudposse/terraform-aws-iam-system-user) module.






## Usage


First, make sure all users register with [keybase.io](https://keybase.io) to faciliate public key encryption (PKE). 
Then use their keybase username to automatically encrypt their AWS secret. It's that easy!


```hcl
module "jack" {
  source = "cloudposse/iam-user/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  name       = "jack"
  user_name  = "jack@companyname.com"
  pgp_key    = "keybase:jack"
  groups     = ["admins"]
}
```
__NOTE:__ We recommend using email addresses for IAM user accounts.




## Examples

```hcl
module "jill" {
  source = "cloudposse/iam-user/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  name      = "jill"
  user_name  = "jill@companyname.com"
  pgp_key    = "keybase:jill"
  groups    = ["engineering"]
}
```



<!-- markdownlint-disable -->
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
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_user.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user) | resource |
| [aws_iam_user_group_membership.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_group_membership) | resource |
| [aws_iam_user_login_profile.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_login_profile) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_force_destroy"></a> [force\_destroy](#input\_force\_destroy) | When destroying this user, destroy even if it has non-Terraform-managed IAM access keys, login profile or MFA devices. Without force\_destroy a user with non-Terraform-managed access keys and login profile will fail to be destroyed. | `bool` | `false` | no |
| <a name="input_groups"></a> [groups](#input\_groups) | List of IAM user groups this user should belong to in the account | `list(string)` | `[]` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_login_profile_enabled"></a> [login\_profile\_enabled](#input\_login\_profile\_enabled) | Whether to create IAM user login profile | `bool` | `true` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_password_length"></a> [password\_length](#input\_password\_length) | The length of the generated password | `number` | `24` | no |
| <a name="input_password_reset_required"></a> [password\_reset\_required](#input\_password\_reset\_required) | Whether the user should be forced to reset the generated password on first login. | `bool` | `true` | no |
| <a name="input_path"></a> [path](#input\_path) | Desired path for the IAM user | `string` | `"/"` | no |
| <a name="input_permissions_boundary"></a> [permissions\_boundary](#input\_permissions\_boundary) | The ARN of the policy that is used to set the permissions boundary for the user | `string` | `""` | no |
| <a name="input_pgp_key"></a> [pgp\_key](#input\_pgp\_key) | Provide a base-64 encoded PGP public key, or a keybase username in the form `keybase:username`. Required to encrypt password. | `string` | n/a | yes |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_user_name"></a> [user\_name](#input\_user\_name) | Desired name for the IAM user. We recommend using email addresses. | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_keybase_password_decrypt_command"></a> [keybase\_password\_decrypt\_command](#output\_keybase\_password\_decrypt\_command) | Command to decrypt the Keybase encrypted password. Returns empty string if pgp\_key is not from keybase |
| <a name="output_keybase_password_pgp_message"></a> [keybase\_password\_pgp\_message](#output\_keybase\_password\_pgp\_message) | PGP encrypted message (e.g. suitable for email exchanges). Returns empty string if pgp\_key is not from keybase |
| <a name="output_pgp_key"></a> [pgp\_key](#output\_pgp\_key) | PGP key used to encrypt sensitive data for this user |
| <a name="output_user_arn"></a> [user\_arn](#output\_user\_arn) | The ARN assigned by AWS for this user |
| <a name="output_user_login_profile_encrypted_password"></a> [user\_login\_profile\_encrypted\_password](#output\_user\_login\_profile\_encrypted\_password) | The encrypted password, base64 encoded |
| <a name="output_user_login_profile_key_fingerprint"></a> [user\_login\_profile\_key\_fingerprint](#output\_user\_login\_profile\_key\_fingerprint) | The fingerprint of the PGP key used to encrypt the password |
| <a name="output_user_name"></a> [user\_name](#output\_user\_name) | IAM user name |
| <a name="output_user_unique_id"></a> [user\_unique\_id](#output\_user\_unique\_id) | The unique ID assigned by AWS |
<!-- markdownlint-restore -->

