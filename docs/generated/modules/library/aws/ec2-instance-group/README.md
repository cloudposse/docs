---
title: ec2-instance-group
sidebar_label: ec2-instance-group
sidebar_class_name: command
description: |-
  Terraform Module for providing N general purpose EC2 hosts.

  If you only need to provision a single EC2 instance, consider using the [terraform-aws-ec2-instance](https://github.com/cloudposse/terraform-aws-ec2-instance) module instead.

  **IMPORTANT** This module by-design does not provision an AutoScaling group. It was designed to provision a discrete number of instances suitable for running stateful services such as databases (e.g. Kafka, Redis, etc).


  Included features:
  * Automatically create a Security Group
  * Option to switch EIP attachment
  * CloudWatch monitoring and automatic reboot if instance hangs
  * Assume Role capability
custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-instance-group/blob/main/README.yaml
---

# Module: `ec2-instance-group`
Terraform Module for providing N general purpose EC2 hosts.

If you only need to provision a single EC2 instance, consider using the [terraform-aws-ec2-instance](https://github.com/cloudposse/terraform-aws-ec2-instance) module instead.

**IMPORTANT** This module by-design does not provision an AutoScaling group. It was designed to provision a discrete number of instances suitable for running stateful services such as databases (e.g. Kafka, Redis, etc).


Included features:
* Automatically create a Security Group
* Option to switch EIP attachment
* CloudWatch monitoring and automatic reboot if instance hangs
* Assume Role capability






## Usage

Note: add `${var.ssh_key_pair}` private key to the `ssh agent`.

Include this repository as a module in your existing terraform code.


### Simple example:

```hcl
module "instance" {
  source = "cloudposse/ec2-instance-group/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"
  namespace                   = "eg"
  stage                       = "prod"
  name                        = "app"
  ami                         = "ami-a4dc46db"
  ami_owner                   = "099720109477"
  ssh_key_pair                = var.ssh_key_pair
  instance_type               = var.instance_type
  vpc_id                      = var.vpc_id
  security_groups             = var.security_groups
  subnet                      = var.subnet
  instance_count              = 3
}
```

### Example with additional volumes and EIP

```hcl
module "kafka_instance" {
  source = "cloudposse/ec2-instance-group/aws"
  # Cloud Posse recommends pinning every module to a specific version
  # version = "x.x.x"

  namespace                   = "eg"
  stage                       = "prod"
  name                        = "app"
  ami                         = "ami-a4dc46db"
  ami_owner                   = "099720109477"
  ssh_key_pair                = var.ssh_key_pair
  vpc_id                      = var.vpc_id
  security_groups             = var.security_groups
  subnet                      = var.subnet
  associate_public_ip_address = true
  additional_ips_count        = 1
  ebs_volume_count            = 2
  instance_count              = 3

  security_group_rules = [
    {
      type        = "egress"
      from_port   = 0
      to_port     = 65535
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      type        = "ingress"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      type        = "ingress"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      type        = "ingress"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}
```

### Additional complete working example with variations of how to use the module
In /examples directory

This module depends on these modules:

* [terraform-terraform-label](https://github.com/cloudposse/terraform-terraform-label)

It is necessary to run `terraform get` or `terraform init` to download this module.

Now reference the label when creating an instance (for example):

```hcl
resource "aws_ami_from_instance" "example" {
  count              = length(module.instance.*.id)
  name               = "app"
  source_instance_id = element(module.instance.*.id, count.index)
}
```






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 2.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_label"></a> [label](#module\_label) | cloudposse/label/null | 0.25.0 |
| <a name="module_security_group"></a> [security\_group](#module\_security\_group) | cloudposse/security-group/aws | 2.2.0 |
| <a name="module_ssh_key_pair"></a> [ssh\_key\_pair](#module\_ssh\_key\_pair) | cloudposse/key-pair/aws | 0.19.0 |
| <a name="module_this"></a> [this](#module\_this) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_cloudwatch_metric_alarm.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_ebs_volume.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ebs_volume) | resource |
| [aws_eip.additional](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip) | resource |
| [aws_eip.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip) | resource |
| [aws_iam_instance_profile.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_instance_profile) | resource |
| [aws_iam_role.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_instance.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance) | resource |
| [aws_network_interface.additional](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/network_interface) | resource |
| [aws_network_interface_attachment.additional](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/network_interface_attachment) | resource |
| [aws_volume_attachment.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/volume_attachment) | resource |
| [aws_ami.info](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami) | data source |
| [aws_caller_identity.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_additional_ips_count"></a> [additional\_ips\_count](#input\_additional\_ips\_count) | Count of additional EIPs | `number` | `0` | no |
| <a name="input_additional_tag_map"></a> [additional\_tag\_map](#input\_additional\_tag\_map) | Additional key-value pairs to add to each map in `tags_as_list_of_maps`. Not added to `tags` or `id`.<br/>This is for some rare cases where resources want additional configuration of tags<br/>and therefore take a list of maps with tag key, value, and additional configuration. | `map(string)` | `{}` | no |
| <a name="input_ami"></a> [ami](#input\_ami) | The AMI to use for the instance | `string` | n/a | yes |
| <a name="input_ami_owner"></a> [ami\_owner](#input\_ami\_owner) | Owner of the given AMI | `string` | n/a | yes |
| <a name="input_applying_period"></a> [applying\_period](#input\_applying\_period) | The period in seconds over which the specified statistic is applied | `number` | `60` | no |
| <a name="input_assign_eip_address"></a> [assign\_eip\_address](#input\_assign\_eip\_address) | Assign an Elastic IP address to the instance | `bool` | `true` | no |
| <a name="input_associate_public_ip_address"></a> [associate\_public\_ip\_address](#input\_associate\_public\_ip\_address) | Associate a public IP address with the instance | `bool` | `false` | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | ID element. Additional attributes (e.g. `workers` or `cluster`) to add to `id`,<br/>in the order they appear in the list. New attributes are appended to the<br/>end of the list. The elements of the list are joined by the `delimiter`<br/>and treated as a single ID element. | `list(string)` | `[]` | no |
| <a name="input_availability_zone"></a> [availability\_zone](#input\_availability\_zone) | Availability Zone the instance is launched in. If not set, will be launched in the first AZ of the region | `string` | `""` | no |
| <a name="input_comparison_operator"></a> [comparison\_operator](#input\_comparison\_operator) | The arithmetic operation to use when comparing the specified Statistic and Threshold. Possible values are: GreaterThanOrEqualToThreshold, GreaterThanThreshold, LessThanThreshold, LessThanOrEqualToThreshold | `string` | `"GreaterThanOrEqualToThreshold"` | no |
| <a name="input_context"></a> [context](#input\_context) | Single object for setting entire context at once.<br/>See description of individual variables for details.<br/>Leave string and numeric variables as `null` to use default value.<br/>Individual variable settings (non-null) override settings in context object,<br/>except for attributes, tags, and additional\_tag\_map, which are merged. | `any` | <pre>{<br/>  "additional_tag_map": {},<br/>  "attributes": [],<br/>  "delimiter": null,<br/>  "descriptor_formats": {},<br/>  "enabled": true,<br/>  "environment": null,<br/>  "id_length_limit": null,<br/>  "label_key_case": null,<br/>  "label_order": [],<br/>  "label_value_case": null,<br/>  "labels_as_tags": [<br/>    "unset"<br/>  ],<br/>  "name": null,<br/>  "namespace": null,<br/>  "regex_replace_chars": null,<br/>  "stage": null,<br/>  "tags": {},<br/>  "tenant": null<br/>}</pre> | no |
| <a name="input_default_alarm_action"></a> [default\_alarm\_action](#input\_default\_alarm\_action) | Default alarm action | `string` | `"action/actions/AWS_EC2.InstanceId.Reboot/1.0"` | no |
| <a name="input_delete_on_termination"></a> [delete\_on\_termination](#input\_delete\_on\_termination) | Whether the volume should be destroyed on instance termination | `bool` | `true` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between ID elements.<br/>Defaults to `-` (hyphen). Set to `""` to use no delimiter at all. | `string` | `null` | no |
| <a name="input_descriptor_formats"></a> [descriptor\_formats](#input\_descriptor\_formats) | Describe additional descriptors to be output in the `descriptors` output map.<br/>Map of maps. Keys are names of descriptors. Values are maps of the form<br/>`{<br/>   format = string<br/>   labels = list(string)<br/>}`<br/>(Type is `any` so the map values can later be enhanced to provide additional options.)<br/>`format` is a Terraform format string to be passed to the `format()` function.<br/>`labels` is a list of labels, in order, to pass to `format()` function.<br/>Label values will be normalized before being passed to `format()` so they will be<br/>identical to how they appear in `id`.<br/>Default is `{}` (`descriptors` output will be empty). | `any` | `{}` | no |
| <a name="input_disable_api_termination"></a> [disable\_api\_termination](#input\_disable\_api\_termination) | Enable EC2 Instance Termination Protection | `bool` | `false` | no |
| <a name="input_ebs_device_names"></a> [ebs\_device\_names](#input\_ebs\_device\_names) | Name of the EBS device to mount | `list(string)` | <pre>[<br/>  "/dev/xvdb",<br/>  "/dev/xvdc",<br/>  "/dev/xvdd",<br/>  "/dev/xvde",<br/>  "/dev/xvdf",<br/>  "/dev/xvdg",<br/>  "/dev/xvdh",<br/>  "/dev/xvdi",<br/>  "/dev/xvdj",<br/>  "/dev/xvdk",<br/>  "/dev/xvdl",<br/>  "/dev/xvdm",<br/>  "/dev/xvdn",<br/>  "/dev/xvdo",<br/>  "/dev/xvdp",<br/>  "/dev/xvdq",<br/>  "/dev/xvdr",<br/>  "/dev/xvds",<br/>  "/dev/xvdt",<br/>  "/dev/xvdu",<br/>  "/dev/xvdv",<br/>  "/dev/xvdw",<br/>  "/dev/xvdx",<br/>  "/dev/xvdy",<br/>  "/dev/xvdz"<br/>]</pre> | no |
| <a name="input_ebs_iops"></a> [ebs\_iops](#input\_ebs\_iops) | Amount of provisioned IOPS. This must be set with a volume\_type of io1 | `number` | `0` | no |
| <a name="input_ebs_optimized"></a> [ebs\_optimized](#input\_ebs\_optimized) | Launched EC2 instance will be EBS-optimized | `bool` | `false` | no |
| <a name="input_ebs_volume_count"></a> [ebs\_volume\_count](#input\_ebs\_volume\_count) | Count of EBS volumes that will be attached to the instance | `number` | `0` | no |
| <a name="input_ebs_volume_encrypted"></a> [ebs\_volume\_encrypted](#input\_ebs\_volume\_encrypted) | Size of the EBS volume in gigabytes | `bool` | `true` | no |
| <a name="input_ebs_volume_size"></a> [ebs\_volume\_size](#input\_ebs\_volume\_size) | Size of the EBS volume in gigabytes | `number` | `10` | no |
| <a name="input_ebs_volume_type"></a> [ebs\_volume\_type](#input\_ebs\_volume\_type) | The type of EBS volume. Can be standard, gp2 or io1 | `string` | `"gp2"` | no |
| <a name="input_enabled"></a> [enabled](#input\_enabled) | Set to false to prevent the module from creating any resources | `bool` | `null` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | ID element. Usually used for region e.g. 'uw2', 'us-west-2', OR role 'prod', 'staging', 'dev', 'UAT' | `string` | `null` | no |
| <a name="input_evaluation_periods"></a> [evaluation\_periods](#input\_evaluation\_periods) | The number of periods over which data is compared to the specified threshold | `number` | `5` | no |
| <a name="input_generate_ssh_key_pair"></a> [generate\_ssh\_key\_pair](#input\_generate\_ssh\_key\_pair) | If true, create a new key pair and save the pem for it to the current working directory | `bool` | `false` | no |
| <a name="input_id_length_limit"></a> [id\_length\_limit](#input\_id\_length\_limit) | Limit `id` to this many characters (minimum 6).<br/>Set to `0` for unlimited length.<br/>Set to `null` for keep the existing setting, which defaults to `0`.<br/>Does not affect `id_full`. | `number` | `null` | no |
| <a name="input_instance_count"></a> [instance\_count](#input\_instance\_count) | Count of ec2 instances to create | `number` | `1` | no |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | The type of the instance | `string` | `"t2.micro"` | no |
| <a name="input_ipv6_address_count"></a> [ipv6\_address\_count](#input\_ipv6\_address\_count) | Number of IPv6 addresses to associate with the primary network interface. Amazon EC2 chooses the IPv6 addresses from the range of your subnet | `number` | `0` | no |
| <a name="input_ipv6_addresses"></a> [ipv6\_addresses](#input\_ipv6\_addresses) | List of IPv6 addresses from the range of the subnet to associate with the primary network interface | `list(string)` | `[]` | no |
| <a name="input_kms_key_id"></a> [kms\_key\_id](#input\_kms\_key\_id) | KMS key ID used to encrypt EBS volume. When specifying kms\_key\_id, ebs\_volume\_encrypted needs to be set to true | `string` | `null` | no |
| <a name="input_label_key_case"></a> [label\_key\_case](#input\_label\_key\_case) | Controls the letter case of the `tags` keys (label names) for tags generated by this module.<br/>Does not affect keys of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper`.<br/>Default value: `title`. | `string` | `null` | no |
| <a name="input_label_order"></a> [label\_order](#input\_label\_order) | The order in which the labels (ID elements) appear in the `id`.<br/>Defaults to ["namespace", "environment", "stage", "name", "attributes"].<br/>You can omit any of the 6 labels ("tenant" is the 6th), but at least one must be present. | `list(string)` | `null` | no |
| <a name="input_label_value_case"></a> [label\_value\_case](#input\_label\_value\_case) | Controls the letter case of ID elements (labels) as included in `id`,<br/>set as tag values, and output by this module individually.<br/>Does not affect values of tags passed in via the `tags` input.<br/>Possible values: `lower`, `title`, `upper` and `none` (no transformation).<br/>Set this to `title` and set `delimiter` to `""` to yield Pascal Case IDs.<br/>Default value: `lower`. | `string` | `null` | no |
| <a name="input_labels_as_tags"></a> [labels\_as\_tags](#input\_labels\_as\_tags) | Set of labels (ID elements) to include as tags in the `tags` output.<br/>Default is to include all labels.<br/>Tags with empty values will not be included in the `tags` output.<br/>Set to `[]` to suppress all generated tags.<br/>**Notes:**<br/>  The value of the `name` tag, if included, will be the `id`, not the `name`.<br/>  Unlike other `null-label` inputs, the initial setting of `labels_as_tags` cannot be<br/>  changed in later chained modules. Attempts to change it will be silently ignored. | `set(string)` | <pre>[<br/>  "default"<br/>]</pre> | no |
| <a name="input_metadata_http_endpoint_enabled"></a> [metadata\_http\_endpoint\_enabled](#input\_metadata\_http\_endpoint\_enabled) | Whether the metadata service is available | `bool` | `true` | no |
| <a name="input_metadata_http_tokens_required"></a> [metadata\_http\_tokens\_required](#input\_metadata\_http\_tokens\_required) | Whether or not the metadata service requires session tokens, also referred to as Instance Metadata Service Version 2. | `bool` | `true` | no |
| <a name="input_metric_name"></a> [metric\_name](#input\_metric\_name) | The name for the alarm's associated metric. Allowed values can be found in https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ec2-metricscollected.html | `string` | `"StatusCheckFailed_Instance"` | no |
| <a name="input_metric_namespace"></a> [metric\_namespace](#input\_metric\_namespace) | The namespace for the alarm's associated metric. Allowed values can be found in https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-namespaces.html | `string` | `"AWS/EC2"` | no |
| <a name="input_metric_threshold"></a> [metric\_threshold](#input\_metric\_threshold) | The value against which the specified statistic is compared | `number` | `1` | no |
| <a name="input_monitoring"></a> [monitoring](#input\_monitoring) | Launched EC2 instance will have detailed monitoring enabled | `bool` | `true` | no |
| <a name="input_name"></a> [name](#input\_name) | ID element. Usually the component or solution name, e.g. 'app' or 'jenkins'.<br/>This is the only ID element not also included as a `tag`.<br/>The "name" tag is set to the full `id` string. There is no tag with the value of the `name` input. | `string` | `null` | no |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | ID element. Usually an abbreviation of your organization name, e.g. 'eg' or 'cp', to help ensure generated IDs are globally unique | `string` | `null` | no |
| <a name="input_permissions_boundary_arn"></a> [permissions\_boundary\_arn](#input\_permissions\_boundary\_arn) | Policy ARN to attach to instance role as a permissions boundary | `string` | `""` | no |
| <a name="input_private_ips"></a> [private\_ips](#input\_private\_ips) | Private IP address to associate with the instances in the VPC | `list(string)` | `[]` | no |
| <a name="input_regex_replace_chars"></a> [regex\_replace\_chars](#input\_regex\_replace\_chars) | Terraform regular expression (regex) string.<br/>Characters matching the regex will be removed from the ID elements.<br/>If not set, `"/[^a-zA-Z0-9-]/"` is used to remove all characters other than hyphens, letters and digits. | `string` | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | AWS Region the instance is launched in | `string` | n/a | yes |
| <a name="input_root_block_device_encrypted"></a> [root\_block\_device\_encrypted](#input\_root\_block\_device\_encrypted) | Whether to encrypt the root block device | `bool` | `true` | no |
| <a name="input_root_iops"></a> [root\_iops](#input\_root\_iops) | Amount of provisioned IOPS. This must be set if root\_volume\_type is set to `io1` | `number` | `0` | no |
| <a name="input_root_volume_size"></a> [root\_volume\_size](#input\_root\_volume\_size) | Size of the root volume in gigabytes | `number` | `10` | no |
| <a name="input_root_volume_type"></a> [root\_volume\_type](#input\_root\_volume\_type) | Type of root volume. Can be standard, gp2 or io1 | `string` | `"gp2"` | no |
| <a name="input_security_group_description"></a> [security\_group\_description](#input\_security\_group\_description) | The Security Group description. | `string` | `"EC2 instances Security Group"` | no |
| <a name="input_security_group_enabled"></a> [security\_group\_enabled](#input\_security\_group\_enabled) | Whether to create default Security Group for EC2 instances. | `bool` | `true` | no |
| <a name="input_security_group_name"></a> [security\_group\_name](#input\_security\_group\_name) | The name to assign to the security group. Must be unique within the VPC.<br/>If not provided, will be derived from the `null-label.context` passed in.<br/>If `create_before_destroy` is true, will be used as a name prefix. | `list(string)` | `[]` | no |
| <a name="input_security_group_rules"></a> [security\_group\_rules](#input\_security\_group\_rules) | A list of maps of Security Group rules. <br/>The values of map is fully complated with `aws_security_group_rule` resource. <br/>To get more info see https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule . | `list(any)` | `[]` | no |
| <a name="input_security_groups"></a> [security\_groups](#input\_security\_groups) | A list of Security Group IDs to associate with EC2 instances. | `list(string)` | `[]` | no |
| <a name="input_source_dest_check"></a> [source\_dest\_check](#input\_source\_dest\_check) | Controls if traffic is routed to the instance when the destination address does not match the instance. Used for NAT or VPNs | `bool` | `true` | no |
| <a name="input_ssh_key_pair"></a> [ssh\_key\_pair](#input\_ssh\_key\_pair) | SSH key pair to be provisioned on the instance | `string` | `""` | no |
| <a name="input_ssh_key_pair_path"></a> [ssh\_key\_pair\_path](#input\_ssh\_key\_pair\_path) | Path to where the generated key pairs will be created. Defaults to $${path.cwd} | `string` | `""` | no |
| <a name="input_stage"></a> [stage](#input\_stage) | ID element. Usually used to indicate role, e.g. 'prod', 'staging', 'source', 'build', 'test', 'deploy', 'release' | `string` | `null` | no |
| <a name="input_statistic_level"></a> [statistic\_level](#input\_statistic\_level) | The statistic to apply to the alarm's associated metric. Allowed values are: SampleCount, Average, Sum, Minimum, Maximum | `string` | `"Maximum"` | no |
| <a name="input_subnet"></a> [subnet](#input\_subnet) | VPC Subnet ID the instance is launched in | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `{'BusinessUnit': 'XYZ'}`).<br/>Neither the tag keys nor the tag values will be modified by this module. | `map(string)` | `{}` | no |
| <a name="input_tenant"></a> [tenant](#input\_tenant) | ID element \_(Rarely used, not included by default)\_. A customer identifier, indicating who this instance of a resource is for | `string` | `null` | no |
| <a name="input_user_data"></a> [user\_data](#input\_user\_data) | Instance user data. Do not pass gzip-compressed data via this argument | `string` | `""` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The ID of the VPC that the instance security group belongs to | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_alarm_ids"></a> [alarm\_ids](#output\_alarm\_ids) | CloudWatch Alarm IDs |
| <a name="output_aws_key_pair_name"></a> [aws\_key\_pair\_name](#output\_aws\_key\_pair\_name) | Name of AWS key pair |
| <a name="output_ebs_ids"></a> [ebs\_ids](#output\_ebs\_ids) | IDs of EBSs |
| <a name="output_eip_per_instance_count"></a> [eip\_per\_instance\_count](#output\_eip\_per\_instance\_count) | Number of EIPs per instance. |
| <a name="output_eni_to_eip_map"></a> [eni\_to\_eip\_map](#output\_eni\_to\_eip\_map) | Map of ENI with EIP |
| <a name="output_ids"></a> [ids](#output\_ids) | Disambiguated IDs list |
| <a name="output_instance_count"></a> [instance\_count](#output\_instance\_count) | Total number of instances created |
| <a name="output_name"></a> [name](#output\_name) | Instance(s) name |
| <a name="output_new_ssh_keypair_generated"></a> [new\_ssh\_keypair\_generated](#output\_new\_ssh\_keypair\_generated) | Was a new ssh\_key\_pair generated |
| <a name="output_primary_network_interface_ids"></a> [primary\_network\_interface\_ids](#output\_primary\_network\_interface\_ids) | IDs of the instance's primary network interface |
| <a name="output_private_dns"></a> [private\_dns](#output\_private\_dns) | Private DNS records of instances |
| <a name="output_private_ips"></a> [private\_ips](#output\_private\_ips) | Private IPs of instances |
| <a name="output_public_dns"></a> [public\_dns](#output\_public\_dns) | All public DNS records for the public interfaces and ENIs |
| <a name="output_public_ips"></a> [public\_ips](#output\_public\_ips) | List of Public IPs of instances (or EIP) |
| <a name="output_role_names"></a> [role\_names](#output\_role\_names) | Names of AWS IAM Roles associated with creating instance |
| <a name="output_security_group_arn"></a> [security\_group\_arn](#output\_security\_group\_arn) | EC2 instances Security Group ARN |
| <a name="output_security_group_id"></a> [security\_group\_id](#output\_security\_group\_id) | EC2 instances Security Group ID |
| <a name="output_security_group_ids"></a> [security\_group\_ids](#output\_security\_group\_ids) | ID on the new AWS Security Group associated with creating instance |
| <a name="output_security_group_name"></a> [security\_group\_name](#output\_security\_group\_name) | EC2 instances Security Group name |
| <a name="output_ssh_key_pem_path"></a> [ssh\_key\_pem\_path](#output\_ssh\_key\_pem\_path) | Path where SSH key pair was created (if applicable) |
<!-- markdownlint-restore -->

