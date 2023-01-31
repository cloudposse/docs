---
title: aws-alb-ingress
sidebar_label: aws-alb-ingress
sidebar_class_name: command
description: |-
  Terraform module to provision an HTTP style ALB ingress based on hostname and/or path.

  ALB ingress can be provisioned without authentication, or using Cognito or OIDC authentication.
custom_edit_url: https://github.com/cloudposse/terraform-aws-alb-ingress/edit/master/README.md
---

# Component: `aws-alb-ingress`
Terraform module to provision an HTTP style ALB ingress based on hostname and/or path.

ALB ingress can be provisioned without authentication, or using Cognito or OIDC authentication.






## Usage

For a complete example, see [examples/complete](examples/complete).

For automated test of the complete example using `bats` and `Terratest`, see [test](test).

```hcl
provider "aws" {
  region = var.region
}

module "vpc" {
  source     = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  namespace  = var.namespace
  stage      = var.stage
  name       = var.name
  delimiter  = var.delimiter
  attributes = var.attributes
  cidr_block = var.vpc_cidr_block

  tags       = var.tags
}

module "subnets" {
  source = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  availability_zones   = var.availability_zones
  namespace            = var.namespace
  stage                = var.stage
  name                 = var.name
  attributes           = var.attributes
  delimiter            = var.delimiter
  vpc_id               = module.vpc.vpc_id
  igw_id               = module.vpc.igw_id
  cidr_block           = module.vpc.vpc_cidr_block
  nat_gateway_enabled  = false
  nat_instance_enabled = false

  tags = var.tags
}

module "alb" {
  source = "cloudposse/alb/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  namespace                               = var.namespace
  stage                                   = var.stage
  name                                    = var.name
  attributes                              = var.attributes
  delimiter                               = var.delimiter
  vpc_id                                  = module.vpc.vpc_id
  security_group_ids                      = [module.vpc.vpc_default_security_group_id]
  subnet_ids                              = module.subnets.public_subnet_ids
  internal                                = var.internal
  http_enabled                            = var.http_enabled
  access_logs_enabled                     = var.access_logs_enabled
  alb_access_logs_s3_bucket_force_destroy = var.alb_access_logs_s3_bucket_force_destroy
  cross_zone_load_balancing_enabled       = var.cross_zone_load_balancing_enabled
  http2_enabled                           = var.http2_enabled
  idle_timeout                            = var.idle_timeout
  ip_address_type                         = var.ip_address_type
  deletion_protection_enabled             = var.deletion_protection_enabled
  deregistration_delay                    = var.deregistration_delay
  health_check_path                       = var.health_check_path
  health_check_timeout                    = var.health_check_timeout
  health_check_healthy_threshold          = var.health_check_healthy_threshold
  health_check_unhealthy_threshold        = var.health_check_unhealthy_threshold
  health_check_interval                   = var.health_check_interval
  health_check_matcher                    = var.health_check_matcher
  target_group_port                       = var.target_group_port
  target_group_target_type                = var.target_group_target_type

  tags = var.tags
}

module "alb_ingress" {
  source = "cloudposse/alb-ingress/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  namespace                           = var.namespace
  stage                               = var.stage
  name                                = var.name
  attributes                          = var.attributes
  delimiter                           = var.delimiter
  vpc_id                              = module.vpc.vpc_id
  authentication_type                 = var.authentication_type
  unauthenticated_priority            = var.unauthenticated_priority
  unauthenticated_paths               = var.unauthenticated_paths
  slow_start                          = var.slow_start
  stickiness_enabled                  = var.stickiness_enabled
  default_target_group_enabled        = false
  target_group_arn                    = module.alb.default_target_group_arn
  unauthenticated_listener_arns       = [module.alb.http_listener_arn]

  tags = var.tags
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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.42 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.42 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_lb_listener_rule.authenticated_hosts_cognito](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.authenticated_hosts_oidc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.authenticated_hosts_paths_cognito](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.authenticated_hosts_paths_oidc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.authenticated_paths_cognito](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.authenticated_paths_oidc](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.unauthenticated_hosts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.unauthenticated_hosts_paths](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_listener_rule.unauthenticated_paths](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener_rule) | resource |
| [aws_lb_target_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group) | resource |
| [aws_lb_target_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/lb_target_group) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_authenticated_hosts"></a> [authenticated\_hosts](#input\_authenticated\_hosts) | Authenticated hosts to match in Hosts header | `list(string)` | `[]` | no |
| <a name="input_authenticated_listener_arns"></a> [authenticated\_listener\_arns](#input\_authenticated\_listener\_arns) | A list of authenticated ALB listener ARNs to attach ALB listener rules to | `list(string)` | `[]` | no |
| <a name="input_authenticated_paths"></a> [authenticated\_paths](#input\_authenticated\_paths) | Authenticated path pattern to match (a maximum of 1 can be defined) | `list(string)` | `[]` | no |
| <a name="input_authenticated_priority"></a> [authenticated\_priority](#input\_authenticated\_priority) | The priority for the rules with authentication, between 1 and 50000 (1 being highest priority). Must be different from `unauthenticated_priority` since a listener can't have multiple rules with the same priority | `number` | `null` | no |
| <a name="input_authentication_cognito_on_unauthenticated_request"></a> [authentication\_cognito\_on\_unauthenticated\_request](#input\_authentication\_cognito\_on\_unauthenticated\_request) | Cognito unauthenticated behavior, deny, allow, or authenticate | `string` | `"authenticate"` | no |
| <a name="input_authentication_cognito_request_extra_params"></a> [authentication\_cognito\_request\_extra\_params](#input\_authentication\_cognito\_request\_extra\_params) | Cognito query parameters to include in redirect request | `map(string)` | `null` | no |
| <a name="input_authentication_cognito_scope"></a> [authentication\_cognito\_scope](#input\_authentication\_cognito\_scope) | Cognito scope, which should be a space separated string of requested scopes (see https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims) | `string` | `null` | no |
| <a name="input_authentication_cognito_user_pool_arn"></a> [authentication\_cognito\_user\_pool\_arn](#input\_authentication\_cognito\_user\_pool\_arn) | Cognito User Pool ARN | `string` | `""` | no |
| <a name="input_authentication_cognito_user_pool_client_id"></a> [authentication\_cognito\_user\_pool\_client\_id](#input\_authentication\_cognito\_user\_pool\_client\_id) | Cognito User Pool Client ID | `string` | `""` | no |
| <a name="input_authentication_cognito_user_pool_domain"></a> [authentication\_cognito\_user\_pool\_domain](#input\_authentication\_cognito\_user\_pool\_domain) | Cognito User Pool Domain. The User Pool Domain should be set to the domain prefix (`xxx`) instead of full domain (https://xxx.auth.us-west-2.amazoncognito.com) | `string` | `""` | no |
| <a name="input_authentication_oidc_authorization_endpoint"></a> [authentication\_oidc\_authorization\_endpoint](#input\_authentication\_oidc\_authorization\_endpoint) | OIDC Authorization Endpoint | `string` | `""` | no |
| <a name="input_authentication_oidc_client_id"></a> [authentication\_oidc\_client\_id](#input\_authentication\_oidc\_client\_id) | OIDC Client ID | `string` | `""` | no |
| <a name="input_authentication_oidc_client_secret"></a> [authentication\_oidc\_client\_secret](#input\_authentication\_oidc\_client\_secret) | OIDC Client Secret | `string` | `""` | no |
| <a name="input_authentication_oidc_issuer"></a> [authentication\_oidc\_issuer](#input\_authentication\_oidc\_issuer) | OIDC Issuer | `string` | `""` | no |
| <a name="input_authentication_oidc_on_unauthenticated_request"></a> [authentication\_oidc\_on\_unauthenticated\_request](#input\_authentication\_oidc\_on\_unauthenticated\_request) | OIDC unauthenticated behavior, deny, allow, or authenticate | `string` | `"authenticate"` | no |
| <a name="input_authentication_oidc_request_extra_params"></a> [authentication\_oidc\_request\_extra\_params](#input\_authentication\_oidc\_request\_extra\_params) | OIDC query parameters to include in redirect request | `map(string)` | `null` | no |
| <a name="input_authentication_oidc_scope"></a> [authentication\_oidc\_scope](#input\_authentication\_oidc\_scope) | OIDC scope, which should be a space separated string of requested scopes (see https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims, and https://developers.google.com/identity/protocols/oauth2/openid-connect#scope-param for an example set of scopes when using Google as the IdP) | `string` | `null` | no |
| <a name="input_authentication_oidc_token_endpoint"></a> [authentication\_oidc\_token\_endpoint](#input\_authentication\_oidc\_token\_endpoint) | OIDC Token Endpoint | `string` | `""` | no |
| <a name="input_authentication_oidc_user_info_endpoint"></a> [authentication\_oidc\_user\_info\_endpoint](#input\_authentication\_oidc\_user\_info\_endpoint) | OIDC User Info Endpoint | `string` | `""` | no |
| <a name="input_authentication_type"></a> [authentication\_type](#input\_authentication\_type) | Authentication type. Supported values are `COGNITO` and `OIDC` | `string` | `""` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_default_target_group_enabled"></a> [default\_target\_group\_enabled](#input\_default\_target\_group\_enabled) | Enable/disable creation of the default target group | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_deregistration_delay"></a> [deregistration\_delay](#input\_deregistration\_delay) | The amount of time to wait in seconds while deregistering target | `number` | `15` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_health_check_enabled"></a> [health\_check\_enabled](#input\_health\_check\_enabled) | Indicates whether health checks are enabled. Defaults to `true` | `bool` | `true` | no |
| <a name="input_health_check_healthy_threshold"></a> [health\_check\_healthy\_threshold](#input\_health\_check\_healthy\_threshold) | The number of consecutive health checks successes required before healthy | `number` | `2` | no |
| <a name="input_health_check_interval"></a> [health\_check\_interval](#input\_health\_check\_interval) | The duration in seconds in between health checks | `number` | `15` | no |
| <a name="input_health_check_matcher"></a> [health\_check\_matcher](#input\_health\_check\_matcher) | The HTTP response codes to indicate a healthy check | `string` | `"200-399"` | no |
| <a name="input_health_check_path"></a> [health\_check\_path](#input\_health\_check\_path) | The destination for the health check request | `string` | `"/"` | no |
| <a name="input_health_check_port"></a> [health\_check\_port](#input\_health\_check\_port) | The port to use to connect with the target. Valid values are either ports 1-65536, or `traffic-port`. Defaults to `traffic-port` | `string` | `"traffic-port"` | no |
| <a name="input_health_check_protocol"></a> [health\_check\_protocol](#input\_health\_check\_protocol) | The protocol to use to connect with the target. Defaults to `HTTP`. Not applicable when `target_type` is `lambda` | `string` | `"HTTP"` | no |
| <a name="input_health_check_timeout"></a> [health\_check\_timeout](#input\_health\_check\_timeout) | The amount of time to wait in seconds before failing a health check request | `number` | `10` | no |
| <a name="input_health_check_unhealthy_threshold"></a> [health\_check\_unhealthy\_threshold](#input\_health\_check\_unhealthy\_threshold) | The number of consecutive health check failures required before unhealthy | `number` | `2` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_listener_http_header_conditions"></a> [listener\_http\_header\_conditions](#input\_listener\_http\_header\_conditions) | A list of http header conditions to apply to the listener. | <pre>list(object({<br/>    name  = string<br/>    value = list(string)<br/>  }))</pre> | `[]` | no |
| <a name="input_load_balancing_algorithm_type"></a> [load\_balancing\_algorithm\_type](#input\_load\_balancing\_algorithm\_type) | Determines how the load balancer selects targets when routing requests. Only applicable for Application Load Balancer Target Groups. The value is round\_robin or least\_outstanding\_requests. The default is round\_robin. | `string` | `"round_robin"` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_port"></a> [port](#input\_port) | The port for the created ALB target group (if `target_group_arn` is not set) | `number` | `80` | no |
| <a name="input_protocol"></a> [protocol](#input\_protocol) | The protocol for the created ALB target group (if `target_group_arn` is not set) | `string` | `"HTTP"` | no |
| <a name="input_protocol_version"></a> [protocol\_version](#input\_protocol\_version) | Only applicable when protocol is `HTTP` or `HTTPS`. The protocol version. Specify GRPC to send requests to targets using gRPC. Specify HTTP2 to send requests to targets using HTTP/2. The default is `HTTP1`, which sends requests to targets using HTTP/1.1 | `string` | `"HTTP1"` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_slow_start"></a> [slow\_start](#input\_slow\_start) | The amount of time for targets to warm up before the load balancer sends them a full share of requests. The range is 30-900 seconds or 0 to disable. The default value is `0` seconds | `number` | `0` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_stickiness_cookie_duration"></a> [stickiness\_cookie\_duration](#input\_stickiness\_cookie\_duration) | The time period, in seconds, during which requests from a client should be routed to the same target. After this time period expires, the load balancer-generated cookie is considered stale. The range is 1 second to 1 week (604800 seconds). The default value is 1 day (86400 seconds) | `number` | `86400` | no |
| <a name="input_stickiness_enabled"></a> [stickiness\_enabled](#input\_stickiness\_enabled) | Boolean to enable / disable `stickiness`. Default is `true` | `bool` | `true` | no |
| <a name="input_stickiness_type"></a> [stickiness\_type](#input\_stickiness\_type) | The type of sticky sessions. The only current possible value is `lb_cookie` | `string` | `"lb_cookie"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_target_group_arn"></a> [target\_group\_arn](#input\_target\_group\_arn) | Existing ALB target group ARN. If provided, set `default_target_group_enabled` to `false` to disable creation of the default target group | `string` | `""` | no |
| <a name="input_target_group_name"></a> [target\_group\_name](#input\_target\_group\_name) | Override the target group name | `string` | `""` | no |
| <a name="input_target_type"></a> [target\_type](#input\_target\_type) | The type (`instance`, `ip` or `lambda`) of targets that can be registered with the target group | `string` | `"ip"` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_unauthenticated_hosts"></a> [unauthenticated\_hosts](#input\_unauthenticated\_hosts) | Unauthenticated hosts to match in Hosts header | `list(string)` | `[]` | no |
| <a name="input_unauthenticated_listener_arns"></a> [unauthenticated\_listener\_arns](#input\_unauthenticated\_listener\_arns) | A list of unauthenticated ALB listener ARNs to attach ALB listener rules to | `list(string)` | `[]` | no |
| <a name="input_unauthenticated_paths"></a> [unauthenticated\_paths](#input\_unauthenticated\_paths) | Unauthenticated path pattern to match (a maximum of 1 can be defined) | `list(string)` | `[]` | no |
| <a name="input_unauthenticated_priority"></a> [unauthenticated\_priority](#input\_unauthenticated\_priority) | The priority for the rules without authentication, between 1 and 50000 (1 being highest priority). Must be different from `authenticated_priority` since a listener can't have multiple rules with the same priority | `number` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The VPC ID where generated ALB target group will be provisioned (if `target_group_arn` is not set) | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_target_group_arn"></a> [target\_group\_arn](#output\_target\_group\_arn) | ALB Target Group ARN |
| <a name="output_target_group_arn_suffix"></a> [target\_group\_arn\_suffix](#output\_target\_group\_arn\_suffix) | ALB Target Group ARN suffix |
| <a name="output_target_group_name"></a> [target\_group\_name](#output\_target\_group\_name) | ALB Target Group name |
<!-- markdownlint-restore -->


