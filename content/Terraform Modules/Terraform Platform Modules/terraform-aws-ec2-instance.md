---
title: "terraform-aws-ec2-instance"
excerpt: "Terraform Module for providing a general purpose EC2 host."
---
# Terraform AWS EC2 Instance
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-ec2-instance",
    "1-1": "terraform-aws-ec2-instance",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-instance.svg)](https://github.com/cloudposse/terraform-aws-ec2-instance/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-instance.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-instance)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

Included features:
* Automatically create a Security Group
* Option to switch EIP attachment
* CloudWatch monitoring and automatic reboot if instance hangs
* Assume Role capability

# Usage
 
Include this repository as a module in your existing terraform code.

## Simple Example
[block:code]
{
  "codes": [
    {
      "code": "module \"instance\" {\n  source                      = \"git::https://github.com/cloudposse/terraform-aws-ec2-instance.git?ref=master\"\n  ssh_key_pair                = \"${var.ssh_key_pair}\"\n  instance_type               = \"${var.instance_type}\"\n  vpc_id                      = \"${var.vpc_id}\"\n  security_groups             = [\"${var.security_groups}\"]\n  subnet                      = \"${var.subnet}\"\n  name                        = \"${var.name}\"\n  namespace                   = \"${var.namespace}\"\n  stage                       = \"${var.stage}\"\n}",
      "language": "text",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "We suggest adding the `${var.ssh_key_pair}` private key to your `ssh agent`.",
  "title": "NOTE"
}
[/block]

## Example with Additional Volumes and EIP
[block:code]
{
  "codes": [
    {
      "code": "module \"kafka_instance\" {\n  source                      = \"git::https://github.com/cloudposse/terraform-aws-ec2-instance.git?ref=master\"\n  ssh_key_pair                = \"${var.ssh_key_pair}\"\n  vpc_id                      = \"${var.vpc_id}\"\n  security_groups             = [\"${var.security_groups}\"]\n  subnet                      = \"${var.subnet}\"\n  associate_public_ip_address = \"true\"\n  name                        = \"kafka\"\n  namespace                   = \"cp\"\n  stage                       = \"dev\"\n  additional_ips_count        = \"1\"\n  ebs_volume_count            = \"2\"\n  allowed_ports               = [\"22\", \"80\", \"443\"]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
This module depends on these modules:

* [terraform-null-label](https://github.com/cloudposse/terraform-null-label)

It is necessary to run `terraform get` to download those modules.

Now reference the label when creating an instance (for example):
[block:code]
{
  "codes": [
    {
      "code": "resource \"aws_ami_from_instance\" \"example\" {\n  name               = \"terraform-example\"\n  source_instance_id = \"${module.admin_tier.id}\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "h-3": "Required",
    "0-0": "`region`",
    "1-0": "`namespace`",
    "2-0": "`stage`",
    "3-0": "`name`",
    "4-0": "`attributes`",
    "5-0": "`tags`",
    "6-0": "`ami`",
    "7-0": "`instance_enabled`",
    "8-0": "`create_default_security_group`",
    "9-0": "`ssh_key_pair`",
    "10-0": "`instance_type`",
    "11-0": "`vpc_id`",
    "12-0": "`security_groups`",
    "13-0": "`allowed_ports`",
    "14-0": "`subnet`",
    "15-0": "`associate_public_ip_address`",
    "16-0": "`assign_eip_address`",
    "17-0": "`additional_ips_count`",
    "18-0": "`private_ip`",
    "19-0": "`source_dest_check`",
    "20-0": "`ipv6_address_count`",
    "21-0": "`ipv6_addresses`",
    "22-0": "`root_volume_type`",
    "23-0": "`root_volume_size`",
    "24-0": "`root_iops`",
    "25-0": "`ebs_device_name`",
    "26-0": "`ebs_volume_type`",
    "27-0": "`ebs_volume_size`",
    "28-0": "`ebs_iops`",
    "29-0": "`ebs_volume_count`",
    "30-0": "`delete_on_termination`",
    "31-0": "`comparison_operator`",
    "32-0": "`metric_name`",
    "33-0": "`evaluation_periods`",
    "34-0": "`metric_namespace`",
    "35-0": "`applying_period`",
    "36-0": "`statistic_level`",
    "37-0": "`metric_threshold`",
    "38-0": "`default_alarm_action`",
    "38-1": "`action/actions/AWS_EC2.InstanceId.Reboot/1.0`",
    "37-1": "`1`",
    "36-1": "`Maximum`",
    "35-1": "`60`",
    "34-1": "`AWS/EC2`",
    "33-1": "`5`",
    "32-1": "`StatusCheckFailed_Instance`",
    "31-1": "`GreaterThanOrEqualToThreshold`",
    "30-1": "`true`",
    "29-1": "`0`",
    "28-1": "`0`",
    "27-1": "`10`",
    "26-1": "`gp2`",
    "25-1": "`[/dev/xvdb]`",
    "24-1": "`0`",
    "23-1": "`10`",
    "22-1": "`gp2`",
    "21-1": "`[]`",
    "20-1": "`0`",
    "19-1": "`true`",
    "18-1": "``",
    "17-1": "`0`",
    "16-1": "`true`",
    "15-1": "`true`",
    "14-1": "``",
    "13-1": "`[]`",
    "12-1": "`[]`",
    "11-1": "``",
    "10-1": "`t2.micro`",
    "9-1": "``",
    "8-1": "`true`",
    "7-1": "`true`",
    "6-1": "``",
    "5-1": "`{}`",
    "4-1": "`[]`",
    "3-1": "``",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-2": "AWS Region the instance is launched in. Optional. If not provided, the current region will be used",
    "1-2": "Namespace (e.g. `cp` or `cloudposse`)",
    "2-2": "Stage (e.g. `prod`, `dev`, `staging`",
    "3-2": "Name  (e.g. `bastion` or `db`)",
    "4-2": "Additional attributes (e.g. `policy` or `role`)",
    "5-2": "Additional tags  (e.g. `map(\"BusinessUnit\",\"XYZ\")`",
    "6-2": "By default it is the AMI provided by Amazon with Ubuntu 16.04",
    "7-2": "Flag to control the instance creation. Set to false if it is necessary to skip instance creation",
    "8-2": "Create default Security Group with only Egress traffic allowed",
    "9-2": "SSH key pair to be provisioned on the instance",
    "10-2": "The type of the instance (e.g. `t2.micro`)",
    "11-2": "The ID of the VPC that the instance security group belongs to",
    "12-2": "List of Security Group IDs allowed to connect to the instance",
    "13-2": "List of allowed ingress ports, _e.g._ [\"22\", \"80\", \"443\"]",
    "14-2": "VPC Subnet ID the instance is launched in",
    "15-2": "Associate a public IP address with the instance",
    "16-2": "Assign an Elastic IP address to the instance",
    "17-2": "Count of additional EIPs",
    "18-2": "Private IP address to associate with the instance in the VPC",
    "19-2": "Controls if traffic is routed to the instance when the destination address does not match the instance",
    "20-2": "Number of IPv6 addresses to associate with the primary network interface",
    "21-2": "List of IPv6 addresses from the range of the subnet to associate with the primary network interface",
    "22-2": "Type of the root volume. Can be `standard`, `gp2` or `io1`",
    "23-2": "Size of the root volume in gigabytes",
    "24-2": "Amount of provisioned IOPS. This must be set with a `root_volume_type` of `io1`",
    "25-2": "Name of the EBS device to mount",
    "26-2": "Type of EBS volume. Can be `standard`, `gp2` or `io1`",
    "27-2": "Size of the EBS volume in gigabytes",
    "28-2": "Amount of provisioned IOPS. This must be set if `ebs_volume_type` is set to `io1`",
    "29-2": "Count of EBS volumes that will be attached to the instance",
    "30-2": "Whether the volume should be destroyed on instance termination",
    "31-2": "Arithmetic operation to use when comparing the specified Statistic and Threshold",
    "32-2": "Name for the alarm's associated metric",
    "33-2": "Number of periods over which data is compared to the specified threshold",
    "34-2": "Namespace for the alarm's associated metric",
    "35-2": "Period in seconds over which the specified statistic is applied",
    "36-2": "Statistic to apply to the alarm's associated metric",
    "37-2": "Value against which the specified statistic is compared",
    "38-2": "String of action to execute when this alarm transitions into an ALARM state",
    "14-3": "Yes",
    "13-3": "No",
    "12-3": "Yes",
    "11-3": "Yes",
    "9-3": "Yes",
    "10-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No",
    "7-3": "No",
    "8-3": "No",
    "0-3": "No",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "15-3": "No",
    "16-3": "No",
    "17-3": "No",
    "20-3": "No",
    "19-3": "No",
    "18-3": "No",
    "21-3": "No",
    "22-3": "No",
    "23-3": "No",
    "24-3": "No",
    "25-3": "No",
    "26-3": "No",
    "27-3": "No",
    "28-3": "No",
    "29-3": "No",
    "36-3": "No",
    "35-3": "No",
    "34-3": "No",
    "33-3": "No",
    "32-3": "No",
    "31-3": "No",
    "30-3": "No",
    "38-3": "No",
    "37-3": "No"
  },
  "cols": 4,
  "rows": 39
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`id`",
    "0-1": "Disambiguated ID",
    "1-1": "Private DNS of the instance",
    "2-1": "Private IP of the instance",
    "3-1": "Public IP of the instance (or EIP )",
    "4-1": "Public DNS of the instance (or DNS of EIP)",
    "5-1": "Name of used AWS SSH key",
    "6-1": "ID of the AWS Security Group associated with the instance",
    "7-1": "Name of the AWS IAM Role associated with the instance",
    "8-1": "CloudWatch Alarm ID",
    "9-1": "Map of ENI to EIP",
    "10-1": "IDs of EBSs",
    "11-1": "ID of the instance's primary network interface",
    "12-1": "ID of the network interface that was created with the instance",
    "12-0": "`network_interface_id`",
    "11-0": "`primary_network_interface_id`",
    "10-0": "`ebs_ids`",
    "9-0": "`additional_eni_ids`",
    "8-0": "`alarm`",
    "7-0": "`role`",
    "6-0": "`security_group_id`",
    "5-0": "`ssh_key_pair`",
    "4-0": "`public_dns`",
    "3-0": "`public_ip`",
    "2-0": "`private_ip`",
    "1-0": "`private_dns`"
  },
  "cols": 2,
  "rows": 13
}
[/block]