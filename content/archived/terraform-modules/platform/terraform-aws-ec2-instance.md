---
title: terraform-aws-ec2-instance
description: Terraform Module for providing a general purpose EC2 host.
---

# Terraform AWS EC2 Instance

|                  |                                                                                                                                                                  |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-ec2-instance>                                                                                                       |
| Terraform Module | terraform-aws-ec2-instance                                                                                                                                       |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-instance.svg)](https://github.com/cloudposse/terraform-aws-ec2-instance/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-instance.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-instance)    |

Included features:

- Automatically create a Security Group
- Option to switch EIP attachment
- CloudWatch monitoring and automatic reboot if instance hangs
- Assume Role capability

# Usage

Include this repository as a module in your existing terraform code.

## Simple Example

### HCL

```hcl
module "instance" {
  source                      = "git::https://github.com/cloudposse/terraform-aws-ec2-instance.git?ref=master"
  ssh_key_pair                = "${var.ssh_key_pair}"
  instance_type               = "${var.instance_type}"
  vpc_id                      = "${var.vpc_id}"
  security_groups             = ["${var.security_groups}"]
  subnet                      = "${var.subnet}"
  name                        = "${var.name}"
  namespace                   = "${var.namespace}"
  stage                       = "${var.stage}"
}
```

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
We suggest adding the `${var.ssh_key_pair}` private key to your `ssh agent`.
{{% /dialog %}}

## Example with Additional Volumes and EIP

### HCL

```hcl
module "kafka_instance" {
  source                      = "git::https://github.com/cloudposse/terraform-aws-ec2-instance.git?ref=master"
  ssh_key_pair                = "${var.ssh_key_pair}"
  vpc_id                      = "${var.vpc_id}"
  security_groups             = ["${var.security_groups}"]
  subnet                      = "${var.subnet}"
  associate_public_ip_address = "true"
  name                        = "kafka"
  namespace                   = "cp"
  stage                       = "dev"
  additional_ips_count        = "1"
  ebs_volume_count            = "2"
  allowed_ports               = ["22", "80", "443"]
}
```

This module depends on these modules:

- [terraform-null-label](https://github.com/cloudposse/terraform-null-label)

It is necessary to run `terraform get` to download those modules.

Now reference the label when creating an instance (for example):

### HCL

```hcl
resource "aws_ami_from_instance" "example" {
  name               = "terraform-example"
  source_instance_id = "${module.admin_tier.id}"
}
```

# Variables

| Name                            | Default                                        | Description                                                                                            | Required |
|:--------------------------------|:-----------------------------------------------|:-------------------------------------------------------------------------------------------------------|:---------|
| `region`                        | ``                                             | AWS Region the instance is launched in. Optional. If not provided, the current region will be used     | No       |
| `ssh_key_pair`                  | ``                                             | SSH key pair to be provisioned on the instance                                                         | Yes      |
| `instance_type`                 | `t2.micro`                                     | The type of the instance (e.g. `t2.micro`)                                                             | No       |
| `vpc_id`                        | ``                                             | The ID of the VPC that the instance security group belongs to                                          | Yes      |
| `security_groups`               | `[]`                                           | List of Security Group IDs allowed to connect to the instance                                          | Yes      |
| `allowed_ports`                 | `[]`                                           | List of allowed ingress ports, _e.g._ ["22", "80", "443"]                                              | No       |
| `subnet`                        | ``                                             | VPC Subnet ID the instance is launched in                                                              | Yes      |
| `associate_public_ip_address`   | `true`                                         | Associate a public IP address with the instance                                                        | No       |
| `assign_eip_address`            | `true`                                         | Assign an Elastic IP address to the instance                                                           | No       |
| `additional_ips_count`          | `0`                                            | Count of additional EIPs                                                                               | No       |
| `private_ip`                    | ``                                             | Private IP address to associate with the instance in the VPC                                           | No       |
| `namespace`                     | ``                                             | Namespace (e.g. `cp` or `cloudposse`)                                                                  | Yes      |
| `source_dest_check`             | `true`                                         | Controls if traffic is routed to the instance when the destination address does not match the instance | No       |
| `ipv6_address_count`            | `0`                                            | Number of IPv6 addresses to associate with the primary network interface                               | No       |
| `ipv6_addresses`                | `[]`                                           | List of IPv6 addresses from the range of the subnet to associate with the primary network interface    | No       |
| `root_volume_type`              | `gp2`                                          | Type of the root volume. Can be `standard`, `gp2` or `io1`                                             | No       |
| `root_volume_size`              | `10`                                           | Size of the root volume in gigabytes                                                                   | No       |
| `root_iops`                     | `0`                                            | Amount of provisioned IOPS. This must be set with a `root_volume_type` of `io1`                        | No       |
| `ebs_device_name`               | `[/dev/xvdb]`                                  | Name of the EBS device to mount                                                                        | No       |
| `ebs_volume_type`               | `gp2`                                          | Type of EBS volume. Can be `standard`, `gp2` or `io1`                                                  | No       |
| `ebs_volume_size`               | `10`                                           | Size of the EBS volume in gigabytes                                                                    | No       |
| `ebs_iops`                      | `0`                                            | Amount of provisioned IOPS. This must be set if `ebs_volume_type` is set to `io1`                      | No       |
| `stage`                         | ``                                             | Stage (e.g. `prod`, `dev`, `staging`                                                                   | Yes      |
| `ebs_volume_count`              | `0`                                            | Count of EBS volumes that will be attached to the instance                                             | No       |
| `delete_on_termination`         | `true`                                         | Whether the volume should be destroyed on instance termination                                         | No       |
| `comparison_operator`           | `GreaterThanOrEqualToThreshold`                | Arithmetic operation to use when comparing the specified Statistic and Threshold                       | No       |
| `metric_name`                   | `StatusCheckFailed_Instance`                   | Name for the alarm's associated metric                                                                 | No       |
| `evaluation_periods`            | `5`                                            | Number of periods over which data is compared to the specified threshold                               | No       |
| `metric_namespace`              | `AWS/EC2`                                      | Namespace for the alarm's associated metric                                                            | No       |
| `applying_period`               | `60`                                           | Period in seconds over which the specified statistic is applied                                        | No       |
| `statistic_level`               | `Maximum`                                      | Statistic to apply to the alarm's associated metric                                                    | No       |
| `metric_threshold`              | `1`                                            | Value against which the specified statistic is compared                                                | No       |
| `default_alarm_action`          | `action/actions/AWS_EC2.InstanceId.Reboot/1.0` | String of action to execute when this alarm transitions into an ALARM state                            | No       |
| `name`                          | ``                                             | Name (e.g. `bastion` or `db`)                                                                          | Yes      |
| `attributes`                    | `[]`                                           | Additional attributes (e.g. `policy` or `role`)                                                        | No       |
| `tags`                          | `{}`                                           | Additional tags (e.g. `map("BusinessUnit","XYZ")`                                                      | No       |
| `ami`                           | ``                                             | By default it is the AMI provided by Amazon with Ubuntu 16.04                                          | No       |
| `instance_enabled`              | `true`                                         | Flag to control the instance creation. Set to false if it is necessary to skip instance creation       | No       |
| `create_default_security_group` | `true`                                         | Create default Security Group with only Egress traffic allowed                                         | No       |

# Outputs

| Name                           | Description                                                    |
|:-------------------------------|:---------------------------------------------------------------|
| `id`                           | Disambiguated ID                                               |
| `additional_eni_ids`           | Map of ENI to EIP                                              |
| `ebs_ids`                      | IDs of EBSs                                                    |
| `primary_network_interface_id` | ID of the instance's primary network interface                 |
| `network_interface_id`         | ID of the network interface that was created with the instance |
| `private_dns`                  | Private DNS of the instance                                    |
| `private_ip`                   | Private IP of the instance                                     |
| `public_ip`                    | Public IP of the instance (or EIP )                            |
| `public_dns`                   | Public DNS of the instance (or DNS of EIP)                     |
| `ssh_key_pair`                 | Name of used AWS SSH key                                       |
| `security_group_id`            | ID of the AWS Security Group associated with the instance      |
| `role`                         | Name of the AWS IAM Role associated with the instance          |
| `alarm`                        | CloudWatch Alarm ID                                            |
