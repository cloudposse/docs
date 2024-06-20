---
title: lakeformation
sidebar_label: lakeformation
sidebar_class_name: command
description: |-
  Terraform module to deploy an instance of [Amazon Lake Formation](https://aws.amazon.com/lake-formation/) on AWS.
custom_edit_url: https://github.com/cloudposse/terraform-aws-lakeformation/blob/main/README.yaml
---

# Module: `lakeformation`
Terraform module to deploy an instance of [Amazon Lake Formation](https://aws.amazon.com/lake-formation/) on AWS.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-lakeformation/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-lakeformation/tree/main/test).

```hcl
# So we can assign admin permissions to the current user
data "aws_caller_identity" "current" {}

# Use this if a service-linked role already exists, otherwise it must be created
data "aws_iam_role" "lakeformation" {
  name = "AWSServiceRoleForLakeFormationDataAccess"
}

# Create a bucket to store Lake Formation data
module "s3_bucket" {
  source  = "cloudposse/s3-bucket/aws"
  # Cloud Posse recommends pinning every module to a specific version, though usually you want to use the current one
  # version = "x.x.x"

  acl                = "private"
  versioning_enabled = false
  force_destroy      = true # Be careful with this!

  context = module.this.context
}

# Create an Athena database linked to an S3 bucket
resource "aws_athena_database" "default" {
  count = module.this.enabled ? 1 : 0

  name   = var.resources.database.name
  bucket = module.s3_bucket.bucket_id

  force_destroy = true
}

# Create a standard label resource. See [null-label](https://github.com/cloudposse/terraform-null-label/#terraform-null-label--)
module "label" {
  source  = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version, though usually you want to use the current one
  # version = "x.x.x"

  namespace = "eg"
  name      = "example"
}

module "lakeformation" {
  source  = "cloudposse/lakeformation/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  s3_bucket_arn = module.s3_bucket.bucket_arn

  lf_tags = {
    left = ["test1", "test2"]
    right = ["test3", "test4"]
  }

  resources = {
      database = {
          name = "example_db_1" # Athena database created above
          tags = {
            left = "test1"
          }
      }
  }

  context = module.label.this
}
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_lakeformation_data_lake_settings.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_data_lake_settings) | resource |
| [aws_lakeformation_lf_tag.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_lf_tag) | resource |
| [aws_lakeformation_resource.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_resource) | resource |
| [aws_lakeformation_resource_lf_tags.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_resource_lf_tags) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_admin_arn_list"></a> [admin\_arn\_list](#input\_admin\_arn\_list) | Set of ARNs of AWS Lake Formation principals (IAM users or roles). | `list(string)` | `[]` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_catalog_id"></a> [catalog\_id](#input\_catalog\_id) | Identifier for the Data Catalog. If not provided, the account ID will be used. | `string` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_database_default_permissions"></a> [database\_default\_permissions](#input\_database\_default\_permissions) | Up to three configuration blocks of principal permissions for default create database permissions. | `list(any)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_lf_tags"></a> [lf\_tags](#input\_lf\_tags) | A map of key-value pairs to be used as Lake Formation tags. | `map(list(string))` | `{}` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_resources"></a> [resources](#input\_resources) | A map of Lake Formation resources to create, with related attributes. | `map(any)` | `{}` | no |
| <a name="input_role_arn"></a> [role\_arn](#input\_role\_arn) | Role that has read/write access to the Lake Formation resource. If not provided, the Lake Formation service-linked role must exist and is used. | `string` | `null` | no |
| <a name="input_s3_bucket_arn"></a> [s3\_bucket\_arn](#input\_s3\_bucket\_arn) | Amazon Resource Name (ARN) of the Lake Formation resource, an S3 path. | `string` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_table_default_permissions"></a> [table\_default\_permissions](#input\_table\_default\_permissions) | Up to three configuration blocks of principal permissions for default create table permissions. | `list(map(any))` | `[]` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_trusted_resource_owners"></a> [trusted\_resource\_owners](#input\_trusted\_resource\_owners) | List of the resource-owning account IDs that the caller's account can use to share their user access details (user ARNs). | `list(string)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_lf_tags"></a> [lf\_tags](#output\_lf\_tags) | List of LF tags created. |
<!-- markdownlint-restore -->

