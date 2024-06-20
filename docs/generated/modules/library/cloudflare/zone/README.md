---
title: zone
sidebar_label: zone
sidebar_class_name: command
description: |-
  Terraform module to provision a CloudFlare zone with: DNS records, Argo, Firewall filters and rules.
custom_edit_url: https://github.com/cloudposse/terraform-cloudflare-zone/blob/main/README.yaml
---

# Module: `zone`
Terraform module to provision a CloudFlare zone with: DNS records, Argo, Firewall filters and rules.






## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-cloudflare-zone/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-cloudflare-zone/tree/main/test).

```hcl
module "label" {
  source = "cloudposse/label/null"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  namespace  = "eg"
  stage      = "prod"
  name       = "cf"
  delimiter  = "-"
}

module "zone" {
  source = "cloudposse/zone/cloudflare"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  account_id = "example-account-id"
  zone       = "cloudposse.co"
  records    = [
    {
      name  = "bastion"
      value = "192.168.1.11"
      type  = "A"
      ttl   = 3600
    },
    {
      name  = "api"
      value = "192.168.2.22"
      type  = "A"
      ttl   = 3600
    }
  ]

  context = module.label.context
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-cloudflare-zone/tree/main/examples/complete) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0 |
| <a name="requirement_cloudflare"></a> [cloudflare](#requirement\_cloudflare) | >= 3.23 |
| <a name="requirement_time"></a> [time](#requirement\_time) | >= 0.8 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_cloudflare"></a> [cloudflare](#provider\_cloudflare) | >= 3.23 |
| <a name="provider_time"></a> [time](#provider\_time) | >= 0.8 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [cloudflare_argo.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/argo) | resource |
| [cloudflare_filter.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/filter) | resource |
| [cloudflare_firewall_rule.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/firewall_rule) | resource |
| [cloudflare_healthcheck.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/healthcheck) | resource |
| [cloudflare_page_rule.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/page_rule) | resource |
| [cloudflare_record.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/record) | resource |
| [cloudflare_zone.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/zone) | resource |
| [time_sleep.wait_for_records_creation](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/sleep) | resource |
| [cloudflare_zones.default](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/data-sources/zones) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_account_id"></a> [account\_id](#input\_account\_id) | Cloudflare account ID to manage the zone resource in | `string` | n/a | yes |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_argo_enabled"></a> [argo\_enabled](#input\_argo\_enabled) | Whether to enable Cloudflare Argo for DNS zone | `bool` | `false` | no |
| <a name="input_argo_smart_routing_enabled"></a> [argo\_smart\_routing\_enabled](#input\_argo\_smart\_routing\_enabled) | Whether smart routing is enabled. | `bool` | `true` | no |
| <a name="input_argo_tiered_caching_enabled"></a> [argo\_tiered\_caching\_enabled](#input\_argo\_tiered\_caching\_enabled) | Whether tiered caching is enabled. | `bool` | `true` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_firewall_rules"></a> [firewall\_rules](#input\_firewall\_rules) | paused:<br/>  Whether this filter is currently paused.<br/>expression:<br/>  The filter expression to be used.<br/>description:<br/>  A note that you can use to describe the purpose of the filter and rule.<br/>ref:<br/>  Short reference tag to quickly select related rules.<br/>action:<br/>  The action to apply to a matched request.<br/>  Possible values: `block`, `challenge`, `allow`, `js_challenge`, `bypass`.<br/>priority:<br/>  The priority of the rule to allow control of processing order.<br/>  A lower number indicates high priority.<br/>  If not provided, any rules with a priority will be sequenced before those without.<br/>products:<br/>  List of products to bypass for a request when the bypass action is used.<br/>  Possible values: `zoneLockdown`, `uaBlock`, `bic`, `hot`, `securityLevel`, `rateLimit`, `waf`. | `list(any)` | `null` | no |
| <a name="input_healthchecks"></a> [healthchecks](#input\_healthchecks) | A list of maps of Health Checks rules.<br/>The values of map is fully compliant with `cloudflare_healthcheck` resource.<br/>To get more info see https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/healthcheck | `list(any)` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_jump_start"></a> [jump\_start](#input\_jump\_start) | Whether to scan for DNS records on creation. | `bool` | `false` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_page_rules"></a> [page\_rules](#input\_page\_rules) | A list of maps of Page Rules.<br/>The values of map is fully compliant with `cloudflare_page_rule` resource.<br/>To get more info see https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/cloudflare_page_rule | `list(any)` | `null` | no |
| <a name="input_paused"></a> [paused](#input\_paused) | Whether this zone is paused (traffic bypasses Cloudflare) | `bool` | `false` | no |
| <a name="input_plan"></a> [plan](#input\_plan) | The name of the commercial plan to apply to the zone. Possible values: `free`, `pro`, `business`, `enterprise` | `string` | `"free"` | no |
| <a name="input_records"></a> [records](#input\_records) | name:<br/>  The name of the record.<br/>type:<br/>  The type of the record.<br/>value:<br/>  The value of the record.<br/>ttl:<br/>  The TTL of the record.<br/>  Default value: 1.<br/>priority:<br/>  The priority of the record.<br/>proxied:<br/>  Whether the record gets Cloudflare's origin protection.<br/>  Default value: false. | `list(any)` | `[]` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_type"></a> [type](#input\_type) | A full zone implies that DNS is hosted with Cloudflare. A `partial` zone is typically a partner-hosted zone or a CNAME setup. Possible values: `full`, `partial`. | `string` | `"full"` | no |
| <a name="input_zone"></a> [zone](#input\_zone) | The DNS zone name which will be added. | `string` | n/a | yes |
| <a name="input_zone_enabled"></a> [zone\_enabled](#input\_zone\_enabled) | Whether to create DNS zone otherwise use existing. | `bool` | `true` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_filter_ids"></a> [filter\_ids](#output\_filter\_ids) | A list of filter IDs. |
| <a name="output_firewall_rule_ids"></a> [firewall\_rule\_ids](#output\_firewall\_rule\_ids) | A list of firewall rule IDs. |
| <a name="output_id"></a> [id](#output\_id) | The zone ID. |
| <a name="output_meta_phishing_detected"></a> [meta\_phishing\_detected](#output\_meta\_phishing\_detected) | Indicates if URLs on the zone have been identified as hosting phishing content. |
| <a name="output_meta_wildcard_proxiable"></a> [meta\_wildcard\_proxiable](#output\_meta\_wildcard\_proxiable) | Indicates whether wildcard DNS records can receive Cloudflare security and performance features. |
| <a name="output_name_servers"></a> [name\_servers](#output\_name\_servers) | A list of Cloudflare-assigned name servers. This is only populated for zones that use Cloudflare DNS. |
| <a name="output_page_rule_targets_to_ids"></a> [page\_rule\_targets\_to\_ids](#output\_page\_rule\_targets\_to\_ids) | A map of the page rule targets to IDs. |
| <a name="output_plan"></a> [plan](#output\_plan) | The name of the commercial plan to apply to the zone. |
| <a name="output_record_hostnames_to_ids"></a> [record\_hostnames\_to\_ids](#output\_record\_hostnames\_to\_ids) | A map of the zone record hostnames to IDs. |
| <a name="output_status"></a> [status](#output\_status) | Status of the zone. |
| <a name="output_vanity_name_servers"></a> [vanity\_name\_servers](#output\_vanity\_name\_servers) | A list of Vanity Nameservers. |
| <a name="output_verification_key"></a> [verification\_key](#output\_verification\_key) | Contains the TXT record value to validate domain ownership. This is only populated for zones of type `partial`. |
<!-- markdownlint-restore -->

