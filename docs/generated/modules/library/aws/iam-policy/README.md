---
title: iam-policy
sidebar_label: iam-policy
sidebar_class_name: command
description: |-
  This `terraform-aws-iam-policy` module is a wrapper around the Terraform [aws_iam_policy_document](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document)
  data source, enhancing it to provide multiple ways to create an AWS IAM Policy document (as a JSON string).
  It is primarily intended to simplify creating a policy in Terraform from external inputs. In particular,
  if you want to specify a policy in a `tfvars` file as a Terraform object, or in YAML as part of an
  [Atmos](https://atmos.tools/) stack (which is them turned into a Terraform object input), this module provides
  an object type declaration to use for the input and then it can make the translation to JSON for you.
  If you can supply the policy as JSON to begin with, or conveniently use the `aws_iam_policy_document`
  Terraform data source directly, then this module is not helpful in your case.

  > [!NOTE]
  > AWS's IAM policy document syntax allows for replacement of policy variables within a statement
  > using `${...}`-style notation, which conflicts with Terraform's interpolation syntax. In order to use AWS
  > policy variables with this module, use `&{...}` notation for interpolations that should be processed
  > by AWS rather than by Terraform. Nevertheless, any `${...}`-style notations that appear in strings passed into
  > this module (somehow escaping Terraform interpolation earlier) will be passed through to the policy document unchanged.
custom_edit_url: https://github.com/cloudposse/terraform-aws-iam-policy/blob/main/README.yaml
---

# Module: `iam-policy`
This `terraform-aws-iam-policy` module is a wrapper around the Terraform [aws_iam_policy_document](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document)
data source, enhancing it to provide multiple ways to create an AWS IAM Policy document (as a JSON string).
It is primarily intended to simplify creating a policy in Terraform from external inputs. In particular,
if you want to specify a policy in a `tfvars` file as a Terraform object, or in YAML as part of an
[Atmos](https://atmos.tools/) stack (which is them turned into a Terraform object input), this module provides
an object type declaration to use for the input and then it can make the translation to JSON for you.
If you can supply the policy as JSON to begin with, or conveniently use the `aws_iam_policy_document`
Terraform data source directly, then this module is not helpful in your case.

> [!NOTE]
> AWS's IAM policy document syntax allows for replacement of policy variables within a statement
> using `${...}`-style notation, which conflicts with Terraform's interpolation syntax. In order to use AWS
> policy variables with this module, use `&{...}` notation for interpolations that should be processed
> by AWS rather than by Terraform. Nevertheless, any `${...}`-style notations that appear in strings passed into
> this module (somehow escaping Terraform interpolation earlier) will be passed through to the policy document unchanged.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-iam-policy/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-iam-policy/tree/main/test).

```hcl
module "iam_policy" {
  source  = "cloudposse/iam-policy/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  iam_policy = [{
    version = "2012-10-17"
    policy_id = "example"
    statements = [
      {
        sid       = "ListMyBucket"
        effect    = "Allow"
        actions   = ["s3:ListBucket"]
        resources = ["arn:aws:s3:::test"]
        conditions = [
          {
            test     = "StringLike"
            variable = "cloudwatch:namespace"
            values   = ["x-*"]
          },
        ]
      },
      {
        sid       = "WriteMyBucket"
        effect    = "Allow"
        actions   = ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"]
        resources = ["arn:aws:s3:::test/*"]
        conditions = [
          {
            test     = "StringLike"
            variable = "cloudwatch:namespace"
            values   = ["x-*"]
          },
        ]
      }
    ]
  }]

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "example" {
  name               = "hello_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  inline_policy {
    name = "test_policy"

    policy = module.iam_policy.json
  }
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-iam-policy/) - overly basic example of using this module
- [terraform-aws-helm-release](https://github.com/cloudposse/terraform-aws-helm-release) - realistic use of this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.0 |
| <a name="requirement_http"></a> [http](#requirement\_http) | >= 3.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.0 |
| <a name="provider_http"></a> [http](#provider\_http) | >= 3.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_policy_document.policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.this](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [http_http.iam_source_json_url](https://registry.terraform.io/providers/hashicorp/http/latest/docs/data-sources/http) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_description"></a> [description](#input\_description) | Description of created IAM policy | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_iam_override_policy_documents"></a> [iam\_override\_policy\_documents](#input\_iam\_override\_policy\_documents) | List of IAM policy documents (as JSON strings) that are merged together into the exported document with higher precedence.<br/>In merging, statements with non-blank SIDs will override statements with the same SID<br/>from earlier documents in the list and from other "source" documents. | `list(string)` | `null` | no |
| <a name="input_iam_policy"></a> [iam\_policy](#input\_iam\_policy) | IAM policy as list of Terraform objects, compatible with Terraform `aws_iam_policy_document` data source<br/>except that `source_policy_documents` and `override_policy_documents` are not included.<br/>Use inputs `iam_source_policy_documents` and `iam_override_policy_documents` for that. | <pre>list(object({<br/>    policy_id = optional(string, null)<br/>    version   = optional(string, null)<br/>    statements = list(object({<br/>      sid           = optional(string, null)<br/>      effect        = optional(string, null)<br/>      actions       = optional(list(string), null)<br/>      not_actions   = optional(list(string), null)<br/>      resources     = optional(list(string), null)<br/>      not_resources = optional(list(string), null)<br/>      conditions = optional(list(object({<br/>        test     = string<br/>        variable = string<br/>        values   = list(string)<br/>      })), [])<br/>      principals = optional(list(object({<br/>        type        = string<br/>        identifiers = list(string)<br/>      })), [])<br/>      not_principals = optional(list(object({<br/>        type        = string<br/>        identifiers = list(string)<br/>      })), [])<br/>    }))<br/>  }))</pre> | `[]` | no |
| <a name="input_iam_policy_enabled"></a> [iam\_policy\_enabled](#input\_iam\_policy\_enabled) | If set to `true` will create the IAM policy in AWS, otherwise will only output policy as JSON. | `bool` | `false` | no |
| <a name="input_iam_policy_id"></a> [iam\_policy\_id](#input\_iam\_policy\_id) | Deprecated: Use `iam_policy` instead: ID for the policy document when using `iam_policy_statements`. | `string` | `null` | no |
| <a name="input_iam_policy_statements"></a> [iam\_policy\_statements](#input\_iam\_policy\_statements) | Deprecated: Use `iam_policy` instead.<br/>List or Map of IAM policy statements to use in the policy.<br/>This can be used with `iam_source_policy_documents` and `iam_override_policy_documents`<br/>and with or instead of `iam_source_json_url`. | `any` | `[]` | no |
| <a name="input_iam_source_json_url"></a> [iam\_source\_json\_url](#input\_iam\_source\_json\_url) | URL of the IAM policy (in JSON format) to download and use as `source_json` argument.<br/>This is useful when using a 3rd party service that provides their own policy.<br/>Statements in this policy will be overridden by statements with the same SID in `iam_override_policy_documents`. | `string` | `null` | no |
| <a name="input_iam_source_policy_documents"></a> [iam\_source\_policy\_documents](#input\_iam\_source\_policy\_documents) | List of IAM policy documents (as JSON strings) that are merged together into the exported document.<br/>Statements defined in `iam_source_policy_documents` must have unique SIDs and be distinct from SIDs<br/>in `iam_policy` and deprecated `iam_policy_statements`.<br/>Statements in these documents will be overridden by statements with the same SID in `iam_override_policy_documents`. | `list(string)` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_json"></a> [json](#output\_json) | JSON body of the IAM policy document |
| <a name="output_policy_arn"></a> [policy\_arn](#output\_policy\_arn) | ARN of created IAM policy |
<!-- markdownlint-restore -->

