---
title: named-subnets
sidebar_label: named-subnets
sidebar_class_name: command
description: |-
  Terraform module for named [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html) provisioning.
tags:
  - aws
  - terraform
  - terraform-modules
  - networking
  - named-subnets
  - availability-zone
  - subnet
  - vpc
  - cidr
  - dynamic

custom_edit_url: https://github.com/cloudposse/terraform-aws-named-subnets/blob/main/README.yaml
---

# Module: `named-subnets`
Terraform module for named [`subnets`](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html) provisioning.






## Usage


Simple example, with private and public subnets in one Availability Zone:

```hcl
module "vpc" {
  source = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace  = "eg"
  name       = "vpc"
  stage      = "dev"
  cidr_block = var.cidr_block
}

locals {
  public_cidr_block  = cidrsubnet(module.vpc.vpc_cidr_block, 1, 0)
  private_cidr_block = cidrsubnet(module.vpc.vpc_cidr_block, 1, 1)
}

module "public_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["web1", "web2", "web3"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.public_cidr_block
  type              = "public"
  igw_id            = module.vpc.igw_id
  availability_zone = "us-east-1a"
}

module "private_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "database"
  subnet_names      = ["kafka", "cassandra", "zookeeper"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.private_cidr_block
  type              = "private"
  availability_zone = "us-east-1a"
  ngw_id            = module.public_subnets.ngw_id
}
```

Simple example, with `ENI` as default route gateway for private subnets

```hcl
resource "aws_network_interface" "default" {
  subnet_id         = module.us_east_1b_public_subnets.subnet_ids[0]
  source_dest_check = false
  tags              = module.network_interface_label.id
}

module "us_east_1b_private_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.us_east_1b_private_cidr_block
  type              = "private"
  availability_zone = "us-east-1b"
  eni_id            = aws_network_interface.default.id
  attributes        = ["us-east-1b"]
}
```

Full example, with private and public subnets in two Availability Zones for High Availability:

```hcl
module "vpc" {
  source = "cloudposse/vpc/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace  = "eg"
  name       = "vpc"
  stage      = "dev"
  cidr_block = var.cidr_block
}

locals {
  us_east_1a_public_cidr_block  = cidrsubnet(module.vpc.vpc_cidr_block, 2, 0)
  us_east_1a_private_cidr_block = cidrsubnet(module.vpc.vpc_cidr_block, 2, 1)
  us_east_1b_public_cidr_block  = cidrsubnet(module.vpc.vpc_cidr_block, 2, 2)
  us_east_1b_private_cidr_block = cidrsubnet(module.vpc.vpc_cidr_block, 2, 3)
}

module "us_east_1a_public_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["apples", "oranges", "grapes"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.us_east_1a_public_cidr_block
  type              = "public"
  igw_id            = module.vpc.igw_id
  availability_zone = "us-east-1a"
  attributes        = ["us-east-1a"]
}

module "us_east_1a_private_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.us_east_1a_private_cidr_block
  type              = "private"
  availability_zone = "us-east-1a"
  ngw_id            = module.us_east_1a_public_subnets.ngw_id
  attributes        = ["us-east-1a"]
}

module "us_east_1b_public_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["apples", "oranges", "grapes"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.us_east_1b_public_cidr_block
  type              = "public"
  igw_id            = module.vpc.igw_id
  availability_zone = "us-east-1b"
  attributes        = ["us-east-1b"]
}

module "us_east_1b_private_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.us_east_1b_private_cidr_block
  type              = "private"
  availability_zone = "us-east-1b"
  ngw_id            = module.us_east_1b_public_subnets.ngw_id
  attributes        = ["us-east-1b"]
}

resource "aws_network_interface" "default" {
  subnet_id         = module.us_east_1b_public_subnets.subnet_ids[0]
  source_dest_check = false
  tags              = module.network_interface_label.id
}

module "us_east_1b_private_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["charlie", "echo", "bravo"]
  vpc_id            = module.vpc.vpc_id
  cidr_block        = local.us_east_1b_private_cidr_block
  type              = "private"
  availability_zone = "us-east-1b"
  eni_id            = aws_network_interface.default.id
  attributes        = ["us-east-1b"]
}
```

## Caveat
You must use only one type of device for a default route gateway per route table. `ENI` or `NGW`

