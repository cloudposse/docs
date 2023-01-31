---
title: aws-ec2-client-vpn
sidebar_label: aws-ec2-client-vpn
sidebar_class_name: command
description: |-
  The `terraform-aws-ec2-client-vpn` project provides for ec2 client vpn infrastructure. AWS Client VPN is a managed client-based VPN service based on OpenVPN that enables you to securely access your AWS resources and resources in your on-premises network. With Client VPN, you can access your resources from any location using [any OpenVPN-based VPN client](https://docs.aws.amazon.com/vpn/latest/clientvpn-user/connect-aws-client-vpn-connect.html).
custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-client-vpn/edit/master/README.md
---

# Component: `aws-ec2-client-vpn`
The `terraform-aws-ec2-client-vpn` project provides for ec2 client vpn infrastructure. AWS Client VPN is a managed client-based VPN service based on OpenVPN that enables you to securely access your AWS resources and resources in your on-premises network. With Client VPN, you can access your resources from any location using [any OpenVPN-based VPN client](https://docs.aws.amazon.com/vpn/latest/clientvpn-user/connect-aws-client-vpn-connect.html).






## Usage

For a complete example, see [examples/complete](examples/complete).

For automated tests of the complete example using [bats](https://github.com/bats-core/bats-core) and [Terratest](https://github.com/gruntwork-io/terratest)
(which tests and deploys the example on AWS), see [test](test).

```hcl
module "vpc_target" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  cidr_block = "172.16.0.0/16"

  context = module.this.context
}

module "vpc_client" {
  source  = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  cidr_block = "172.31.0.0/16"

  context = module.this.context
}

module "subnets" {
  source  = "cloudposse/dynamic-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  availability_zones   = var.availability_zones
  vpc_id               = module.vpc_target.vpc_id
  igw_id               = module.vpc_target.igw_id
  cidr_block           = module.vpc_target.vpc_cidr_block
  nat_gateway_enabled  = true
  nat_instance_enabled = false

  context = module.this.context
}

module "ec2_client_vpn" {
  source  = "cloudposse/ec2-client-vpn/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  client_cidr             = module.vpc_client.vpc_cidr_block
  organization_name       = var.organization_name
  logging_enabled         = var.logging_enabled
  retention_in_days       = var.retention_in_days
  associated_subnets      = module.subnets.private_subnet_ids
  authorization_rules     = var.authorization_rules

  additional_routes = [
    {
      destination_cidr_block = "0.0.0.0/0"
      description            = "Internet Route"
      target_vpc_subnet_id   = element(module.subnets.private_subnet_ids, 0)
    }
  ]
}
```




## Examples

Here is an example of using this module:
- [`examples/complete`](https://github.com/cloudposse/terraform-aws-ec2-client-vpn/examples/complete/) - complete example of using this module



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
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |
| <a name="requirement_awsutils"></a> [awsutils](#requirement\_awsutils) | >= 0.8.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |
| <a name="provider_awsutils"></a> [awsutils](#provider\_awsutils) | >= 0.8.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cloudwatch_log"></a> [cloudwatch\_log](#module\_cloudwatch\_log) | cloudposse/cloudwatch-logs/aws | 0.6.6 |
| <a name="module_self_signed_cert_ca"></a> [self\_signed\_cert\_ca](#module\_self\_signed\_cert\_ca) | cloudposse/ssm-tls-self-signed-cert/aws | 1.1.0 |
| <a name="module_self_signed_cert_root"></a> [self\_signed\_cert\_root](#module\_self\_signed\_cert\_root) | cloudposse/ssm-tls-self-signed-cert/aws | 1.0.0 |
| <a name="module_self_signed_cert_server"></a> [self\_signed\_cert\_server](#module\_self\_signed\_cert\_server) | cloudposse/ssm-tls-self-signed-cert/aws | 1.0.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |
| <a name="module_vpn_security_group"></a> [vpn\_security\_group](#module\_vpn\_security\_group) | cloudposse/security-group/aws | 1.0.1 |

## Resources

| Name | Type |
|------|------|
| [aws_ec2_client_vpn_authorization_rule.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_client_vpn_authorization_rule) | resource |
| [aws_ec2_client_vpn_endpoint.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_client_vpn_endpoint) | resource |
| [aws_ec2_client_vpn_network_association.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_client_vpn_network_association) | resource |
| [aws_ec2_client_vpn_route.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_client_vpn_route) | resource |
| [aws_iam_saml_provider.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_saml_provider) | resource |
| [aws_ssm_parameter.ca_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ssm_parameter) | data source |
| [aws_ssm_parameter.root_key](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ssm_parameter) | data source |
| [awsutils_ec2_client_vpn_export_client_config.default](https://registry.terraform.io/providers/cloudposse/awsutils/latest/docs/data-sources/ec2_client_vpn_export_client_config) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_routes"></a> [additional\_routes](#input\_additional\_routes) | A list of additional routes that should be attached to the Client VPN endpoint | <pre>list(object({<br/>    destination_cidr_block = string<br/>    description            = string<br/>    target_vpc_subnet_id   = string<br/>  }))</pre> | `[]` | no |
| <a name="input_additional_security_group_rules"></a> [additional\_security\_group\_rules](#input\_additional\_security\_group\_rules) | A list of Security Group rule objects to add to the created security group, in addition to the ones<br/>this module normally creates. (To suppress the module's rules, set `create_security_group` to false<br/>and supply your own security group via `associated_security_group_ids`.)<br/>The keys and values of the objects are fully compatible with the `aws_security_group_rule` resource, except<br/>for `security_group_id` which will be ignored, and the optional "key" which, if provided, must be unique and known at "plan" time.<br/>To get more info see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule . | `list(any)` | `[]` | no |
| <a name="input_additional_security_groups"></a> [additional\_security\_groups](#input\_additional\_security\_groups) | DEPRECATED: Use `associated_security_group_ids` instead.<br/>List of security groups to attach to the client vpn network associations | `list(string)` | `[]` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_allow_self_security_group"></a> [allow\_self\_security\_group](#input\_allow\_self\_security\_group) | Whether the security group itself will be added as a source to this ingress rule. | `bool` | `true` | no |
| <a name="input_allowed_cidr_blocks"></a> [allowed\_cidr\_blocks](#input\_allowed\_cidr\_blocks) | A list of IPv4 CIDRs to allow access to the security group created by this module.<br/>The length of this list must be known at "plan" time. | `list(string)` | `[]` | no |
| <a name="input_allowed_ipv6_cidr_blocks"></a> [allowed\_ipv6\_cidr\_blocks](#input\_allowed\_ipv6\_cidr\_blocks) | A list of IPv6 CIDRs to allow access to the security group created by this module.<br/>The length of this list must be known at "plan" time. | `list(string)` | `[]` | no |
| <a name="input_allowed_ipv6_prefix_list_ids"></a> [allowed\_ipv6\_prefix\_list\_ids](#input\_allowed\_ipv6\_prefix\_list\_ids) | A list of IPv6 Prefix Lists IDs to allow access to the security group created by this module.<br/>The length of this list must be known at "plan" time. | `list(string)` | `[]` | no |
| <a name="input_allowed_security_group_ids"></a> [allowed\_security\_group\_ids](#input\_allowed\_security\_group\_ids) | A list of IDs of Security Groups to allow access to the security group created by this module.<br/>The length of this list must be known at "plan" time. | `list(string)` | `[]` | no |
| <a name="input_associated_security_group_ids"></a> [associated\_security\_group\_ids](#input\_associated\_security\_group\_ids) | A list of IDs of Security Groups to associate the VPN endpoints with, in addition to the created security group.<br/>These security groups will not be modified and, if `create_security_group` is `false`, must have rules providing the desired access. | `list(string)` | `[]` | no |
| <a name="input_associated_subnets"></a> [associated\_subnets](#input\_associated\_subnets) | List of subnets to associate with the VPN endpoint | `list(string)` | n/a | yes |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_authentication_type"></a> [authentication\_type](#input\_authentication\_type) | One of `certificate-authentication` or `federated-authentication` | `string` | `"certificate-authentication"` | no |
| <a name="input_authorization_rules"></a> [authorization\_rules](#input\_authorization\_rules) | List of objects describing the authorization rules for the client vpn | `list(map(any))` | `[]` | no |
| <a name="input_ca_common_name"></a> [ca\_common\_name](#input\_ca\_common\_name) | Unique Common Name for CA self-signed certificate | `string` | `null` | no |
| <a name="input_client_cidr"></a> [client\_cidr](#input\_client\_cidr) | Network CIDR to use for clients | `string` | n/a | yes |
| <a name="input_client_conf_tmpl_path"></a> [client\_conf\_tmpl\_path](#input\_client\_conf\_tmpl\_path) | Path to template file of vpn client exported configuration. Path is relative to ${path.module} | `string` | `null` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_create_security_group"></a> [create\_security\_group](#input\_create\_security\_group) | Set `true` to create and configure a new security group. If false, `associated_security_group_ids` must be provided. | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_dns_servers"></a> [dns\_servers](#input\_dns\_servers) | Information about the DNS servers to be used for DNS resolution. A Client VPN endpoint can have up to two DNS servers. If no DNS server is specified, the DNS address of the connecting device is used. | `list(string)` | `[]` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_export_client_certificate"></a> [export\_client\_certificate](#input\_export\_client\_certificate) | Flag to determine whether to export the client certificate with the VPN configuration | `bool` | `false` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_logging_enabled"></a> [logging\_enabled](#input\_logging\_enabled) | Enables or disables Client VPN Cloudwatch logging. | `bool` | `false` | no |
| <a name="input_logging_stream_name"></a> [logging\_stream\_name](#input\_logging\_stream\_name) | Names of stream used for logging | `string` | n/a | yes |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_organization_name"></a> [organization\_name](#input\_organization\_name) | Name of organization to use in private certificate | `string` | n/a | yes |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_retention_in_days"></a> [retention\_in\_days](#input\_retention\_in\_days) | Number of days you want to retain log events in the log group | `number` | `"30"` | no |
| <a name="input_root_common_name"></a> [root\_common\_name](#input\_root\_common\_name) | Unique Common Name for Root self-signed certificate | `string` | `null` | no |
| <a name="input_saml_metadata_document"></a> [saml\_metadata\_document](#input\_saml\_metadata\_document) | Optional SAML metadata document. Must include this or `saml_provider_arn` | `string` | `null` | no |
| <a name="input_saml_provider_arn"></a> [saml\_provider\_arn](#input\_saml\_provider\_arn) | Optional SAML provider ARN. Must include this or `saml_metadata_document` | `string` | `null` | no |
| <a name="input_secret_path_format"></a> [secret\_path\_format](#input\_secret\_path\_format) | The path format to use when writing secrets to the certificate backend.<br/>The certificate secret path will be computed as `format(var.secret_path_format, var.name, var.secret_extensions.certificate)`<br/>and the private key path as `format(var.secret_path_format, var.name, var.secret_extensions.private_key)`.<br/>Thus by default, if `var.name`=`example-self-signed-cert`, then the resulting secret paths for the self-signed certificate's<br/>PEM file and private key will be `/example-self-signed-cert.pem` and `/example-self-signed-cert.key`, respectively.<br/>This variable can be overridden in order to create more specific certificate backend paths. | `string` | `"/%s.%s"` | no |
| <a name="input_security_group_create_before_destroy"></a> [security\_group\_create\_before\_destroy](#input\_security\_group\_create\_before\_destroy) | Set `true` to enable Terraform `create_before_destroy` behavior on the created security group.<br/>Note that changing this value will always cause the security group to be replaced. | `bool` | `true` | no |
| <a name="input_security_group_create_timeout"></a> [security\_group\_create\_timeout](#input\_security\_group\_create\_timeout) | How long to wait for the security group to be created. | `string` | `"10m"` | no |
| <a name="input_security_group_delete_timeout"></a> [security\_group\_delete\_timeout](#input\_security\_group\_delete\_timeout) | How long to retry on `DependencyViolation` errors during security group deletion from<br/>lingering ENIs left by certain AWS services such as Elastic Load Balancing. | `string` | `"15m"` | no |
| <a name="input_security_group_description"></a> [security\_group\_description](#input\_security\_group\_description) | The description to assign to the created Security Group.<br/>Warning: Changing the description causes the security group to be replaced. | `string` | `null` | no |
| <a name="input_security_group_name"></a> [security\_group\_name](#input\_security\_group\_name) | The name to assign to the created security group. Must be unique within the VPC.<br/>If not provided, will be derived from the `null-label.context` passed in.<br/>If `create_before_destroy` is true, will be used as a name prefix. | `list(string)` | `[]` | no |
| <a name="input_self_service_portal_enabled"></a> [self\_service\_portal\_enabled](#input\_self\_service\_portal\_enabled) | Specify whether to enable the self-service portal for the Client VPN endpoint | `bool` | `false` | no |
| <a name="input_self_service_saml_provider_arn"></a> [self\_service\_saml\_provider\_arn](#input\_self\_service\_saml\_provider\_arn) | The ARN of the IAM SAML identity provider for the self service portal if type is federated-authentication. | `string` | `null` | no |
| <a name="input_server_common_name"></a> [server\_common\_name](#input\_server\_common\_name) | Unique Common Name for Server self-signed certificate | `string` | `null` | no |
| <a name="input_session_timeout_hours"></a> [session\_timeout\_hours](#input\_session\_timeout\_hours) | The maximum session duration is a trigger by which end-users are required to re-authenticate prior to establishing a VPN session. Default value is 24. Valid values: 8 \| 10 \| 12 \| 24 | `string` | `"24"` | no |
| <a name="input_split_tunnel"></a> [split\_tunnel](#input\_split\_tunnel) | Indicates whether split-tunnel is enabled on VPN endpoint. Default value is false. | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | ID of VPC to attach VPN to | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_client_configuration"></a> [client\_configuration](#output\_client\_configuration) | VPN Client Configuration data. |
| <a name="output_full_client_configuration"></a> [full\_client\_configuration](#output\_full\_client\_configuration) | Client configuration including client certificate and private key |
| <a name="output_vpn_endpoint_arn"></a> [vpn\_endpoint\_arn](#output\_vpn\_endpoint\_arn) | The ARN of the Client VPN Endpoint Connection. |
| <a name="output_vpn_endpoint_dns_name"></a> [vpn\_endpoint\_dns\_name](#output\_vpn\_endpoint\_dns\_name) | The DNS Name of the Client VPN Endpoint Connection. |
| <a name="output_vpn_endpoint_id"></a> [vpn\_endpoint\_id](#output\_vpn\_endpoint\_id) | The ID of the Client VPN Endpoint Connection. |
<!-- markdownlint-restore -->


