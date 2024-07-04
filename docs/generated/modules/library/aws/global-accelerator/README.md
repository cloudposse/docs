---
title: global-accelerator
sidebar_label: global-accelerator
sidebar_class_name: command
description: |-
  This module provisions AWS Global Accelerator. Multiple listeners can be specified when instantiating this module.
  The `endpoint-group` submodule provisions a Global Accelerator Endpoint Group for a listener created by this module and can be instantiated multiple times
  in order to provision multiple Endpoint Groups.

  The reason why `endpoint-group` is its own submodule is because an AWS Provider needs to be instantiated for the region the Endpoint Group's endpoints reside in.
  For more information, see the [endpoint-group documentation](https://github.com/cloudposse/terraform-aws-global-accelerator/tree/main/modules/endpoint-group/README.md).
custom_edit_url: https://github.com/cloudposse/terraform-aws-global-accelerator/blob/main/README.yaml
---

# Module: `global-accelerator`
This module provisions AWS Global Accelerator. Multiple listeners can be specified when instantiating this module.
The `endpoint-group` submodule provisions a Global Accelerator Endpoint Group for a listener created by this module and can be instantiated multiple times
in order to provision multiple Endpoint Groups.

The reason why `endpoint-group` is its own submodule is because an AWS Provider needs to be instantiated for the region the Endpoint Group's endpoints reside in.
For more information, see the [endpoint-group documentation](https://github.com/cloudposse/terraform-aws-global-accelerator/tree/main/modules/endpoint-group/README.md).






## Usage

For a complete examples, see [examples/](https://github.com/cloudposse/terraform-aws-global-accelerator/tree/main/examples/).

The following deploys Global Accelerator with endpoints in a single region:

```hcl
module "global_accelerator" {
  source = "cloudposse/global-accelerator/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ip_address_type     = "IPV4"
  flow_logs_enabled   = true
  flow_logs_s3_prefix = "logs/"
  flow_logs_s3_bucket = module.s3_bucket.bucket_id

  listeners = [
    {
      client_affinity = "NONE"
      protocol = "TCP"
      port_ranges = [
        {
          from_port = 80
          to_port = 80
        }
      ]
    }
  ]

  context = module.this.context
}

module "endpoint_group" {
  source = "cloudposse/global-accelerator/aws//modules/endpoint-group"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  listener_arn = module.global_accelerator.listener_ids[0]
  config       = {
    endpoint_region = "us-east-2"
    endpoint_configuration = [
      {
        endpoint_lb_name = "my-load-balancer"
      }
    ]
  }

  context = module.this.context
}
```

The following deploys Global Accelerator with endpoints in multiple regions:

```hcl
module "global_accelerator" {
  source = "cloudposse/global-accelerator/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  ip_address_type     = "IPV4"
  flow_logs_enabled   = true
  flow_logs_s3_prefix = "logs/"
  flow_logs_s3_bucket = module.s3_bucket.bucket_id

  listeners = [
    {
      client_affinity = "NONE"
      protocol = "TCP"
      port_ranges = [
        {
          from_port = 80
          to_port = 80
        }
      ]
    }
  ]

  context = module.this.context
}

module "endpoint_group" {
  source = "cloudposse/global-accelerator/aws//modules/endpoint-group"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  listener_arn = module.global_accelerator.listener_ids[0]
  config       = {
    endpoint_region = "us-east-2"
    endpoint_configuration = [
      {
        endpoint_lb_name = "my-load-balancer"
      }
    ]
  }

  context = module.this.context
}

module "endpoint_group_failover" {
  source = "cloudposse/global-accelerator/aws//modules/endpoint-group"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  listener_arn = module.global_accelerator.listener_ids[0]
  config       = {
    endpoint_region = "us-west-2"
    endpoint_configuration = [
      {
        endpoint_lb_name = "my-failover-load-balancer"
      }
    ]
  }

  providers = {
    aws = aws.failover
  }

  context = module.failover_label.context
}
```




## Examples

Here are some examples of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-global-accelerator/tree/main/examples/complete/) - complete example of using this module
- [`examples/multiple_endpoints`](https://github.com/cloudposse/terraform-aws-global-accelerator/tree/main/examples/multiple_endpoints/) - multi-region example



<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_globalaccelerator_accelerator.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/globalaccelerator_accelerator) | resource |
| [aws_globalaccelerator_listener.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/globalaccelerator_listener) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_flow_logs_enabled"></a> [flow\_logs\_enabled](#input\_flow\_logs\_enabled) | Enable or disable flow logs for the Global Accelerator. | `bool` | `false` | no |
| <a name="input_flow_logs_s3_bucket"></a> [flow\_logs\_s3\_bucket](#input\_flow\_logs\_s3\_bucket) | The name of the S3 Bucket for the Accelerator Flow Logs. Required if `var.flow_logs_enabled` is set to `true`. | `string` | `null` | no |
| <a name="input_flow_logs_s3_prefix"></a> [flow\_logs\_s3\_prefix](#input\_flow\_logs\_s3\_prefix) | The Object Prefix within the S3 Bucket for the Accelerator Flow Logs. Required if `var.flow_logs_enabled` is set to `true`. | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_ip_address_type"></a> [ip\_address\_type](#input\_ip\_address\_type) | The address type to use for the Global Accelerator. At this moment, [only IPV4 is supported](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/globalaccelerator_accelerator#ip_address_type). | `string` | `"IPV4"` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_listeners"></a> [listeners](#input\_listeners) | list of listeners to configure for the global accelerator.<br/>For more information, see: [aws\_globalaccelerator\_listener](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/globalaccelerator_listener). | <pre>list(object({<br/>    client_affinity = string<br/>    port_ranges = list(object({<br/>      from_port = number<br/>      to_port   = number<br/>    }))<br/>    protocol = string<br/>  }))</pre> | `[]` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_dns_name"></a> [dns\_name](#output\_dns\_name) | DNS name of the Global Accelerator. |
| <a name="output_hosted_zone_id"></a> [hosted\_zone\_id](#output\_hosted\_zone\_id) | Route 53 zone ID that can be used to route an Alias Resource Record Set to the Global Accelerator. |
| <a name="output_listener_ids"></a> [listener\_ids](#output\_listener\_ids) | Global Accelerator Listener IDs. |
| <a name="output_name"></a> [name](#output\_name) | Name of the Global Accelerator. |
| <a name="output_static_ips"></a> [static\_ips](#output\_static\_ips) | Global Static IPs owned by the Global Accelerator. |
<!-- markdownlint-restore -->