Given the following configuration (see the Simple example above)

```hcl
locals {
  public_cidr_block  = cidrsubnet(var.vpc_cidr, 1, 0)
  private_cidr_block = cidrsubnet(var.vpc_cidr, 1, 1)
}

module "public_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "app"
  subnet_names      = ["web1", "web2", "web3"]
  vpc_id            = var.vpc_id
  cidr_block        = local.public_cidr_block
  type              = "public"
  availability_zone = "us-east-1a"
  igw_id            = var.igw_id
}

module "private_subnets" {
  source = "cloudposse/named-subnets/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"
  namespace         = "eg"
  stage             = "dev"
  name              = "database"
  subnet_names      = ["kafka", "cassandra", "zookeeper"]
  vpc_id            = var.vpc_id
  cidr_block        = local.private_cidr_block
  type              = "private"
  availability_zone = "us-east-1a"
  ngw_id            = module.public_subnets.ngw_id
}

output "private_named_subnet_ids" {
  value = module.private_subnets.named_subnet_ids
}

output "public_named_subnet_ids" {
  value = module.public_subnets.named_subnet_ids
}
```

the output Maps of subnet names to subnet IDs look like these

```hcl
public_named_subnet_ids = {
  web1 = subnet-ea58d78e
  web2 = subnet-556ee131
  web3 = subnet-6f54db0b
}
private_named_subnet_ids = {
  cassandra = subnet-376de253
  kafka = subnet-9e53dcfa
  zookeeper = subnet-a86fe0cc
}
```

