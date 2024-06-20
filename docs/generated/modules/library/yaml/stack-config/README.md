---
title: stack-config
sidebar_label: stack-config
sidebar_class_name: command
description: |-
  Terraform module that loads and processes an opinionated ["stack" configuration](#examples) from YAML sources
  using the [`terraform-provider-utils`](https://github.com/cloudposse/terraform-provider-utils) Terraform provider.

  It supports deep-merged variables, settings, ENV variables, backend config, remote state, and [Spacelift](https://spacelift.io/) stacks config outputs for Terraform and helmfile components.
custom_edit_url: https://github.com/cloudposse/terraform-yaml-stack-config/blob/main/README.yaml
---

# Module: `stack-config`
Terraform module that loads and processes an opinionated ["stack" configuration](#examples) from YAML sources
using the [`terraform-provider-utils`](https://github.com/cloudposse/terraform-provider-utils) Terraform provider.

It supports deep-merged variables, settings, ENV variables, backend config, remote state, and [Spacelift](https://spacelift.io/) stacks config outputs for Terraform and helmfile components.




## Introduction


The module is composed of the following sub-modules:

  - [vars](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/vars) - accepts stack configuration and returns deep-merged variables for a Terraform or helmfile component.
  - [settings](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/settings) - accepts stack configuration and returns deep-merged settings for a Terraform or helmfile component.
  - [env](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/env) - accepts stack configuration and returns deep-merged ENV variables for a Terraform or helmfile component.
  - [backend](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/backend) - accepts stack configuration and returns backend config for a Terraform component.
  - [remote-state](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/remote-state) - accepts stack configuration and returns remote state outputs for a Terraform component.
    The module supports `s3` and `remote` (Terraform Cloud) backends.
  - [spacelift](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/spacelift) - accepts infrastructure stack configuration and transforms it into Spacelift stacks.



## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest),
see [test](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/test).

For an example on how to configure remote state for Terraform components in YAML config files and then read the components outputs from the remote state,
see [examples/remote-state](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/examples/remote-state).

For an example on how to process `vars`, `settings`, `env` and `backend` configurations for all Terraform and helmfile components for a list of stacks,
see [examples/stacks](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/examples/stacks).




## Examples


Here's an example of a stack configuration file:

```yaml
  import:
    - ue2-globals
  vars:
    stage: dev
  terraform:
    vars: {}
  helmfile:
    vars: {}
  components:
    terraform:
      vpc:
        backend:
          s3:
            workspace_key_prefix: "vpc"
        vars:
          cidr_block: "10.102.0.0/18"
      eks:
        backend:
          s3:
            workspace_key_prefix: "eks"
        vars: {}
    helmfile:
      nginx-ingress:
        vars:
          installed: true
```

The `import` section refers to other stack configurations that are automatically deep merged.

### Complete example

This example loads the stack config `my-stack` (which in turn imports other YAML config dependencies)
and returns variables and backend config for the Terraform component `my-vpc` from the stack `my-stack`.

```hcl
  module "vars" {
    source = "cloudposse/stack-config/yaml//modules/vars"
    # version     = "x.x.x"

    stack_config_local_path = "./stacks"
    stack                   = "my-stack"
    component_type          = "terraform"
    component               = "my-vpc"

    context = module.this.context
  }

  module "backend" {
    source = "cloudposse/stack-config/yaml//modules/backend"
    # version     = "x.x.x"

    stack_config_local_path = "./stacks"
    stack                   = "my-stack"
    component_type          = "terraform"
    component               = "my-vpc"

    context = module.this.context
  }

  module "settings" {
    source = "cloudposse/stack-config/yaml//modules/settings"
    # version     = "x.x.x"

    stack_config_local_path = "./stacks"
    stack                   = "my-stack"
    component_type          = "terraform"
    component               = "my-vpc"

    context = module.this.context
  }

  module "env" {
    source = "cloudposse/stack-config/yaml//modules/env"
    # version     = "x.x.x"

    stack_config_local_path = "./stacks"
    stack                   = "my-stack"
    component_type          = "terraform"
    component               = "my-vpc"

    context = module.this.context
  }

```

The example returns the following deep-merged `vars`, `settings`, `env`, and `backend` configurations for the `my-vpc` Terraform component:

```hcl
backend = {
  "acl" = "bucket-owner-full-control"
  "bucket" = "eg-ue2-root-tfstate"
  "dynamodb_table" = "eg-ue2-root-tfstate-lock"
  "encrypt" = true
  "key" = "terraform.tfstate"
  "region" = "us-east-2"
  "role_arn" = "arn:aws:iam::xxxxxxxxxxxx:role/eg-gbl-root-terraform"
  "workspace_key_prefix" = "vpc"
}

backend_type = "s3"
base_component = "vpc"

env = {
  "ENV_TEST_1" = "test1_override"
  "ENV_TEST_2" = "test2_override"
  "ENV_TEST_3" = "test3"
  "ENV_TEST_4" = "test4"
}

settings = {
  "spacelift" = {
    "autodeploy" = true
    "branch" = "test"
    "triggers" = [
      "1",
      "2",
    ]
    "workspace_enabled" = true
  }
  "version" = 1
}

vars = {
  "availability_zones" = [
    "us-east-2a",
    "us-east-2b",
    "us-east-2c",
  ]
  "cidr_block" = "10.132.0.0/18"
  "environment" = "ue2"
  "level" = 3
  "namespace" = "eg"
  "param" = "param4"
  "region" = "us-east-2"
  "stage" = "prod"
  "subnet_type_tag_key" = "example/subnet/type"
  "test_map" = {
    "a" = "a_override_2"
    "b" = "b_override"
    "c" = [
      1,
      2,
      3,
    ]
    "map2" = {
      "atr1" = 1
      "atr2" = 2
      "atr3" = [
        "3a",
        "3b",
        "3c",
      ]
    }
  }
  "var_1" = "1_override"
  "var_2" = "2_override"
  "var_3" = "3a"
}

```

See [examples/complete](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/examples/complete) for more details.


### Remote state example

This example accepts a stack config `my-stack` (which in turn imports other YAML config dependencies)
and returns remote state outputs from the `s3` backend for `my-vpc` and `eks` Terraform components.

__NOTE:__ The backend type (`s3`) and backend configuration for the components are defined in the stack YAML config files.

```hcl
  module "remote_state_my_vpc" {
    source = "cloudposse/stack-config/yaml//modules/remote-state"
    # Cloud Posse recommends pinning every module to a specific version
    # version     = "x.x.x"

    stack_config_local_path = "./stacks"
    stack                   = "my-stack"
    component               = "my-vpc"
  }

  module "remote_state_eks" {
    source = "cloudposse/stack-config/yaml//modules/remote-state"
    # Cloud Posse recommends pinning every module to a specific version
    # version     = "x.x.x"

    stack_config_local_path = "./stacks"
    stack                   = "my-stack"
    component               = "eks"
  }
```

See [examples/remote-state](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/examples/remote-state) for more details.



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14.0 |
| <a name="requirement_external"></a> [external](#requirement\_external) | >= 2.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | >= 1.3 |
| <a name="requirement_utils"></a> [utils](#requirement\_utils) | >= 1.7.1 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_utils"></a> [utils](#provider\_utils) | >= 1.7.1 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [utils_stack_config_yaml.config](https://registry.terraform.io/providers/cloudposse/utils/latest/docs/data-sources/stack_config_yaml) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_component_deps_processing_enabled"></a> [component\_deps\_processing\_enabled](#input\_component\_deps\_processing\_enabled) | Boolean flag to enable/disable processing stack config dependencies for the components in the provided stack | `bool` | `false` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
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
| <a name="input_stack_config_local_path"></a> [stack\_config\_local\_path](#input\_stack\_config\_local\_path) | Path to local stack configs | `string` | n/a | yes |
| <a name="input_stack_deps_processing_enabled"></a> [stack\_deps\_processing\_enabled](#input\_stack\_deps\_processing\_enabled) | Boolean flag to enable/disable processing all stack dependencies in the provided stack | `bool` | `false` | no |
| <a name="input_stacks"></a> [stacks](#input\_stacks) | A list of infrastructure stack names | `list(string)` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_config"></a> [config](#output\_config) | Stack configurations |
<!-- markdownlint-restore -->

