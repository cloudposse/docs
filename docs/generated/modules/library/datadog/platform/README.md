---
title: platform
sidebar_label: platform
sidebar_class_name: command
description: |-
  Terraform module to provision Datadog resources.

  The module consists of the following submodules:

    - [monitors](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/monitors) - to provision Datadog [monitors](https://docs.datadoghq.com/api/v1/monitors/)
    - [synthetics](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/synthetics) - to provision Datadog [synthetics](https://docs.datadoghq.com/synthetics/)
    - [permissions](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/permissions) - to look up all available Datadog [permissions](https://docs.datadoghq.com/account_management/rbac/permissions/)
    - [roles](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/roles) - to provision Datadog [roles](https://docs.datadoghq.com/account_management/rbac)
    - [slo](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/slo) - to provision Datadog [Service Level Objectives](https://docs.datadoghq.com/monitors/service_level_objectives/)
    - [child_organization](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/child_organization) - to provision Datadog [child organizations](https://docs.datadoghq.com/account_management/multi_organization/)
    - [organization_settings](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/organization_settings) - to manage Datadog organization's settings

  __Notes on Datadog child organizations:__

  * Users can be added to the parent-organization and/or multiple child-organizations and switch between them from the user account settings menu
  * The parent-organization can view the usage of individual child-organizations, allowing them to track trends in usage
  * The Multi-organization account feature is not enabled by default. Contact Datadog support to have it enabled
  * Free and Trial organizations cannot enable SAML
  * We can only create Datadog child organizations with terraform, but cannot destroy them. When trying to destroy, the following error is thrown:
    ```
      Warning: Cannot delete organization.

      Remove organization by contacting support (https://docs.datadoghq.com/help).
    ```
tags:
  - terraform
  - terraform-modules
  - monitor
  - datadog
  - monitoring
  - synthetics
  - rbac
  - role
  - permission
  - slo
  - child-organization

custom_edit_url: https://github.com/cloudposse/terraform-datadog-platform/blob/main/README.yaml
---

# Module: `platform`
Terraform module to provision Datadog resources.

The module consists of the following submodules:

  - [monitors](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/monitors) - to provision Datadog [monitors](https://docs.datadoghq.com/api/v1/monitors/)
  - [synthetics](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/synthetics) - to provision Datadog [synthetics](https://docs.datadoghq.com/synthetics/)
  - [permissions](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/permissions) - to look up all available Datadog [permissions](https://docs.datadoghq.com/account_management/rbac/permissions/)
  - [roles](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/roles) - to provision Datadog [roles](https://docs.datadoghq.com/account_management/rbac)
  - [slo](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/slo) - to provision Datadog [Service Level Objectives](https://docs.datadoghq.com/monitors/service_level_objectives/)
  - [child_organization](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/child_organization) - to provision Datadog [child organizations](https://docs.datadoghq.com/account_management/multi_organization/)
  - [organization_settings](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/organization_settings) - to manage Datadog organization's settings

__Notes on Datadog child organizations:__

* Users can be added to the parent-organization and/or multiple child-organizations and switch between them from the user account settings menu
* The parent-organization can view the usage of individual child-organizations, allowing them to track trends in usage
* The Multi-organization account feature is not enabled by default. Contact Datadog support to have it enabled
* Free and Trial organizations cannot enable SAML
* We can only create Datadog child organizations with terraform, but cannot destroy them. When trying to destroy, the following error is thrown:
  ```
    Warning: Cannot delete organization.

    Remove organization by contacting support (https://docs.datadoghq.com/help).
  ```




## Introduction

Datadog resources (monitors, roles, etc.) are defined as [catalog](https://github.com/cloudposse/terraform-datadog-platform/tree/main/catalog) of YAML configuration files.

We maintain a comprehensive [catalog](https://github.com/cloudposse/terraform-datadog-platform/tree/main/catalog) of Datadog resources and welcome contributions via pull request!

The [examples/complete](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples/complete) in this module uses the catalog to provision the monitors on Datadog.

The [examples/synthetics](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples/synthetics) shows how to provision synthetic tests on Datadog for monitoring.
Consult the [synthetics README](https://github.com/cloudposse/terraform-datadog-platform/tree/main/modules/synthetics) module for more details.

The [examples/rbac](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples/rbac) shows how to use custom RBAC to provision Datadog roles with permissions and assign roles to monitors.

The [examples/slo](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples/slo) shows how to provision Service Level Objectives on Datadog for SLO monitoring.

The [examples/child_organization](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples/child_organization) shows how to provision Datadog child organizations.

The [examples/organization_settings](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples/organization_settings) shows how to provision Datadog organization settings.



## Usage


Provision Datadog monitors from the catalog of YAML definitions:

```hcl
module "monitor_configs" {
  source  = "cloudposse/config/yaml"
  version = "1.0.2"

  map_config_local_base_path = path.module
  map_config_paths           = var.monitor_paths

  context = module.this.context
}

module "datadog_monitors" {
  source = "cloudposse/platform/datadog//modules/monitors"
  # version = "x.x.x"

  datadog_monitors     = module.monitor_configs.map_configs
  alert_tags           = var.alert_tags
  alert_tags_separator = var.alert_tags_separator

  context = module.this.context
}
```

Provision Datadog synthetics:

```hcl
locals {
  synthetics_files = flatten([for p in var.synthetic_paths : fileset(path.module, p)])
  synthetics_list  = [for f in local.synthetics_files : yamldecode(file(f))]
  synthetics_map   = merge(local.synthetics_list...)
}

module "datadog_synthetics" {
  source = "cloudposse/platform/datadog//modules/synthetics"
  # version = "x.x.x"

  datadog_synthetics   = local.synthetics_map
  alert_tags           = var.alert_tags
  alert_tags_separator = var.alert_tags_separator

  context = module.this.context
}
```

Provision Datadog monitors, Datadog roles with defined permissions, and assign roles to monitors:

```hcl
module "monitor_configs" {
  source  = "cloudposse/config/yaml"
  version = "1.0.2"

  map_config_local_base_path = path.module
  map_config_paths           = var.monitor_paths

  context = module.this.context
}

module "role_configs" {
  source  = "cloudposse/config/yaml"
  version = "1.0.2"

  map_config_local_base_path = path.module
  map_config_paths           = var.role_paths

  context = module.this.context
}

locals {
  monitors_write_role_name    = module.datadog_roles.datadog_roles["monitors-write"].name
  monitors_downtime_role_name = module.datadog_roles.datadog_roles["monitors-downtime"].name

  monitors_roles_map = {
    aurora-replica-lag              = [local.monitors_write_role_name, local.monitors_downtime_role_name]
    ec2-failed-status-check         = [local.monitors_write_role_name, local.monitors_downtime_role_name]
    redshift-health-status          = [local.monitors_downtime_role_name]
    k8s-deployment-replica-pod-down = [local.monitors_write_role_name]
  }
}

module "datadog_roles" {
  source = "cloudposse/platform/datadog//modules/roles"
  # version = "x.x.x"

  datadog_roles = module.role_configs.map_configs

  context = module.this.context
}

module "datadog_monitors" {
  source = "cloudposse/platform/datadog//modules/monitors"
  # version = "x.x.x"

  datadog_monitors     = module.monitor_configs.map_configs
  alert_tags           = var.alert_tags
  alert_tags_separator = var.alert_tags_separator
  restricted_roles_map = local.monitors_roles_map

  context = module.this.context
}
```

Provision a Datadog child organization:

```hcl
module "datadog_child_organization" {
  source = "cloudposse/platform/datadog//modules/child_organization"
  # version = "x.x.x"

  organization_name                = "test"
  saml_enabled                     = false  # Note that Free and Trial organizations cannot enable SAML
  saml_autocreate_users_domains    = []
  saml_autocreate_users_enabled    = false
  saml_idp_initiated_login_enabled = true
  saml_strict_mode_enabled         = false
  private_widget_share             = false
  saml_autocreate_access_role      = "ro"

  context = module.this.context
}
```




## Examples

Review the [examples](https://github.com/cloudposse/terraform-datadog-platform/tree/main/examples) folder to see how to use the Datadog modules.

Also checkout our [terraform-aws-components](https://github.com/cloudposse/terraform-aws-components) repository for more examples of how to use a mixture of modules to enhance monitors, slos, and synthetics with inheritence and templating!



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0 |
| <a name="requirement_datadog"></a> [datadog](#requirement\_datadog) | >= 3.0.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_datadog"></a> [datadog](#provider\_datadog) | >= 3.0.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [datadog_monitor.default](https://registry.terraform.io/providers/datadog/datadog/latest/docs/resources/monitor) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_alert_tags"></a> [alert\_tags](#input\_alert\_tags) | List of alert tags to add to all alert messages, e.g. `["@opsgenie"]` or `["@devops", "@opsgenie"]` | `list(string)` | `null` | no |
| <a name="input_alert_tags_separator"></a> [alert\_tags\_separator](#input\_alert\_tags\_separator) | Separator for the alert tags. All strings from the `alert_tags` variable will be joined into one string using the separator and then added to the alert message | `string` | `"\n"` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_datadog_monitors"></a> [datadog\_monitors](#input\_datadog\_monitors) | Map of Datadog monitor configurations. See catalog for examples | <pre>map(object({<br/>    name                = string<br/>    type                = string<br/>    message             = string<br/>    escalation_message  = string<br/>    query               = string<br/>    tags                = list(string)<br/>    notify_no_data      = bool<br/>    new_host_delay      = number<br/>    evaluation_delay    = number<br/>    no_data_timeframe   = number<br/>    renotify_interval   = number<br/>    notify_audit        = bool<br/>    timeout_h           = number<br/>    enable_logs_sample  = bool<br/>    include_tags        = bool<br/>    require_full_window = bool<br/>    locked              = bool<br/>    force_delete        = bool<br/>    threshold_windows   = map(any)<br/>    thresholds          = map(any)<br/>  }))</pre> | n/a | yes |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
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
| <a name="input_restricted_roles_map"></a> [restricted\_roles\_map](#input\_restricted\_roles\_map) | Map of monitors names to sets of Datadog roles to restrict access to each monitor | `map(set(string))` | `{}` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_datadog_monitor_ids"></a> [datadog\_monitor\_ids](#output\_datadog\_monitor\_ids) | IDs of the created Datadog monitors |
| <a name="output_datadog_monitor_names"></a> [datadog\_monitor\_names](#output\_datadog\_monitor\_names) | Names of the created Datadog monitors |
| <a name="output_datadog_monitors"></a> [datadog\_monitors](#output\_datadog\_monitors) | Datadog monitor outputs |
<!-- markdownlint-restore -->