and the created subnet IDs could be found by the subnet names using `map["key"]` or [`lookup(map, key, [default])`](https://www.terraform.io/docs/configuration/interpolation.html#lookup-map-key-default-),

for example:

`public_named_subnet_ids["web1"]`

`lookup(private_named_subnet_ids, "kafka")`






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.13.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_private_label"></a> [private\_label](#module\_private\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_public_label"></a> [public\_label](#module\_public\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_eip.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip) | resource |
| [aws_nat_gateway.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway) | resource |
| [aws_network_acl.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/network_acl) | resource |
| [aws_network_acl.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/network_acl) | resource |
| [aws_route.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route_table.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table) | resource |
| [aws_route_table.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table) | resource |
| [aws_route_table_association.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association) | resource |
| [aws_route_table_association.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association) | resource |
| [aws_subnet.private](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet) | resource |
| [aws_subnet.public](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet) | resource |
| [aws_vpc.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_availability_zone"></a> [availability\_zone](#input\_availability\_zone) | Availability Zone | `string` | n/a | yes |
| <a name="input_cidr_block"></a> [cidr\_block](#input\_cidr\_block) | Base CIDR block which will be divided into subnet CIDR blocks (e.g. `10.0.0.0/16`) | `string` | n/a | yes |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_eni_id"></a> [eni\_id](#input\_eni\_id) | An ID of a network interface which is used as a default route in private route tables (\_e.g.\_ `eni-9c26a123`).  Conflicts with `ngw_id`. | `string` | `""` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_igw_id"></a> [igw\_id](#input\_igw\_id) | Internet Gateway ID which will be used as a default route in public route tables (e.g. `igw-9c26a123`). | `string` | `""` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_map_public_ip_on_launch_enabled"></a> [map\_public\_ip\_on\_launch\_enabled](#input\_map\_public\_ip\_on\_launch\_enabled) | Enable/disable map\_public\_ip\_on\_launch subnet attribute. | `bool` | `false` | no |
| <a name="input_max_subnets"></a> [max\_subnets](#input\_max\_subnets) | Maximum number of subnets which can be created. This variable is being used for CIDR blocks calculation. Defaults to length of `subnet_names` argument | `number` | `16` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_nat_enabled"></a> [nat\_enabled](#input\_nat\_enabled) | Enable/disable NAT Gateway | `bool` | `true` | no |
| <a name="input_ngw_id"></a> [ngw\_id](#input\_ngw\_id) | NAT Gateway ID which will be used as a default route in private route tables (e.g. `igw-9c26a123`). Conflicts with `eni_id`. | `string` | `""` | no |
| <a name="input_private_network_acl_egress"></a> [private\_network\_acl\_egress](#input\_private\_network\_acl\_egress) | Private network egress ACL rules | <pre>list(object(<br/>    {<br/>      rule_no    = number<br/>      action     = string<br/>      cidr_block = string<br/>      from_port  = number<br/>      to_port    = number<br/>      protocol   = string<br/>  }))</pre> | <pre>[<br/>  {<br/>    "action": "allow",<br/>    "cidr_block": "0.0.0.0/0",<br/>    "from_port": 0,<br/>    "protocol": "-1",<br/>    "rule_no": 100,<br/>    "to_port": 0<br/>  }<br/>]</pre> | no |
| <a name="input_private_network_acl_id"></a> [private\_network\_acl\_id](#input\_private\_network\_acl\_id) | Network ACL ID that will be added to the subnets. If empty, a new ACL will be created | `string` | `""` | no |
| <a name="input_private_network_acl_ingress"></a> [private\_network\_acl\_ingress](#input\_private\_network\_acl\_ingress) | Private network ingress ACL rules | <pre>list(object(<br/>    {<br/>      rule_no    = number<br/>      action     = string<br/>      cidr_block = string<br/>      from_port  = number<br/>      to_port    = number<br/>      protocol   = string<br/>  }))</pre> | <pre>[<br/>  {<br/>    "action": "allow",<br/>    "cidr_block": "0.0.0.0/0",<br/>    "from_port": 0,<br/>    "protocol": "-1",<br/>    "rule_no": 100,<br/>    "to_port": 0<br/>  }<br/>]</pre> | no |
| <a name="input_public_network_acl_egress"></a> [public\_network\_acl\_egress](#input\_public\_network\_acl\_egress) | Public network egress ACL rules | <pre>list(object(<br/>    {<br/>      rule_no    = number<br/>      action     = string<br/>      cidr_block = string<br/>      from_port  = number<br/>      to_port    = number<br/>      protocol   = string<br/>  }))</pre> | <pre>[<br/>  {<br/>    "action": "allow",<br/>    "cidr_block": "0.0.0.0/0",<br/>    "from_port": 0,<br/>    "protocol": "-1",<br/>    "rule_no": 100,<br/>    "to_port": 0<br/>  }<br/>]</pre> | no |
| <a name="input_public_network_acl_id"></a> [public\_network\_acl\_id](#input\_public\_network\_acl\_id) | Network ACL ID that will be added to the subnets. If empty, a new ACL will be created | `string` | `""` | no |
| <a name="input_public_network_acl_ingress"></a> [public\_network\_acl\_ingress](#input\_public\_network\_acl\_ingress) | Public network ingress ACL rules | <pre>list(object(<br/>    {<br/>      rule_no    = number<br/>      action     = string<br/>      cidr_block = string<br/>      from_port  = number<br/>      to_port    = number<br/>      protocol   = string<br/>  }))</pre> | <pre>[<br/>  {<br/>    "action": "allow",<br/>    "cidr_block": "0.0.0.0/0",<br/>    "from_port": 0,<br/>    "protocol": "-1",<br/>    "rule_no": 100,<br/>    "to_port": 0<br/>  }<br/>]</pre> | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_subnet_names"></a> [subnet\_names](#input\_subnet\_names) | List of subnet names (e.g. `['apples', 'oranges', 'grapes']`) | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_type"></a> [type](#input\_type) | Type of subnets (`private` or `public`) | `string` | `"private"` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | VPC ID | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_named_subnet_ids"></a> [named\_subnet\_ids](#output\_named\_subnet\_ids) | Map of subnet names to subnet IDs |
| <a name="output_ngw_id"></a> [ngw\_id](#output\_ngw\_id) | NAT Gateway ID |
| <a name="output_ngw_private_ip"></a> [ngw\_private\_ip](#output\_ngw\_private\_ip) | Private IP address of the NAT Gateway |
| <a name="output_ngw_public_ip"></a> [ngw\_public\_ip](#output\_ngw\_public\_ip) | Public IP address of the NAT Gateway |
| <a name="output_route_table_ids"></a> [route\_table\_ids](#output\_route\_table\_ids) | Route table IDs |
| <a name="output_subnet_ids"></a> [subnet\_ids](#output\_subnet\_ids) | Subnet IDs |
<!-- markdownlint-restore -->

