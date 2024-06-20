---
title: utils
sidebar_label: utils
sidebar_class_name: command
description: |-
  This `terraform-aws-utils` module provides some simple utilities to use when working in AWS.
custom_edit_url: https://github.com/cloudposse/terraform-aws-utils/blob/main/README.yaml
---

# Module: `utils`
This `terraform-aws-utils` module provides some simple utilities to use when working in AWS.




## Introduction

This `terraform-aws-utils` module provides some simple utilities to use when working in AWS.
More complex utilities are available through Cloud Posse's `utils` Terraform provider
[terraform-provider-utils](https://github.com/cloudposse/terraform-provider-utils).

### Compact Alternative Codes (Abbreviations)
This module's primary function is to provide compact alternative codes for Regions, Availability Zones,
and Local Zones, codes which are guaranteed to use only digits and lower case letters: no hyphens.
Conversions to and from official codes and alternative codes are handled via lookup maps.

- The `short` abbreviations for regions are variable length (generally 4-6 characters, but length limits not guaranteed)
and strictly algorithmically derived so that people can more easily interpret them. The `short` region
code abbreviations typically match the prefix of the Availability Zone IDs in that region, but this is
not guaranteed. The `short` abbreviations for local regions are generally of the form AWS uses, with
the region prefix and dashes removed.
- The `fixed` abbreviations are always exactly 3 characters for regions and 4 characters
for availability zones and local zones, but have some exceptional cases (China, Africa, Asia-Pacific South, US GovCloud)
that have non-obvious abbreviations. If a future new region causes a conflict with an established local zone
abbreviation, we may change the local zone abbreviation to keep the region mappings consistent. For example,
the local zone `us-east-1-mci-1a` would have been abbreviated `mc1a` had we released it earlier, and that would have
conflicted with the new (in 2022) `me-central-1a` which would also be abbreviated `mc1a` in keeping with the general
pattern of using the first letter of each of the first 2 parts. We might have chosen to change the abbreviation
for `us-east-1-mci-1` so we could use `mc1a` for `me-central-1a`. (As it happens, we added them both at the same
time and avoided this collision.) If we were to make such a change, this
would be a breaking change for people using the affected local zone, so we recommend using the `short`
abbreviations if you are using local zones, which are far less likely to have conflicts in the future.
- The `identity` "abbreviations" are not abbreviations but are instead the official codes (output equals input,
which is why it is called "identity"). This map is provided to simplify algorithmic choice of region code
abbreviation when you want to include a "no abbreviation" option.

We currently support Local Zones but not Wavelength Zones. If we support Wavelength Zones in the future,
it is likely that the fixed-length abbreviations for them will be non-intuitive, or we may only provide
`short` and not `fixed` abbreviations for them.

The intention is that existing region mappings will never change, and if new regions or zones are created that
conflict with existing ones, they will be given non-standard mappings so as not to conflict. However, as
stated above, we may choose to change a local region abbreviation if it conflicts with the obvious abbreviation
for a newly created region. We have picked abbreviations for local zones with avoiding such future
collisions in mind, but we cannot predict the future. (Both `bos` and `den` fit the pattern for region abbreviations,
but we do not envision a future `bo-south-1` or `de-north-1` region.)

### ELB Logging

This module provides Elastic Load Balancing Account IDs per region to be used in
configuring [S3 Bucket Permissions](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions)
to allow access logs to be stored in S3.

However, the account IDs have no other purpose, and as AWS expands, it has become more complicated to create
the correct bucket policy. The policy for region `me-central-1` is different than the policy for `us-east-1`.
So now this module has a new feature: you provide the full AWS region code for the region where logging
is to take place (`elb_logging_region`), and the S3 bucket ARN for where logs are to be stored (`elb_logging_bucket_resource_arn`),
and this module will output the appropriate S3 bucket policy (in JSON) to attach to your S3 bucket.

NOTE: The region must be known at Terraform "plan" time. Use a configuration input, such as what you used
to configure the Terraform AWS Provider, not an output from some resource or module.

### Region Display Names

There is no AWS API that reliably returns the human-friendly display name (e.g. "Europe (Stockholm)") given
the API-friendly region name. So this module provides `region_display_name_map` to implement this functionality.

### Enabled and Disabled Regions

For convenience, this module provides lists of enabled and disabled regions in the current account. Note that
since these lists are dynamic, they cannot be used in Terraform `count` or `for_each` resource expressions.



## Usage

Here's how to invoke this example module in your projects

```hcl
locals {
  shorten_regions   = true
  naming_convention = local.shorten_regions ? "to_short" : "identity"
  az_map            = module.example.region_az_alt_code_maps[local.naming_convention]
}

module "utils_example_complete" {
  source  = "cloudposse/utils/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
}

module "label" {
  source = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  attributes = [local.az_map["us-east-2"]]

  context = module.this.context
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-utils/tree/main/examples/complete) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy_document.by_account](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.by_region](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_regions.complete](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/regions) | data source |
| [aws_regions.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/regions) | data source |
| [aws_regions.not_opted_in](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/regions) | data source |
| [aws_regions.opted_in](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/regions) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_elb_logging_bucket_resource_arn"></a> [elb\_logging\_bucket\_resource\_arn](#input\_elb\_logging\_bucket\_resource\_arn) | The AWS Resource ARN to use in the policy granting access to Load Balancer Logging.<br/>Typically of the form `arn:aws:s3:::_bucket-name_/_prefix_/AWSLogs/_your-aws-account-id_/*`.<br/>Required to generate `elb_logging_s3_bucket_policy_json`.<br/>See [AWS Documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html#attach-bucket-policy). | `string` | `""` | no |
| <a name="input_elb_logging_region"></a> [elb\_logging\_region](#input\_elb\_logging\_region) | Full region (e.g. `us-east-1`) where ELB logging is taking place. Required to generate `elb_s3_bucket_policy_json`.<br/>Must be known at "plan" time. | `string` | `""` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
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
| <a name="output_all_regions"></a> [all\_regions](#output\_all\_regions) | A list of all regions regardless of availability to the account |
| <a name="output_disabled_regions"></a> [disabled\_regions](#output\_disabled\_regions) | A list of regions that are disabled in the account |
| <a name="output_elb_logging_account"></a> [elb\_logging\_account](#output\_elb\_logging\_account) | Map of full region to ELB logging account |
| <a name="output_elb_logging_s3_bucket_policy_json"></a> [elb\_logging\_s3\_bucket\_policy\_json](#output\_elb\_logging\_s3\_bucket\_policy\_json) | The S3 bucket policy (in JSON) to attach to the S3 bucket to allow Load Balancer logs to be added.<br/>Requires `elb_logging_bucket_resource_arn` and `elb_logging_region` inputs. |
| <a name="output_enabled_regions"></a> [enabled\_regions](#output\_enabled\_regions) | A list of regions that are enabled in the account |
| <a name="output_region_az_alt_code_maps"></a> [region\_az\_alt\_code\_maps](#output\_region\_az\_alt\_code\_maps) | Collection of maps converting between official AWS Region, Availability Zone, and Local Zone codes and shorter unofficial codes using only lower case letters and digits. Inspired for use in naming and tagging so that region or AZ code will be 1 semantic unit.<br/><br/>- `to_fixed` = Map of regions to 3-character codes and Availability Zones to 4-character codes<br/>- `to_short` = Map of regions and Availability Zones to compact (usually 4-6 characters) codes<br/>- `from_fixed` = Map of `fixed` codes back to full region or Availability Zone codes<br/>- `from_short` = Map of `short` codes back to full region or Availability Zone codes<br/>- `identity` = Identity map of full region and Availability Zone codes back to themselves |
| <a name="output_region_display_name_map"></a> [region\_display\_name\_map](#output\_region\_display\_name\_map) | Map of full region names to user-friendly display names (e.g. "eu-west-3" = "Europe (Paris)"). |
<!-- markdownlint-restore -->

