---
title: config
sidebar_label: config
sidebar_class_name: command
description: |-
  Terraform module to convert local and remote YAML configuration templates into Terraform lists and maps.
custom_edit_url: https://github.com/cloudposse/terraform-yaml-config/blob/main/README.yaml
---

# Module: `config`
Terraform module to convert local and remote YAML configuration templates into Terraform lists and maps.




## Introduction

The module accepts paths to local and remote YAML configuration template files
and converts the templates into Terraform lists and maps for consumption in other Terraform modules.

The module can accept a map of parameters for interpolation within the YAML config templates.

The module also supports a top-level `import` attribute in map configuration templates, which will include the file and perform a deep merge.
Up to 10 levels of imports hierarchy are supported, and all imported maps are deep merged into a final configuration map.

For example, if you have a config file like this (e.g. `myconfig.yaml`):

  ```yaml
    import:
      - file1
      - file2
  ```

Then, this module will deep merge `file1.yaml` and `file2.yaml` into `myconfig.yaml`.

__Note:__ Do not include the extensions (e.g. `.yaml`) in the imports.

### Attributions

Big thanks to [Imperative Systems Inc.](https://github.com/Imperative-Systems-Inc)
for the excellent [deepmerge](https://github.com/Imperative-Systems-Inc/terraform-modules/tree/master/deepmerge) Terraform module
to perform a deep map merge of standard Terraform maps and objects.



## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-yaml-config/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on Datadog), see [test](https://github.com/cloudposse/terraform-yaml-config/tree/main/test).

For an example of using local config maps with `import` and deep merging into a final configuration map, see [examples/imports-local](https://github.com/cloudposse/terraform-yaml-config/tree/main/examples/imports-local).

For an example of using remote config maps with `import` and deep merging into a final configuration map, see [examples/imports-remote](https://github.com/cloudposse/terraform-yaml-config/tree/main/examples/imports-remote).




## Examples


### Example of local and remote maps and lists configurations with interpolation parameters

```hcl
module "yaml_config" {
  source = "cloudposse/config/yaml"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  map_config_local_base_path = "./config"

  map_config_paths = [
    "map-configs/*.yaml",
    "https://raw.githubusercontent.com/cloudposse/terraform-opsgenie-incident-management/master/examples/config/resources/services.yaml",
    "https://raw.githubusercontent.com/cloudposse/terraform-opsgenie-incident-management/master/examples/config/resources/team_routing_rules.yaml"
  ]

  list_config_local_base_path = "./config"

  list_config_paths = [
    "list-configs/*.yaml",
    "https://raw.githubusercontent.com/cloudposse/terraform-aws-service-control-policies/master/examples/complete/policies/organization-policies.yaml"
  ]

  parameters = {
    param1 = "1"
    param2 = "2"
  }

  context = module.this.context
}
```

### Example of local maps configurations with `import` and deep merging

In the example, we use two levels of imports,
and the module deep merges the local config files `imports-level-3.yaml`, `imports-level-2.yaml`, and `imports-level-1.yaml`
into a final config map.

See [examples/imports-local](https://github.com/cloudposse/terraform-yaml-config/tree/main/examples/imports-local) for more details.

```hcl
module "yaml_config" {
  source = "cloudposse/config/yaml"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  map_config_local_base_path = "./config"

  map_config_paths = [
    "imports-level-1.yaml"
  ]

  context = module.this.context
}
```

### Example of remote maps configurations with with `import` and deep merging

In the example, we use two levels of imports,
and the module deep merges the remote config files `globals.yaml`, `ue2-globals.yaml`, and `ue2-prod.yaml`
into a final config map.

See [examples/imports-remote](https://github.com/cloudposse/terraform-yaml-config/tree/main/examples/imports-remote) for more details.

```hcl
module "yaml_config" {
  source = "cloudposse/config/yaml"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  map_config_remote_base_path = "https://raw.githubusercontent.com/cloudposse/atmos/master/example/stacks"

  map_config_paths = [
    "https://raw.githubusercontent.com/cloudposse/atmos/master/example/stacks/ue2-prod.yaml"
  ]

  context = module.this.context
}
```



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_http"></a> [http](#requirement\_http) | >= 2.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.3 |
| <a name="requirement_template"></a> [template](#requirement\_template) | >= 2.2 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_maps_deepmerge"></a> [maps\_deepmerge](#module\_maps\_deepmerge) | ./modules/deepmerge | n/a |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |
| <a name="module_yaml_config_1"></a> [yaml\_config\_1](#module\_yaml\_config\_1) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_10"></a> [yaml\_config\_10](#module\_yaml\_config\_10) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_2"></a> [yaml\_config\_2](#module\_yaml\_config\_2) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_3"></a> [yaml\_config\_3](#module\_yaml\_config\_3) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_4"></a> [yaml\_config\_4](#module\_yaml\_config\_4) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_5"></a> [yaml\_config\_5](#module\_yaml\_config\_5) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_6"></a> [yaml\_config\_6](#module\_yaml\_config\_6) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_7"></a> [yaml\_config\_7](#module\_yaml\_config\_7) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_8"></a> [yaml\_config\_8](#module\_yaml\_config\_8) | ./modules/yaml-config | n/a |
| <a name="module_yaml_config_9"></a> [yaml\_config\_9](#module\_yaml\_config\_9) | ./modules/yaml-config | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_append_list_enabled"></a> [append\_list\_enabled](#input\_append\_list\_enabled) | A boolean flag to enable/disable appending lists instead of overwriting them. | `bool` | `false` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_deep_copy_list_enabled"></a> [deep\_copy\_list\_enabled](#input\_deep\_copy\_list\_enabled) | A boolean flag to enable/disable merging of list elements one by one. | `bool` | `false` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_list_config_local_base_path"></a> [list\_config\_local\_base\_path](#input\_list\_config\_local\_base\_path) | Base path to local YAML configuration files of list type | `string` | `""` | no |
| <a name="input_list_config_paths"></a> [list\_config\_paths](#input\_list\_config\_paths) | Paths to YAML configuration files of list type | `list(string)` | `[]` | no |
| <a name="input_list_config_remote_base_path"></a> [list\_config\_remote\_base\_path](#input\_list\_config\_remote\_base\_path) | Base path to remote YAML configuration files of list type | `string` | `""` | no |
| <a name="input_map_config_local_base_path"></a> [map\_config\_local\_base\_path](#input\_map\_config\_local\_base\_path) | Base path to local YAML configuration files of map type | `string` | `""` | no |
| <a name="input_map_config_paths"></a> [map\_config\_paths](#input\_map\_config\_paths) | Paths to YAML configuration files of map type | `list(string)` | `[]` | no |
| <a name="input_map_config_remote_base_path"></a> [map\_config\_remote\_base\_path](#input\_map\_config\_remote\_base\_path) | Base path to remote YAML configuration files of map type | `string` | `""` | no |
| <a name="input_map_configs"></a> [map\_configs](#input\_map\_configs) | List of existing configurations of map type. Deep-merging of the existing map configs takes precedence over the map configs loaded from YAML files | `any` | `[]` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_parameters"></a> [parameters](#input\_parameters) | Map of parameters for interpolation within the YAML config templates | `map(string)` | `{}` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_remote_config_selector"></a> [remote\_config\_selector](#input\_remote\_config\_selector) | String to detect local vs. remote config paths | `string` | `"://"` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_all_imports_list"></a> [all\_imports\_list](#output\_all\_imports\_list) | List of all imported YAML configurations |
| <a name="output_all_imports_map"></a> [all\_imports\_map](#output\_all\_imports\_map) | Map of all imported YAML configurations |
| <a name="output_list_configs"></a> [list\_configs](#output\_list\_configs) | Terraform lists from YAML configurations |
| <a name="output_map_configs"></a> [map\_configs](#output\_map\_configs) | Terraform maps from YAML configurations |
<!-- markdownlint-restore -->

