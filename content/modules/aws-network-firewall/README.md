---
title: aws-network-firewall
sidebar_label: aws-network-firewall
sidebar_class_name: command
description: |-
  Terraform module to provision AWS Network Firewall resources.
tags:
  - aws
  - terraform
  - terraform-modules
  - networking
  - network
  - network-firewall
  - firewall
  - firewall-rules
  - vpc

custom_edit_url: https://github.com/cloudposse/terraform-aws-network-firewall/edit/main/README.md
---

# Component: `aws-network-firewall`
Terraform module to provision AWS Network Firewall resources.






## Usage


For a complete example, see [examples/complete](examples/complete)

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](test).

```hcl
provider "aws" {
  region = var.region
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ipv4_primary_cidr_block = "172.19.0.0/16"

  context = module.this.context
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  availability_zones   = var.availability_zones
  vpc_id               = module.vpc.vpc_id
  igw_id               = [module.vpc.igw_id]
  ipv4_cidr_block      = [module.vpc.vpc_cidr_block]
  nat_gateway_enabled  = false
  nat_instance_enabled = false

  context = module.this.context
}

module "s3_log_storage" {
  source  = "cloudposse/s3-log-storage/aws"
  version = "1.0.0"

  force_destroy = true
  attributes    = ["logs"]

  context = module.this.context
}

module "network_firewall" {
  source  = "cloudposse/network-firewall/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.subnets.private_subnet_ids

  network_firewall_name                     = var.network_firewall_name
  network_firewall_description              = var.network_firewall_description
  network_firewall_policy_name              = var.network_firewall_policy_name
  policy_stateful_engine_options_rule_order = var.policy_stateful_engine_options_rule_order
  stateful_default_actions                  = var.stateful_default_actions
  stateless_default_actions                 = var.stateless_default_actions
  stateless_fragment_default_actions        = var.stateless_fragment_default_actions
  stateless_custom_actions                  = var.stateless_custom_actions
  delete_protection                         = var.delete_protection
  firewall_policy_change_protection         = var.firewall_policy_change_protection
  subnet_change_protection                  = var.subnet_change_protection

  logging_config = {
    flow = {
      log_destination_type = "S3"
      log_type             = "FLOW"
      log_destination = {
        bucketName = module.s3_log_storage.bucket_id
        prefix     = "/flow"
      }
    },
    alert = {
      log_destination_type = "S3"
      log_type             = "ALERT"
      log_destination = {
        bucketName = module.s3_log_storage.bucket_id
        prefix     = "/alert"
      }
    }
  }

  rule_group_config = {
    stateful-inspection-for-blocking-packets-from-going-to-destination = {
      capacity    = 50
      name        = "block-packets-from-reaching-destination"
      description = "Stateful Inspection for blocking packets from going to an intended destination"
      type        = "STATEFUL"
      rule_group = {
        stateful_rule_options = {
          rule_order = "STRICT_ORDER"
        }
        rules_source = {
          stateful_rule = [
            {
              action = "DROP"
              header = {
                destination      = "124.1.1.24/32"
                destination_port = 53
                direction        = "ANY"
                protocol         = "TCP"
                source           = "1.2.3.4/32"
                source_port      = 53
              }
              rule_option = {
                keyword = "sid:1"
              }
            }
          ]
        }
      }
    }
  }

  context = module.this.context
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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 4.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_networkfirewall_firewall.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/networkfirewall_firewall) | resource |
| [aws_networkfirewall_firewall_policy.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/networkfirewall_firewall_policy) | resource |
| [aws_networkfirewall_logging_configuration.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/networkfirewall_logging_configuration) | resource |
| [aws_networkfirewall_rule_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/networkfirewall_rule_group) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delete_protection"></a> [delete\_protection](#input\_delete\_protection) | A boolean flag indicating whether it is possible to delete the firewall | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_firewall_policy_change_protection"></a> [firewall\_policy\_change\_protection](#input\_firewall\_policy\_change\_protection) | A boolean flag indicating whether it is possible to change the associated firewall policy | `bool` | `false` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_logging_config"></a> [logging\_config](#input\_logging\_config) | Logging configuration | `map(any)` | `{}` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_network_firewall_description"></a> [network\_firewall\_description](#input\_network\_firewall\_description) | AWS Network Firewall description. If not provided, the Network Firewall name will be used | `string` | `null` | no |
| <a name="input_network_firewall_name"></a> [network\_firewall\_name](#input\_network\_firewall\_name) | AWS Network Firewall name. If not provided, the name will be derived from the context | `string` | `null` | no |
| <a name="input_network_firewall_policy_name"></a> [network\_firewall\_policy\_name](#input\_network\_firewall\_policy\_name) | AWS Network Firewall policy name. If not provided, the name will be derived from the context | `string` | `null` | no |
| <a name="input_policy_stateful_engine_options_rule_order"></a> [policy\_stateful\_engine\_options\_rule\_order](#input\_policy\_stateful\_engine\_options\_rule\_order) | Indicates how to manage the order of stateful rule evaluation for the policy. Valid values: DEFAULT\_ACTION\_ORDER, STRICT\_ORDER | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_rule_group_config"></a> [rule\_group\_config](#input\_rule\_group\_config) | Rule group configuration. Refer to [networkfirewall\_rule\_group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/networkfirewall_rule_group) for configuration details | `any` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_stateful_default_actions"></a> [stateful\_default\_actions](#input\_stateful\_default\_actions) | Default stateful actions | `list(string)` | <pre>[<br/>  "aws:alert_strict"<br/>]</pre> | no |
| <a name="input_stateless_custom_actions"></a> [stateless\_custom\_actions](#input\_stateless\_custom\_actions) | Set of configuration blocks describing the custom action definitions that are available for use in the firewall policy's `stateless_default_actions` | <pre>list(object({<br/>    action_name = string<br/>    dimensions  = list(string)<br/>  }))</pre> | `[]` | no |
| <a name="input_stateless_default_actions"></a> [stateless\_default\_actions](#input\_stateless\_default\_actions) | Default stateless actions | `list(string)` | <pre>[<br/>  "aws:forward_to_sfe"<br/>]</pre> | no |
| <a name="input_stateless_fragment_default_actions"></a> [stateless\_fragment\_default\_actions](#input\_stateless\_fragment\_default\_actions) | Default stateless actions for fragmented packets | `list(string)` | <pre>[<br/>  "aws:forward_to_sfe"<br/>]</pre> | no |
| <a name="input_subnet_change_protection"></a> [subnet\_change\_protection](#input\_subnet\_change\_protection) | A boolean flag indicating whether it is possible to change the associated subnet(s) | `bool` | `false` | no |
| <a name="input_subnet_ids"></a> [subnet\_ids](#input\_subnet\_ids) | List of subnet IDs for firewall endpoints | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_az_subnet_endpoint_stats"></a> [az\_subnet\_endpoint\_stats](#output\_az\_subnet\_endpoint\_stats) | List of objects with each object having three items: AZ, subnet ID, firewall VPC endpoint ID |
| <a name="output_network_firewall_arn"></a> [network\_firewall\_arn](#output\_network\_firewall\_arn) | Network Firewall ARN |
| <a name="output_network_firewall_name"></a> [network\_firewall\_name](#output\_network\_firewall\_name) | Network Firewall ID |
| <a name="output_network_firewall_policy_arn"></a> [network\_firewall\_policy\_arn](#output\_network\_firewall\_policy\_arn) | Network Firewall policy ARN |
| <a name="output_network_firewall_policy_name"></a> [network\_firewall\_policy\_name](#output\_network\_firewall\_policy\_name) | Network Firewall policy ID |
| <a name="output_network_firewall_status"></a> [network\_firewall\_status](#output\_network\_firewall\_status) | Nested list of information about the current status of the Network Firewall |
| <a name="output_network_firewall_update_token"></a> [network\_firewall\_update\_token](#output\_network\_firewall\_update\_token) | A string token used when updating the Network Firewall |
<!-- markdownlint-restore -->


