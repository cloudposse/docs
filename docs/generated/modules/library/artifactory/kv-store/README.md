---
title: kv-store
sidebar_label: kv-store
sidebar_class_name: command
description: |-
  This module is a key/value store for storing configuration data that should be shared among terraform root
  modules. The backend for this key/value store is a generic Artifactory repository.
custom_edit_url: https://github.com/cloudposse/terraform-artifactory-kv-store/blob/main/README.yaml
---

# Module: `kv-store`
This module is a key/value store for storing configuration data that should be shared among terraform root
modules. The backend for this key/value store is a generic Artifactory repository.




## Introduction





## Usage

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-artifactory-kv-store/tree/main/examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](https://github.com/cloudposse/terraform-artifactory-kv-store/tree/main/test).

```hcl

module "example" {
  source  = "cloudposse/kv-store/artifactory"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  set = {
    "key1" = {value = "value1", sensative = false }
    "key2" = {value = "value2", sensative = true }
  }

  context = module.label.this
}
```

## Quick Start

Here's how to get started...


## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-artifactory-kv-store/) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_artifactory"></a> [artifactory](#requirement\_artifactory) | >= 10 |
| <a name="requirement_context"></a> [context](#requirement\_context) | >= 0.0.0 |
| <a name="requirement_restapi"></a> [restapi](#requirement\_restapi) | >= 1 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_artifactory"></a> [artifactory](#provider\_artifactory) | >= 10 |
| <a name="provider_context"></a> [context](#provider\_context) | >= 0.0.0 |
| <a name="provider_restapi"></a> [restapi](#provider\_restapi) | >= 1 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [restapi_object.write_kv_pair](https://registry.terraform.io/providers/Mastercard/restapi/latest/docs/resources/object) | resource |
| [artifactory_file.read_kv_pair](https://registry.terraform.io/providers/jfrog/artifactory/latest/docs/data-sources/file) | data source |
| [artifactory_file.read_kv_path_file](https://registry.terraform.io/providers/jfrog/artifactory/latest/docs/data-sources/file) | data source |
| [artifactory_file_list.read_kv_path](https://registry.terraform.io/providers/jfrog/artifactory/latest/docs/data-sources/file_list) | data source |
| [context_config.this](https://registry.terraform.io/providers/cloudposse/context/latest/docs/data-sources/config) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_artifactory_auth_token"></a> [artifactory\_auth\_token](#input\_artifactory\_auth\_token) | The authentication token to use when accessing artifactory. Getting this value from the environment is supported<br/>with JFROG\_ACCESS\_TOKEN or ARTIFACTORY\_ACCESS\_TOKEN variables. | `string` | n/a | yes |
| <a name="input_artifactory_base_uri"></a> [artifactory\_base\_uri](#input\_artifactory\_base\_uri) | The base URI for artifactory. | `string` | n/a | yes |
| <a name="input_artifactory_repository"></a> [artifactory\_repository](#input\_artifactory\_repository) | The name of the artifactory repository. | `string` | n/a | yes |
| <a name="input_get"></a> [get](#input\_get) | A map of keys to read from the key/value store. The key\_path, namespace,<br/>tenant, stage, environment, and name are derived from context by default,<br/>but can be overridden by specifying a value in the map. | <pre>map(object(<br/>    {<br/>      key_path   = optional(string),<br/>      properties = optional(map(string))<br/>    }<br/>    )<br/>  )</pre> | `{}` | no |
| <a name="input_get_by_path"></a> [get\_by\_path](#input\_get\_by\_path) | A map of keys to read from the key/value store. The key\_path, namespace,<br/>tenant, stage, environment, and name are derived from context by default,<br/>but can be overridden by specifying a value in the map. | <pre>map(object(<br/>    {<br/>      key_path   = optional(string),<br/>      properties = optional(map(string))<br/>    }<br/>    )<br/>  )</pre> | `{}` | no |
| <a name="input_key_label_order"></a> [key\_label\_order](#input\_key\_label\_order) | The order in which the labels (ID elements) appear in the full key path. For example, if you want a key path to<br/>look like /{namespace}/{tenant}/{stage}/{environment}/name, you would set this varibale to<br/>["namespace", "tenant", "stage", "environment", "name"]. | `list(string)` | n/a | yes |
| <a name="input_key_prefix"></a> [key\_prefix](#input\_key\_prefix) | The prefix to use for the key path. This is useful for storing all keys for a module under a common prefix. | `string` | `""` | no |
| <a name="input_set"></a> [set](#input\_set) | A map of key-value pairs to write to the key/value store. The key\_path,<br/>namespace, tenant, stage, environment, and name are derived from context by<br/>default, but can be overridden by specifying a value in the map. | <pre>map(object(<br/>    {<br/>      key_path   = optional(string),<br/>      value      = string,<br/>      sensitive  = bool,<br/>      properties = optional(map(string))<br/>    }<br/>    )<br/>  )</pre> | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_values"></a> [values](#output\_values) | n/a |
<!-- markdownlint-restore -->

