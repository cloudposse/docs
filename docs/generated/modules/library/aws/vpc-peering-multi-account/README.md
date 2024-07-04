---
title: vpc-peering-multi-account
sidebar_label: vpc-peering-multi-account
sidebar_class_name: command
description: |-
  Terraform module to create a peering connection between any two VPCs existing in different AWS accounts.

  This module supports performing this action from a 3rd account (e.g. a "root" account) by specifying the roles to assume for each member account.

  **IMPORTANT:** AWS allows a multi-account VPC Peering Connection to be deleted from either the requester's or accepter's side.
  However, Terraform only allows the VPC Peering Connection to be deleted from the requester's side by removing the corresponding `aws_vpc_peering_connection` resource from your configuration.
  [Read more about this](https://www.terraform.io/docs/providers/aws/r/vpc_peering_accepter.html) on Terraform's documentation portal.
tags:
  - aws
  - terraform
  - terraform-modules
  - platform
  - vpc
  - peering
  - vpc-peering
  - vpn
  - multi-account
  - multi-provider

custom_edit_url: https://github.com/cloudposse/terraform-aws-vpc-peering-multi-account/blob/main/README.yaml
---

# Module: `vpc-peering-multi-account`
Terraform module to create a peering connection between any two VPCs existing in different AWS accounts.

This module supports performing this action from a 3rd account (e.g. a "root" account) by specifying the roles to assume for each member account.

**IMPORTANT:** AWS allows a multi-account VPC Peering Connection to be deleted from either the requester's or accepter's side.
However, Terraform only allows the VPC Peering Connection to be deleted from the requester's side by removing the corresponding `aws_vpc_peering_connection` resource from your configuration.
[Read more about this](https://www.terraform.io/docs/providers/aws/r/vpc_peering_accepter.html) on Terraform's documentation portal.


## Screenshots


![terraform-aws-vpc-peering-multi-account](images/vpc-peering.png)
*VPC Peering Connection in the AWS Web Console*




## Usage


**IMPORTANT:** Do not pin to `master` because there may be breaking changes between releases. Instead pin to the release tag (e.g. `?ref=tags/x.y.z`) of one of our [latest releases](https://github.com/cloudposse/terraform-aws-vpc-peering-multi-account/releases).

For a complete example, see [examples/complete](https://github.com/cloudposse/terraform-aws-vpc-peering-multi-account/tree/main/examples/complete)

```hcl
module "vpc_peering_cross_account" {
  source = "cloudposse/vpc-peering-multi-account/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  namespace        = "eg"
  stage            = "dev"
  name             = "cluster"

  requester_aws_assume_role_arn             = "arn:aws:iam::XXXXXXXX:role/cross-account-vpc-peering-test"
  requester_region                          = "us-west-2"
  requester_vpc_id                          = "vpc-xxxxxxxx"
  requester_allow_remote_vpc_dns_resolution = true

  accepter_aws_assume_role_arn             = "arn:aws:iam::YYYYYYYY:role/cross-account-vpc-peering-test"
  accepter_region                          = "us-east-1"
  accepter_vpc_id                          = "vpc-yyyyyyyy"
  accepter_allow_remote_vpc_dns_resolution = true
}
```

The `arn:aws:iam::XXXXXXXX:role/cross-account-vpc-peering-test` requester IAM Role should have the following Trust Policy:

<details><summary>Show Trust Policy</summary>

```js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::XXXXXXXX:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {}
    }
  ]
}
```

</details>
<br/>

and the following IAM Policy attached to it:

__NOTE:__ the policy specifies the permissions to create (with `terraform plan/apply`) and delete (with `terraform destroy`) all the required resources in the requester AWS account

<details><summary>Show IAM Policy</summary>

```js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateRoute",
        "ec2:DeleteRoute"
      ],
      "Resource": "arn:aws:ec2:*:XXXXXXXX:route-table/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVpcPeeringConnections",
        "ec2:DescribeVpcs",
        "ec2:ModifyVpcPeeringConnectionOptions",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeRouteTables"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AcceptVpcPeeringConnection",
        "ec2:DeleteVpcPeeringConnection",
        "ec2:CreateVpcPeeringConnection",
        "ec2:RejectVpcPeeringConnection"
      ],
      "Resource": [
        "arn:aws:ec2:*:XXXXXXXX:vpc-peering-connection/*",
        "arn:aws:ec2:*:XXXXXXXX:vpc/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DeleteTags",
        "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:*:XXXXXXXX:vpc-peering-connection/*"
    }
  ]
}
```

</details>

where `XXXXXXXX` is the requester AWS account ID.

<br/>

The `arn:aws:iam::YYYYYYYY:role/cross-account-vpc-peering-test` accepter IAM Role should have the following Trust Policy:

<details><summary>Show Trust Policy</summary>

```js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::XXXXXXXX:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {}
    }
  ]
}
```

</details>

__NOTE__: The accepter Trust Policy is the same as the requester Trust Policy since it defines who can assume the IAM Role.
In the requester case, the requester account ID itself is the trusted entity.
For the accepter, the Trust Policy specifies that the requester account ID `XXXXXXXX` can assume the role in the accepter AWS account `YYYYYYYY`.

and the following IAM Policy attached to it:

__NOTE:__ the policy specifies the permissions to create (with `terraform plan/apply`) and delete (with `terraform destroy`) all the required resources in the accepter AWS account

<details><summary>Show IAM Policy</summary>

```js
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateRoute",
        "ec2:DeleteRoute"
      ],
      "Resource": "arn:aws:ec2:*:YYYYYYYY:route-table/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVpcPeeringConnections",
        "ec2:DescribeVpcs",
        "ec2:ModifyVpcPeeringConnectionOptions",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeRouteTables"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AcceptVpcPeeringConnection",
        "ec2:DeleteVpcPeeringConnection",
        "ec2:CreateVpcPeeringConnection",
        "ec2:RejectVpcPeeringConnection"
      ],
      "Resource": [
        "arn:aws:ec2:*:YYYYYYYY:vpc-peering-connection/*",
        "arn:aws:ec2:*:YYYYYYYY:vpc/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DeleteTags",
        "ec2:CreateTags"
      ],
      "Resource": "arn:aws:ec2:*:YYYYYYYY:vpc-peering-connection/*"
    }
  ]
}
```

</details>

where `YYYYYYYY` is the accepter AWS account ID.

For more information on IAM policies and permissions for VPC peering, see [Creating and managing VPC peering connections](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_IAM.html#vpcpeeringiam).






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws.accepter"></a> [aws.accepter](#provider\_aws.accepter) | >= 2.0 |
| <a name="provider_aws.requester"></a> [aws.requester](#provider\_aws.requester) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_accepter"></a> [accepter](#module\_accepter) | cloudposse/label/null | 0.25.0 |
| <a name="module_requester"></a> [requester](#module\_requester) | cloudposse/label/null | 0.25.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_route.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_route.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route) | resource |
| [aws_vpc_peering_connection.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_peering_connection) | resource |
| [aws_vpc_peering_connection_accepter.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_peering_connection_accepter) | resource |
| [aws_vpc_peering_connection_options.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_peering_connection_options) | resource |
| [aws_vpc_peering_connection_options.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc_peering_connection_options) | resource |
| [aws_caller_identity.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_caller_identity.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_region.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |
| [aws_region.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |
| [aws_route_table.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route_table) | data source |
| [aws_route_tables.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route_tables) | data source |
| [aws_route_tables.default_rts](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/route_tables) | data source |
| [aws_subnets.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnets) | data source |
| [aws_subnets.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/subnets) | data source |
| [aws_vpc.accepter](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |
| [aws_vpc.requester](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/vpc) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_accepter_allow_remote_vpc_dns_resolution"></a> [accepter\_allow\_remote\_vpc\_dns\_resolution](#input\_accepter\_allow\_remote\_vpc\_dns\_resolution) | Allow accepter VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the requester VPC | `bool` | `true` | no |
| <a name="input_accepter_aws_access_key"></a> [accepter\_aws\_access\_key](#input\_accepter\_aws\_access\_key) | Access key id to use in accepter account | `string` | `null` | no |
| <a name="input_accepter_aws_assume_role_arn"></a> [accepter\_aws\_assume\_role\_arn](#input\_accepter\_aws\_assume\_role\_arn) | Accepter AWS Assume Role ARN | `string` | `null` | no |
| <a name="input_accepter_aws_profile"></a> [accepter\_aws\_profile](#input\_accepter\_aws\_profile) | Profile used to assume accepter\_aws\_assume\_role\_arn | `string` | `""` | no |
| <a name="input_accepter_aws_secret_key"></a> [accepter\_aws\_secret\_key](#input\_accepter\_aws\_secret\_key) | Secret access key to use in accepter account | `string` | `null` | no |
| <a name="input_accepter_aws_token"></a> [accepter\_aws\_token](#input\_accepter\_aws\_token) | Session token for validating temporary credentials | `string` | `null` | no |
| <a name="input_accepter_enabled"></a> [accepter\_enabled](#input\_accepter\_enabled) | Flag to enable/disable the accepter side of the peering connection | `bool` | `true` | no |
| <a name="input_accepter_region"></a> [accepter\_region](#input\_accepter\_region) | Accepter AWS region | `string` | n/a | yes |
| <a name="input_accepter_subnet_tags"></a> [accepter\_subnet\_tags](#input\_accepter\_subnet\_tags) | Only add peer routes to accepter VPC route tables of subnets matching these tags | `map(string)` | `{}` | no |
| <a name="input_accepter_vpc_id"></a> [accepter\_vpc\_id](#input\_accepter\_vpc\_id) | Accepter VPC ID filter | `string` | `""` | no |
| <a name="input_accepter_vpc_tags"></a> [accepter\_vpc\_tags](#input\_accepter\_vpc\_tags) | Accepter VPC Tags filter | `map(string)` | `{}` | no |
| <a name="input_add_attribute_tag"></a> [add\_attribute\_tag](#input\_add\_attribute\_tag) | If `true` will add additional attribute tag to the requester and accceptor resources | `bool` | `true` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_auto_accept"></a> [auto\_accept](#input\_auto\_accept) | Automatically accept the peering | `bool` | `true` | no |
| <a name="input_aws_route_create_timeout"></a> [aws\_route\_create\_timeout](#input\_aws\_route\_create\_timeout) | Time to wait for AWS route creation specifed as a Go Duration, e.g. `2m` | `string` | `"5m"` | no |
| <a name="input_aws_route_delete_timeout"></a> [aws\_route\_delete\_timeout](#input\_aws\_route\_delete\_timeout) | Time to wait for AWS route deletion specifed as a Go Duration, e.g. `5m` | `string` | `"5m"` | no |
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
| <a name="input_requester_allow_remote_vpc_dns_resolution"></a> [requester\_allow\_remote\_vpc\_dns\_resolution](#input\_requester\_allow\_remote\_vpc\_dns\_resolution) | Allow requester VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the accepter VPC | `bool` | `true` | no |
| <a name="input_requester_aws_access_key"></a> [requester\_aws\_access\_key](#input\_requester\_aws\_access\_key) | Access key id to use in requester account | `string` | `null` | no |
| <a name="input_requester_aws_assume_role_arn"></a> [requester\_aws\_assume\_role\_arn](#input\_requester\_aws\_assume\_role\_arn) | Requester AWS Assume Role ARN | `string` | n/a | yes |
| <a name="input_requester_aws_profile"></a> [requester\_aws\_profile](#input\_requester\_aws\_profile) | Profile used to assume requester\_aws\_assume\_role\_arn | `string` | `""` | no |
| <a name="input_requester_aws_secret_key"></a> [requester\_aws\_secret\_key](#input\_requester\_aws\_secret\_key) | Secret access key to use in requester account | `string` | `null` | no |
| <a name="input_requester_aws_token"></a> [requester\_aws\_token](#input\_requester\_aws\_token) | Session token for validating temporary credentials | `string` | `null` | no |
| <a name="input_requester_region"></a> [requester\_region](#input\_requester\_region) | Requester AWS region | `string` | n/a | yes |
| <a name="input_requester_subnet_tags"></a> [requester\_subnet\_tags](#input\_requester\_subnet\_tags) | Only add peer routes to requester VPC route tables of subnets matching these tags | `map(string)` | `{}` | no |
| <a name="input_requester_vpc_id"></a> [requester\_vpc\_id](#input\_requester\_vpc\_id) | Requester VPC ID filter | `string` | `""` | no |
| <a name="input_requester_vpc_tags"></a> [requester\_vpc\_tags](#input\_requester\_vpc\_tags) | Requester VPC Tags filter | `map(string)` | `{}` | no |
| <a name="input_skip_metadata_api_check"></a> [skip\_metadata\_api\_check](#input\_skip\_metadata\_api\_check) | Don't use the credentials of EC2 instance profile | `bool` | `false` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_accepter_accept_status"></a> [accepter\_accept\_status](#output\_accepter\_accept\_status) | Accepter VPC peering connection request status |
| <a name="output_accepter_connection_id"></a> [accepter\_connection\_id](#output\_accepter\_connection\_id) | Accepter VPC peering connection ID |
| <a name="output_accepter_subnet_route_table_map"></a> [accepter\_subnet\_route\_table\_map](#output\_accepter\_subnet\_route\_table\_map) | Map of accepter VPC subnet IDs to route table IDs |
| <a name="output_requester_accept_status"></a> [requester\_accept\_status](#output\_requester\_accept\_status) | Requester VPC peering connection request status |
| <a name="output_requester_connection_id"></a> [requester\_connection\_id](#output\_requester\_connection\_id) | Requester VPC peering connection ID |
<!-- markdownlint-restore -->
