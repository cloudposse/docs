---
title: incident-management
sidebar_label: incident-management
sidebar_class_name: command
description: |-
  Terraform module to provision Opsgenie resources using the Opsgenie provider. The provider needs to be configured with the proper credentials before it can be used.
  It consist of root module which is only here as an example but can be used as a combination of all submodules. Submodules can also be combined to abstract away complexity of setting up for example a team escalation.
custom_edit_url: https://github.com/cloudposse/terraform-opsgenie-incident-management/blob/main/README.yaml
---

# Module: `incident-management`
Terraform module to provision Opsgenie resources using the Opsgenie provider. The provider needs to be configured with the proper credentials before it can be used.
It consist of root module which is only here as an example but can be used as a combination of all submodules. Submodules can also be combined to abstract away complexity of setting up for example a team escalation.




## Introduction

Available modules:
- [Alert Policy](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/alert_policy)
- [API Integration](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/api_integration)
- [Config](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/config)
- [Escalation](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/escalation)
- [Integration Action](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/integration_action) (advanced feature — not available to all OpsGenie plans)
- [Notification Policy](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/notification_policy)
- [Team](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/team)
- [Team Routing Rule](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/team_routing_rule)
- [User](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/user)
- [Service](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/service)
- [Service Incident Rule](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/modules/service_incident_rule)

**Note:** Root module is just an example that uses all of submodules.

**Note:** See the [Advanced Features Example](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/advanced_features) for features only available to some OpsGenie plans.



## Usage

Here's how to invoke `team` module in your projects

```hcl
module "team-name" {
  source  = "cloudposse/incident-management/opsgenie//modules/team"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  team = {
    name        = "team-name"
    description = "team-description"
  }
}
```




## Examples

Here are examples of using the module:

- [`complete`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/complete) - complete example of using this module

Submodules examples:
- [`alert_policy`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/alert_policy)
- [`api_integration`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/api_integration)
- [`escalation`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/escalation)
- [`integration_action`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/integration_action) (advanced feature — not available to all OpsGenie plans)
- [`notification_policy`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/notification_policy)
- [`team`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/team)
- [`team_routing_rule`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/team_routing_rule)
- [`user`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/user)

Here is an example of using the `config` module, which incorporates all resource declarations into a single module:
- [`config`](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/examples/config)

