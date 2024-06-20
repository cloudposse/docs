---
title: tfc-cloud-agent
sidebar_label: tfc-cloud-agent
sidebar_class_name: command
description: |-
  This project installs the Terraform Cloud Agent on an existing Kubernetes cluster. You must provide your own Kubernetes provider configuration in your project!

  NOTE: Requires [Terraform Cloud Business or Terraform Enterprise](https://www.hashicorp.com/products/terraform/pricing) subscription.
custom_edit_url: https://github.com/cloudposse/terraform-kubernetes-tfc-cloud-agent/blob/main/README.yaml
---

# Module: `tfc-cloud-agent`
This project installs the Terraform Cloud Agent on an existing Kubernetes cluster. You must provide your own Kubernetes provider configuration in your project!

NOTE: Requires [Terraform Cloud Business or Terraform Enterprise](https://www.hashicorp.com/products/terraform/pricing) subscription.






## Usage


```hcl
provider "kubernetes" {
  # Context to choose from the config file, if needed.
  config_context = "example-context"
  version        = "~> 1.12"
}

module "tfc_agent" {
  source = "https://github.com/cloudposse/terraform-kubernetes-tfc-cloud-agent.git?ref=master"

  # Your agent token generated in Terraform Cloud
  token       = var.tfc_agent_token
  namespace   = var.namespace
  stage       = var.stage
  environment = var.environment
  name        = var.name

  # You can specify a namespace other than "default"
  kubernetes_namespace = "tfc-agent"
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-kubernetes-tfc-cloud-agent/) - complete example of using this module



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.12.0, < 0.14.0 |
| <a name="requirement_kubernetes"></a> [kubernetes](#requirement\_kubernetes) | >= 1.12.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_kubernetes"></a> [kubernetes](#provider\_kubernetes) | >= 1.12.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | git::https://github.com/cloudposse/terraform-null-label.git | tags/0.19.2 |

## Resources

| Name | Type |
|------|------|
| [kubernetes_deployment.tfc_cloud_agent](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/deployment) | resource |
| [kubernetes_namespace.namespace](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace) | resource |
| [kubernetes_secret.secret](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/secret) | resource |
| [kubernetes_service_account.service_account](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/service_account) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional tags for appending to tags\_as\_list\_of\_maps. Not added to `tags`. | `map(string)` | `{}` | no |
| <a name="input_agent_cli_args"></a> [agent\_cli\_args](#input\_agent\_cli\_args) | Extra command line arguments to pass to tfc-agent | `list(any)` | `[]` | no |
| <a name="input_agent_envs"></a> [agent\_envs](#input\_agent\_envs) | A map of any extra environment variables to pass to the TFC agent | `map(any)` | `{}` | no |
| <a name="input_agent_image"></a> [agent\_image](#input\_agent\_image) | Name and tag of Terraform Cloud Agent docker image | `string` | `"hashicorp/tfc-agent:latest"` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `1`) | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | <pre>object({<br/>    enabled             = bool<br/>    namespace           = string<br/>    environment         = string<br/>    stage               = string<br/>    name                = string<br/>    delimiter           = string<br/>    attributes          = list(string)<br/>    tags                = map(string)<br/>    additional_tag_map  = map(string)<br/>    regex_replace_chars = string<br/>    label_order         = list(string)<br/>    id_length_limit     = number<br/>  })</pre> | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_order": [],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {}<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `namespace`, `environment`, `stage`, `name` and `attributes`.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_deployment_annotations"></a> [deployment\_annotations](#input\_deployment\_annotations) | Annotations to add to the Kubernetes deployment | `map(any)` | `{}` | no |
| <a name="input_deployment_name"></a> [deployment\_name](#input\_deployment\_name) | Override the deployment name in Kubernetes | `string` | `null` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment, e.g. 'uw2', 'us-west-2', OR 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters.<br/>Set to `0` for unlimited length.<br/>Set to `null` for default, which is `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_kubernetes_namespace"></a> [kubernetes\_namespace](#input\_kubernetes\_namespace) | Kubernetes namespace override | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The naming order of the id output and Name tag.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 5 elements, but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_name"></a> [name](#input\_name) | Solution name, e.g. 'app' or 'jenkins' | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace, which could be your organization name or abbreviation, e.g. 'eg' or 'cp' | `string` | `null` | no |
| <a name="input_namespace_creation_enabled"></a> [namespace\_creation\_enabled](#input\_namespace\_creation\_enabled) | Enable this if the Kubernetes namespace does not already exist | `bool` | `false` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Regex to replace chars with empty string in `namespace`, `environment`, `stage` and `name`.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_replicas"></a> [replicas](#input\_replicas) | Number of replicas in the Kubernetes deployment | `number` | `1` | no |
| <a name="input_resource_limits_cpu"></a> [resource\_limits\_cpu](#input\_resource\_limits\_cpu) | Kubernetes deployment resource hard CPU limit | `string` | `"1"` | no |
| <a name="input_resource_limits_memory"></a> [resource\_limits\_memory](#input\_resource\_limits\_memory) | Kubernetes deployment resource hard memory limit | `string` | `"512Mi"` | no |
| <a name="input_resource_requests_cpu"></a> [resource\_requests\_cpu](#input\_resource\_requests\_cpu) | Kubernetes deployment resource CPU requests | `string` | `"250m"` | no |
| <a name="input_resource_requests_memory"></a> [resource\_requests\_memory](#input\_resource\_requests\_memory) | Kubernetes deployment resource memory requests | `string` | `"50Mi"` | no |
| <a name="input_service_account_annotations"></a> [service\_account\_annotations](#input\_service\_account\_annotations) | Annotations to add to the Kubernetes service account | `map(any)` | `{}` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage, e.g. 'prod', 'staging', 'dev', OR 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `map('BusinessUnit','XYZ')` | `map(string)` | `{}` | no |
| <a name="input_tfc_address"></a> [tfc\_address](#input\_tfc\_address) | The HTTP or HTTPS address of the Terraform Cloud API. | `string` | `"https://app.terraform.io"` | no |
| <a name="input_tfc_agent_data_dir"></a> [tfc\_agent\_data\_dir](#input\_tfc\_agent\_data\_dir) | The path to a directory to store all agent-related data, including<br/>Terraform configurations, cached Terraform release archives, etc. It is<br/>important to ensure that the given directory is backed by plentiful<br/>storage. | `string` | `null` | no |
| <a name="input_tfc_agent_disable_update"></a> [tfc\_agent\_disable\_update](#input\_tfc\_agent\_disable\_update) | Disable automatic core updates. | `bool` | `false` | no |
| <a name="input_tfc_agent_log_level"></a> [tfc\_agent\_log\_level](#input\_tfc\_agent\_log\_level) | The log verbosity expressed as a level string. Level options include<br/>"trace", "debug", "info", "warn", and "error" | `string` | `"info"` | no |
| <a name="input_tfc_agent_single"></a> [tfc\_agent\_single](#input\_tfc\_agent\_single) | Enable single mode. This causes the agent to handle at most one job and<br/>immediately exit thereafter. Useful for running agents as ephemeral<br/>containers, VMs, or other isolated contexts with a higher-level scheduler<br/>or process supervisor. | `bool` | `false` | no |
| <a name="input_tfc_agent_token"></a> [tfc\_agent\_token](#input\_tfc\_agent\_token) | The agent token to use when making requests to the Terraform Cloud API.<br/>This token must be obtained from the API or UI.  It is recommended to use<br/>the environment variable whenever possible for configuring this setting due<br/>to the sensitive nature of API tokens. | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_namespace"></a> [namespace](#output\_namespace) | Name of the Kubernetes namespace |
| <a name="output_service_account_name"></a> [service\_account\_name](#output\_service\_account\_name) | Name of the Kubernetes service account |
<!-- markdownlint-restore -->

