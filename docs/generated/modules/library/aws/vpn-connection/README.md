---
title: vpn-connection
sidebar_label: vpn-connection
sidebar_class_name: command
description: |-
  Terraform module to provision a [site-to-site](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) [VPN connection](https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html)
  between a VPC and an on-premises network.

  The module does the following:

  - Creates a Virtual Private Gateway (VPG) and attaches it to the VPC
  - Creates a Customer Gateway (CGW) pointing to the provided IP address of the Internet-routable external interface on the on-premises network
  - Creates a Site-to-Site Virtual Private Network (VPN) connection and assigns it to the VPG and CGW
  - Requests automatic route propagation between the VPG and the provided route tables in the VPC
  - If the VPN connection is configured to use static routes, provisions a static route between the VPN connection and the CGW
tags:
  - aws
  - terraform
  - terraform-modules
  - vpc
  - subnet
  - route
  - route-table
  - vpn
  - vpn-connection
  - site-to-site-vpn-connection
  - virtual-private-gateway
  - customer-gateway
  - ip
  - ip-address

custom_edit_url: https://github.com/cloudposse/terraform-aws-vpn-connection/blob/main/README.yaml
---

# Module: `vpn-connection`
Terraform module to provision a [site-to-site](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) [VPN connection](https://docs.aws.amazon.com/vpc/latest/userguide/vpn-connections.html)
between a VPC and an on-premises network.

The module does the following:

- Creates a Virtual Private Gateway (VPG) and attaches it to the VPC
- Creates a Customer Gateway (CGW) pointing to the provided IP address of the Internet-routable external interface on the on-premises network
- Creates a Site-to-Site Virtual Private Network (VPN) connection and assigns it to the VPG and CGW
- Requests automatic route propagation between the VPG and the provided route tables in the VPC
- If the VPN connection is configured to use static routes, provisions a static route between the VPN connection and the CGW






## Usage

```hcl
  module "vpn_connection" {
    source = "cloudposse/vpn-connection/aws"
    # Cloud Posse recommends pinning every module to a specific version
    # version = "x.x.x"
    namespace                                 = "eg"
    stage                                     = "dev"
    name                                      = "test"
    vpc_id                                    = "vpc-xxxxxxxx"
    vpn_gateway_amazon_side_asn               = 64512
    customer_gateway_bgp_asn                  = 65000
    customer_gateway_ip_address               = "172.0.0.1"
    route_table_ids                           = ["rtb-xxxxxxxx", "rtb-yyyyyyyy", "rtb-zzzzzzzz"]
    vpn_connection_static_routes_only         = "true"
    vpn_connection_static_routes_destinations = ["10.80.1.0/24"]
  }
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_logs"></a> [logs](#module\_logs) | cloudposse/cloudwatch-logs/aws | 0.6.8 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_customer_gateway.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/customer_gateway) | resource |
| [aws_ec2_tag.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_tag) | resource |
| [aws_ec2_transit_gateway_route.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route) | resource |
| [aws_ec2_transit_gateway_route_table_association.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route_table_association) | resource |
| [aws_ec2_transit_gateway_route_table_propagation.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_transit_gateway_route_table_propagation) | resource |
| [aws_vpn_connection.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpn_connection) | resource |
| [aws_vpn_connection_route.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpn_connection_route) | resource |
| [aws_vpn_gateway.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpn_gateway) | resource |
| [aws_vpn_gateway_route_propagation.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpn_gateway_route_propagation) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_customer_gateway_bgp_asn"></a> [customer\_gateway\_bgp\_asn](#input\_customer\_gateway\_bgp\_asn) | The gateway's Border Gateway Protocol (BGP) Autonomous System Number (ASN) | `number` | `65000` | no |
| <a name="input_customer_gateway_ip_address"></a> [customer\_gateway\_ip\_address](#input\_customer\_gateway\_ip\_address) | The IP address of the gateway's Internet-routable external interface | `string` | n/a | yes |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_existing_transit_gateway_id"></a> [existing\_transit\_gateway\_id](#input\_existing\_transit\_gateway\_id) | Existing Transit Gateway ID. If provided, the module will not create a Virtual Private Gateway but instead will use the transit\_gateway. For setting up transit gateway we can use the cloudposse/transit-gateway/aws module and pass the output transit\_gateway\_id to this variable. | `string` | `""` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_route_table_ids"></a> [route\_table\_ids](#input\_route\_table\_ids) | The IDs of the route tables for which routes from the Virtual Private Gateway will be propagated | `list(string)` | `[]` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_transit_gateway_enabled"></a> [transit\_gateway\_enabled](#input\_transit\_gateway\_enabled) | Set to true to enable VPN connection to transit gateway and then pass in the existing\_transit\_gateway\_id | `bool` | `false` | no |
| <a name="input_transit_gateway_route_table_id"></a> [transit\_gateway\_route\_table\_id](#input\_transit\_gateway\_route\_table\_id) | The ID of the route table for the transit gateway that you want to associate + propogate the VPN connection's TGW attachment | `string` | `null` | no |
| <a name="input_transit_gateway_routes"></a> [transit\_gateway\_routes](#input\_transit\_gateway\_routes) | A map of transit gateway routes to create on the given TGW route table (via `transit_gateway_route_table_id`) for the created VPN Attachment. Use the key in the map to describe the route. | <pre>map(object({<br/>    blackhole              = optional(bool, false)<br/>    destination_cidr_block = string<br/>  }))</pre> | `{}` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The ID of the VPC to which the Virtual Private Gateway will be attached | `string` | `null` | no |
| <a name="input_vpn_connection_local_ipv4_network_cidr"></a> [vpn\_connection\_local\_ipv4\_network\_cidr](#input\_vpn\_connection\_local\_ipv4\_network\_cidr) | The IPv4 CIDR on the customer gateway (on-premises) side of the VPN connection. | `string` | `"0.0.0.0/0"` | no |
| <a name="input_vpn_connection_log_retention_in_days"></a> [vpn\_connection\_log\_retention\_in\_days](#input\_vpn\_connection\_log\_retention\_in\_days) | Specifies the number of days you want to retain log events. | `number` | `30` | no |
| <a name="input_vpn_connection_remote_ipv4_network_cidr"></a> [vpn\_connection\_remote\_ipv4\_network\_cidr](#input\_vpn\_connection\_remote\_ipv4\_network\_cidr) | The IPv4 CIDR on the AWS side of the VPN connection. | `string` | `"0.0.0.0/0"` | no |
| <a name="input_vpn_connection_static_routes_destinations"></a> [vpn\_connection\_static\_routes\_destinations](#input\_vpn\_connection\_static\_routes\_destinations) | List of CIDR blocks to be used as destination for static routes. Routes to destinations will be propagated to the route tables defined in `route_table_ids` | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_static_routes_only"></a> [vpn\_connection\_static\_routes\_only](#input\_vpn\_connection\_static\_routes\_only) | If set to `true`, the VPN connection will use static routes exclusively. Static routes must be used for devices that don't support BGP | `bool` | `false` | no |
| <a name="input_vpn_connection_tunnel1_cloudwatch_log_enabled"></a> [vpn\_connection\_tunnel1\_cloudwatch\_log\_enabled](#input\_vpn\_connection\_tunnel1\_cloudwatch\_log\_enabled) | Enable or disable VPN tunnel logging feature for the tunnel | `bool` | `false` | no |
| <a name="input_vpn_connection_tunnel1_cloudwatch_log_output_format"></a> [vpn\_connection\_tunnel1\_cloudwatch\_log\_output\_format](#input\_vpn\_connection\_tunnel1\_cloudwatch\_log\_output\_format) | Set log format for the tunnel. Default format is json. Possible values are: json and text | `string` | `"json"` | no |
| <a name="input_vpn_connection_tunnel1_dpd_timeout_action"></a> [vpn\_connection\_tunnel1\_dpd\_timeout\_action](#input\_vpn\_connection\_tunnel1\_dpd\_timeout\_action) | The action to take after DPD timeout occurs for the first VPN tunnel. Specify restart to restart the IKE initiation. Specify clear to end the IKE session. Valid values are clear \| none \| restart. | `string` | `"clear"` | no |
| <a name="input_vpn_connection_tunnel1_ike_versions"></a> [vpn\_connection\_tunnel1\_ike\_versions](#input\_vpn\_connection\_tunnel1\_ike\_versions) | The IKE versions that are permitted for the first VPN tunnel. Valid values are ikev1 \| ikev2. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_inside_cidr"></a> [vpn\_connection\_tunnel1\_inside\_cidr](#input\_vpn\_connection\_tunnel1\_inside\_cidr) | The CIDR block of the inside IP addresses for the first VPN tunnel | `string` | `null` | no |
| <a name="input_vpn_connection_tunnel1_phase1_dh_group_numbers"></a> [vpn\_connection\_tunnel1\_phase1\_dh\_group\_numbers](#input\_vpn\_connection\_tunnel1\_phase1\_dh\_group\_numbers) | List of one or more Diffie-Hellman group numbers that are permitted for the first VPN tunnel for phase 1 IKE negotiations. Valid values are 2 \| 5 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_phase1_encryption_algorithms"></a> [vpn\_connection\_tunnel1\_phase1\_encryption\_algorithms](#input\_vpn\_connection\_tunnel1\_phase1\_encryption\_algorithms) | List of one or more encryption algorithms that are permitted for the first VPN tunnel for phase 1 IKE negotiations. Valid values are AES128 \| AES256 \| AES128-GCM-16 \| AES256-GCM-16. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_phase1_integrity_algorithms"></a> [vpn\_connection\_tunnel1\_phase1\_integrity\_algorithms](#input\_vpn\_connection\_tunnel1\_phase1\_integrity\_algorithms) | One or more integrity algorithms that are permitted for the first VPN tunnel for phase 1 IKE negotiations. Valid values are SHA1 \| SHA2-256 \| SHA2-384 \| SHA2-512. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_phase2_dh_group_numbers"></a> [vpn\_connection\_tunnel1\_phase2\_dh\_group\_numbers](#input\_vpn\_connection\_tunnel1\_phase2\_dh\_group\_numbers) | List of one or more Diffie-Hellman group numbers that are permitted for the first VPN tunnel for phase 2 IKE negotiations. Valid values are 2 \| 5 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_phase2_encryption_algorithms"></a> [vpn\_connection\_tunnel1\_phase2\_encryption\_algorithms](#input\_vpn\_connection\_tunnel1\_phase2\_encryption\_algorithms) | List of one or more encryption algorithms that are permitted for the first VPN tunnel for phase 2 IKE negotiations. Valid values are AES128 \| AES256 \| AES128-GCM-16 \| AES256-GCM-16. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_phase2_integrity_algorithms"></a> [vpn\_connection\_tunnel1\_phase2\_integrity\_algorithms](#input\_vpn\_connection\_tunnel1\_phase2\_integrity\_algorithms) | One or more integrity algorithms that are permitted for the first VPN tunnel for phase 2 IKE negotiations. Valid values are SHA1 \| SHA2-256 \| SHA2-384 \| SHA2-512. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel1_preshared_key"></a> [vpn\_connection\_tunnel1\_preshared\_key](#input\_vpn\_connection\_tunnel1\_preshared\_key) | The preshared key of the first VPN tunnel. The preshared key must be between 8 and 64 characters in length and cannot start with zero. Allowed characters are alphanumeric characters, periods(.) and underscores(\_) | `string` | `null` | no |
| <a name="input_vpn_connection_tunnel1_startup_action"></a> [vpn\_connection\_tunnel1\_startup\_action](#input\_vpn\_connection\_tunnel1\_startup\_action) | The action to take when the establishing the tunnel for the first VPN connection. By default, your customer gateway device must initiate the IKE negotiation and bring up the tunnel. Specify start for AWS to initiate the IKE negotiation. Valid values are add \| start. | `string` | `"add"` | no |
| <a name="input_vpn_connection_tunnel2_cloudwatch_log_enabled"></a> [vpn\_connection\_tunnel2\_cloudwatch\_log\_enabled](#input\_vpn\_connection\_tunnel2\_cloudwatch\_log\_enabled) | Enable or disable VPN tunnel logging feature for the tunnel | `bool` | `false` | no |
| <a name="input_vpn_connection_tunnel2_cloudwatch_log_output_format"></a> [vpn\_connection\_tunnel2\_cloudwatch\_log\_output\_format](#input\_vpn\_connection\_tunnel2\_cloudwatch\_log\_output\_format) | Set log format for the tunnel. Default format is json. Possible values are: json and text | `string` | `"json"` | no |
| <a name="input_vpn_connection_tunnel2_dpd_timeout_action"></a> [vpn\_connection\_tunnel2\_dpd\_timeout\_action](#input\_vpn\_connection\_tunnel2\_dpd\_timeout\_action) | The action to take after DPD timeout occurs for the second VPN tunnel. Specify restart to restart the IKE initiation. Specify clear to end the IKE session. Valid values are clear \| none \| restart. | `string` | `"clear"` | no |
| <a name="input_vpn_connection_tunnel2_ike_versions"></a> [vpn\_connection\_tunnel2\_ike\_versions](#input\_vpn\_connection\_tunnel2\_ike\_versions) | The IKE versions that are permitted for the second VPN tunnel. Valid values are ikev1 \| ikev2. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_inside_cidr"></a> [vpn\_connection\_tunnel2\_inside\_cidr](#input\_vpn\_connection\_tunnel2\_inside\_cidr) | The CIDR block of the inside IP addresses for the second VPN tunnel | `string` | `null` | no |
| <a name="input_vpn_connection_tunnel2_phase1_dh_group_numbers"></a> [vpn\_connection\_tunnel2\_phase1\_dh\_group\_numbers](#input\_vpn\_connection\_tunnel2\_phase1\_dh\_group\_numbers) | List of one or more Diffie-Hellman group numbers that are permitted for the second VPN tunnel for phase 1 IKE negotiations. Valid values are 2 \| 5 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_phase1_encryption_algorithms"></a> [vpn\_connection\_tunnel2\_phase1\_encryption\_algorithms](#input\_vpn\_connection\_tunnel2\_phase1\_encryption\_algorithms) | List of one or more encryption algorithms that are permitted for the second VPN tunnel for phase 1 IKE negotiations. Valid values are AES128 \| AES256 \| AES128-GCM-16 \| AES256-GCM-16. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_phase1_integrity_algorithms"></a> [vpn\_connection\_tunnel2\_phase1\_integrity\_algorithms](#input\_vpn\_connection\_tunnel2\_phase1\_integrity\_algorithms) | One or more integrity algorithms that are permitted for the second VPN tunnel for phase 1 IKE negotiations. Valid values are SHA1 \| SHA2-256 \| SHA2-384 \| SHA2-512. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_phase2_dh_group_numbers"></a> [vpn\_connection\_tunnel2\_phase2\_dh\_group\_numbers](#input\_vpn\_connection\_tunnel2\_phase2\_dh\_group\_numbers) | List of one or more Diffie-Hellman group numbers that are permitted for the second VPN tunnel for phase 2 IKE negotiations. Valid values are 2 \| 5 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_phase2_encryption_algorithms"></a> [vpn\_connection\_tunnel2\_phase2\_encryption\_algorithms](#input\_vpn\_connection\_tunnel2\_phase2\_encryption\_algorithms) | List of one or more encryption algorithms that are permitted for the second VPN tunnel for phase 2 IKE negotiations. Valid values are AES128 \| AES256 \| AES128-GCM-16 \| AES256-GCM-16. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_phase2_integrity_algorithms"></a> [vpn\_connection\_tunnel2\_phase2\_integrity\_algorithms](#input\_vpn\_connection\_tunnel2\_phase2\_integrity\_algorithms) | One or more integrity algorithms that are permitted for the second VPN tunnel for phase 2 IKE negotiations. Valid values are SHA1 \| SHA2-256 \| SHA2-384 \| SHA2-512. | `list(string)` | `[]` | no |
| <a name="input_vpn_connection_tunnel2_preshared_key"></a> [vpn\_connection\_tunnel2\_preshared\_key](#input\_vpn\_connection\_tunnel2\_preshared\_key) | The preshared key of the second VPN tunnel. The preshared key must be between 8 and 64 characters in length and cannot start with zero. Allowed characters are alphanumeric characters, periods(.) and underscores(\_) | `string` | `null` | no |
| <a name="input_vpn_connection_tunnel2_startup_action"></a> [vpn\_connection\_tunnel2\_startup\_action](#input\_vpn\_connection\_tunnel2\_startup\_action) | The action to take when the establishing the tunnel for the second VPN connection. By default, your customer gateway device must initiate the IKE negotiation and bring up the tunnel. Specify start for AWS to initiate the IKE negotiation. Valid values are add \| start. | `string` | `"add"` | no |
| <a name="input_vpn_gateway_amazon_side_asn"></a> [vpn\_gateway\_amazon\_side\_asn](#input\_vpn\_gateway\_amazon\_side\_asn) | The Autonomous System Number (ASN) for the Amazon side of the VPN gateway. If you don't specify an ASN, the Virtual Private Gateway is created with the default ASN | `number` | `64512` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_customer_gateway_id"></a> [customer\_gateway\_id](#output\_customer\_gateway\_id) | Customer Gateway ID |
| <a name="output_transit_gateway_attachment_id"></a> [transit\_gateway\_attachment\_id](#output\_transit\_gateway\_attachment\_id) | The ID of the transit gateway attachment for the VPN connection (if a TGW connection) |
| <a name="output_vpn_connection_customer_gateway_configuration"></a> [vpn\_connection\_customer\_gateway\_configuration](#output\_vpn\_connection\_customer\_gateway\_configuration) | The configuration information for the VPN connection's Customer Gateway (in the native XML format) |
| <a name="output_vpn_connection_id"></a> [vpn\_connection\_id](#output\_vpn\_connection\_id) | VPN Connection ID |
| <a name="output_vpn_connection_tunnel1_address"></a> [vpn\_connection\_tunnel1\_address](#output\_vpn\_connection\_tunnel1\_address) | The public IP address of the first VPN tunnel |
| <a name="output_vpn_connection_tunnel1_cgw_inside_address"></a> [vpn\_connection\_tunnel1\_cgw\_inside\_address](#output\_vpn\_connection\_tunnel1\_cgw\_inside\_address) | The RFC 6890 link-local address of the first VPN tunnel (Customer Gateway side) |
| <a name="output_vpn_connection_tunnel1_vgw_inside_address"></a> [vpn\_connection\_tunnel1\_vgw\_inside\_address](#output\_vpn\_connection\_tunnel1\_vgw\_inside\_address) | The RFC 6890 link-local address of the first VPN tunnel (Virtual Private Gateway side) |
| <a name="output_vpn_connection_tunnel2_address"></a> [vpn\_connection\_tunnel2\_address](#output\_vpn\_connection\_tunnel2\_address) | The public IP address of the second VPN tunnel |
| <a name="output_vpn_connection_tunnel2_cgw_inside_address"></a> [vpn\_connection\_tunnel2\_cgw\_inside\_address](#output\_vpn\_connection\_tunnel2\_cgw\_inside\_address) | The RFC 6890 link-local address of the second VPN tunnel (Customer Gateway side) |
| <a name="output_vpn_connection_tunnel2_vgw_inside_address"></a> [vpn\_connection\_tunnel2\_vgw\_inside\_address](#output\_vpn\_connection\_tunnel2\_vgw\_inside\_address) | The RFC 6890 link-local address of the second VPN tunnel (Virtual Private Gateway side) |
| <a name="output_vpn_gateway_id"></a> [vpn\_gateway\_id](#output\_vpn\_gateway\_id) | Virtual Private Gateway ID |
<!-- markdownlint-restore -->

