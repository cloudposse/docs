---
title: route53-resolver-dns-firewall
sidebar_label: route53-resolver-dns-firewall
sidebar_class_name: command
description: |-
  Terraform module to provision Route 53 Resolver DNS Firewall, domain lists, firewall rules, rule groups, and logging configurations.
tags:
  - aws
  - terraform
  - terraform-modules
  - networking
  - network
  - dns
  - firewall
  - dns-firewall
  - firewall-rules
  - vpc

custom_edit_url: https://github.com/cloudposse/terraform-aws-route53-resolver-dns-firewall/blob/main/README.yaml
---

# Module: `route53-resolver-dns-firewall`
Terraform module to provision Route 53 Resolver DNS Firewall, domain lists, firewall rules, rule groups, and logging configurations.






## Usage


For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-route53-resolver-dns-firewall/tree/main/examples/complete)

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-aws-route53-resolver-dns-firewall/tree/main/test).

```hcl
provider "aws" {
  region = var.region
}

module "vpc" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ipv4_primary_cidr_block                   = "172.19.0.0/16"
  dns_hostnames_enabled                     = true
  dns_support_enabled                       = true
  internet_gateway_enabled                  = false
  ipv6_egress_only_internet_gateway_enabled = false
  assign_generated_ipv6_cidr_block          = false

  context = module.this.context
}

module "s3_log_storage" {
  source  = "cloudposse/s3-log-storage/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  force_destroy = true
  attributes    = ["logs"]

  context = module.this.context
}

module "route53_resolver_firewall" {
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  vpc_id = module.vpc.vpc_id

  firewall_fail_open        = "ENABLED"
  query_log_enabled         = true
  query_log_destination_arn = module.s3_log_storage.bucket_arn

  domains_config = {
    "not-secure-domains" = {
      # The dot at the end of domain names is required by Route53 DNS Firewall
      # If not added, AWS adds it automatically and terraform shows permanent drift
      domains = [
        "not-secure-domain-1.com.",
        "not-secure-domain-2.com.",
        "not-secure-domain-3.com."
      ]
    },
    "alert-domains" = {
      domains = [
        "alert-domain-1.com.",
        "alert-domain-2.com.",
        "alert-domain-3.com."
      ]
    },
    "blacklisted-domains" = {
      # Concat the lists of domains passed in the `domains` field and loaded from the file `domains_file`
      domains = [
        "blacklisted-domain-1.com.",
        "blacklisted-domain-2.com.",
        "blacklisted-domain-3.com."
      ]
      domains_file = "config/blacklisted_domains.txt"
    }
  }

  rule_groups_config = {
    "not-secure-domains-rule-group" = {
      # 'priority' must be between 100 and 9900 exclusive
      priority = 101
      rules = {
        "block-not-secure-domains" = {
          # 'priority' must be between 100 and 9900 exclusive
          priority                  = 101
          firewall_domain_list_name = "not-secure-domains"
          action                    = "BLOCK"
          block_response            = "NXDOMAIN"
        }
      }
    },
    "alert-and-blacklisted-domains-rule-group" = {
      # 'priority' must be between 100 and 9900 exclusive
      priority = 200
      rules = {
        "alert-domains" = {
          # 'priority' must be between 100 and 9900 exclusive
          priority                  = 101
          firewall_domain_list_name = "alert-domains"
          action                    = "ALERT"
        },
        "block-and-override-blacklisted-domains" = {
          # 'priority' must be between 100 and 9900 exclusive
          priority                  = 200
          firewall_domain_list_name = "blacklisted-domains"
          action                    = "BLOCK"
          block_response            = "OVERRIDE"
          block_override_dns_type   = "CNAME"
          block_override_domain     = "go-here.com"
          block_override_ttl        = 1
        }
      }
    }
  }

  context = module.this.context
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
| [aws_route53_resolver_firewall_config.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_firewall_config) | resource |
| [aws_route53_resolver_firewall_domain_list.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_firewall_domain_list) | resource |
| [aws_route53_resolver_firewall_rule.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_firewall_rule) | resource |
| [aws_route53_resolver_firewall_rule_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_firewall_rule_group) | resource |
| [aws_route53_resolver_firewall_rule_group_association.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_firewall_rule_group_association) | resource |
| [aws_route53_resolver_query_log_config.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_query_log_config) | resource |
| [aws_route53_resolver_query_log_config_association.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_query_log_config_association) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_domains_config"></a> [domains\_config](#input\_domains\_config) | Map of Route 53 Resolver DNS Firewall domain configurations | <pre>map(object({<br/>    domains      = optional(list(string))<br/>    domains_file = optional(string)<br/>  }))</pre> | n/a | yes |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_firewall_fail_open"></a> [firewall\_fail\_open](#input\_firewall\_fail\_open) | Determines how Route 53 Resolver handles queries during failures, for example when all traffic that is sent to DNS Firewall fails to receive a reply.<br/>By default, fail open is disabled, which means the failure mode is closed.<br/>This approach favors security over availability. DNS Firewall blocks queries that it is unable to evaluate properly.<br/>If you enable this option, the failure mode is open. This approach favors availability over security.<br/>In this case, DNS Firewall allows queries to proceed if it is unable to properly evaluate them.<br/>Valid values: ENABLED, DISABLED. | `string` | `"ENABLED"` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_query_log_config_name"></a> [query\_log\_config\_name](#input\_query\_log\_config\_name) | Route 53 Resolver query log config name. If omitted, the name will be generated by concatenating the ID from the context with the VPC ID | `string` | `null` | no |
| <a name="input_query_log_destination_arn"></a> [query\_log\_destination\_arn](#input\_query\_log\_destination\_arn) | The ARN of the resource that you want Route 53 Resolver to send query logs.<br/>You can send query logs to an S3 bucket, a CloudWatch Logs log group, or a Kinesis Data Firehose delivery stream. | `string` | `null` | no |
| <a name="input_query_log_enabled"></a> [query\_log\_enabled](#input\_query\_log\_enabled) | Flag to enable/disable Route 53 Resolver query logging | `bool` | `false` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_rule_groups_config"></a> [rule\_groups\_config](#input\_rule\_groups\_config) | Rule groups and rules configuration | <pre>map(object({<br/>    priority            = number<br/>    mutation_protection = optional(string)<br/>    # https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_resolver_firewall_rule<br/>    rules = map(object({<br/>      action                    = string<br/>      priority                  = number<br/>      block_override_dns_type   = optional(string)<br/>      block_override_domain     = optional(string)<br/>      block_override_ttl        = optional(number)<br/>      block_response            = optional(string)<br/>      firewall_domain_list_name = string<br/>    }))<br/>  }))</pre> | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_domains"></a> [domains](#output\_domains) | Route 53 Resolver DNS Firewall domain configurations |
| <a name="output_query_log_config"></a> [query\_log\_config](#output\_query\_log\_config) | Route 53 Resolver query logging configuration |
| <a name="output_rule_group_associations"></a> [rule\_group\_associations](#output\_rule\_group\_associations) | Route 53 Resolver DNS Firewall rule group associations |
| <a name="output_rule_groups"></a> [rule\_groups](#output\_rule\_groups) | Route 53 Resolver DNS Firewall rule groups |
| <a name="output_rules"></a> [rules](#output\_rules) | Route 53 Resolver DNS Firewall rules |
<!-- markdownlint-restore -->