Here are automated tests for the examples using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest) (which tests and provisions the examples):
 - [test](https://github.com/cloudposse/terraform-opsgenie-incident-management/tree/main/test)



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_opsgenie"></a> [opsgenie](#requirement\_opsgenie) | >= 0.4 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_alert_policy"></a> [alert\_policy](#module\_alert\_policy) | ./modules/alert_policy | n/a |
| <a name="module_api_integration"></a> [api\_integration](#module\_api\_integration) | ./modules/api_integration | n/a |
| <a name="module_escalation"></a> [escalation](#module\_escalation) | ./modules/escalation | n/a |
| <a name="module_integration_action"></a> [integration\_action](#module\_integration\_action) | ./modules/integration_action | n/a |
| <a name="module_notification_policy"></a> [notification\_policy](#module\_notification\_policy) | ./modules/notification_policy | n/a |
| <a name="module_service"></a> [service](#module\_service) | ./modules/service | n/a |
| <a name="module_service_incident_rule"></a> [service\_incident\_rule](#module\_service\_incident\_rule) | ./modules/service_incident_rule | n/a |
| <a name="module_team"></a> [team](#module\_team) | ./modules/team | n/a |
| <a name="module_team_routing_rule"></a> [team\_routing\_rule](#module\_team\_routing\_rule) | ./modules/team_routing_rule | n/a |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |
| <a name="module_user"></a> [user](#module\_user) | ./modules/user | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_alert_policy"></a> [alert\_policy](#input\_alert\_policy) | Opsgenie Alert Policy configuration | `map` | `{}` | no |
| <a name="input_api_integration"></a> [api\_integration](#input\_api\_integration) | Opsgenie API Integration configuration | `map(any)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_escalation"></a> [escalation](#input\_escalation) | Opsgenie Escalation configuration | `map` | `{}` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_integration_action"></a> [integration\_action](#input\_integration\_action) | Opsgenie Integration Action configuration | `map` | `{}` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_notification_policy"></a> [notification\_policy](#input\_notification\_policy) | Opsgenie Notification Policy configuration | `map` | `{}` | no |
| <a name="input_opsgenie_provider_api_key"></a> [opsgenie\_provider\_api\_key](#input\_opsgenie\_provider\_api\_key) | The API Key for the Opsgenie Integration. If omitted, the OPSGENIE\_API\_KEY environment variable is used | `string` | `""` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_service"></a> [service](#input\_service) | Opsgenie Service configuration | `map` | `{}` | no |
| <a name="input_service_incident_rule"></a> [service\_incident\_rule](#input\_service\_incident\_rule) | Opsgenie Service Incident Rule configuration | `map` | `{}` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_team"></a> [team](#input\_team) | Opsgenie Team configuration | `map` | `{}` | no |
| <a name="input_team_routing_rule"></a> [team\_routing\_rule](#input\_team\_routing\_rule) | Opsgenie Team Routing Rule configuration | `map` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_user"></a> [user](#input\_user) | Opsgenie User configuration | `map` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_alert_policy_filter"></a> [alert\_policy\_filter](#output\_alert\_policy\_filter) | Filters of the Opsgenie Alert Policy |
| <a name="output_alert_policy_id"></a> [alert\_policy\_id](#output\_alert\_policy\_id) | The ID of the Opsgenie Alert Policy |
| <a name="output_alert_policy_name"></a> [alert\_policy\_name](#output\_alert\_policy\_name) | Name of the Opsgenie Alert Policy |
| <a name="output_alert_policy_priority"></a> [alert\_policy\_priority](#output\_alert\_policy\_priority) | Priority of the Opsgenie Alert Policy |
| <a name="output_alert_policy_responders"></a> [alert\_policy\_responders](#output\_alert\_policy\_responders) | Responders of the Opsgenie Alert Policy. |
| <a name="output_alert_policy_tags"></a> [alert\_policy\_tags](#output\_alert\_policy\_tags) | Tags of the Opsgenie Alert Policy |
| <a name="output_api_integration_api_key"></a> [api\_integration\_api\_key](#output\_api\_integration\_api\_key) | API key of the created integration |
| <a name="output_api_integration_id"></a> [api\_integration\_id](#output\_api\_integration\_id) | The ID of the Opsgenie API Integration |
| <a name="output_api_integration_name"></a> [api\_integration\_name](#output\_api\_integration\_name) | The name of the Opsgenie API Integration |
| <a name="output_escalation_id"></a> [escalation\_id](#output\_escalation\_id) | The ID of the Opsgenie Escalation |
| <a name="output_escalation_name"></a> [escalation\_name](#output\_escalation\_name) | Name of the Opsgenie Escalation |
| <a name="output_integration_action_id"></a> [integration\_action\_id](#output\_integration\_action\_id) | The ID of the Opsgenie Integration Action |
| <a name="output_notification_policy_id"></a> [notification\_policy\_id](#output\_notification\_policy\_id) | The ID of the Opsgenie Notification Policy |
| <a name="output_notification_policy_name"></a> [notification\_policy\_name](#output\_notification\_policy\_name) | The name of the Opsgenie Notification Policy |
| <a name="output_service_id"></a> [service\_id](#output\_service\_id) | The ID of the Opsgenie Service |
| <a name="output_service_incident_rule_id"></a> [service\_incident\_rule\_id](#output\_service\_incident\_rule\_id) | The ID of the Opsgenie Service Incident Rule |
| <a name="output_service_name"></a> [service\_name](#output\_service\_name) | The name of the Opsgenie Service |
| <a name="output_team_id"></a> [team\_id](#output\_team\_id) | The ID of the Opsgenie Team |
| <a name="output_team_name"></a> [team\_name](#output\_team\_name) | The name of the Opsgenie Team |
| <a name="output_team_routing_rule_id"></a> [team\_routing\_rule\_id](#output\_team\_routing\_rule\_id) | The ID of the Opsgenie Team Routing Rule |
| <a name="output_team_routing_rule_name"></a> [team\_routing\_rule\_name](#output\_team\_routing\_rule\_name) | The name of the Opsgenie Team Routing Rule |
| <a name="output_user_id"></a> [user\_id](#output\_user\_id) | The ID of the Opsgenie User |
| <a name="output_user_name"></a> [user\_name](#output\_user\_name) | The name of the Opsgenie User |
<!-- markdownlint-restore -->

