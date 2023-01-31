---
title: aws-ec2-admin-server
sidebar_label: aws-ec2-admin-server
sidebar_class_name: command
description: |-
  Terraform Module for providing a server capable of running admin tasks. Use `terraform-aws-ec2-admin-server` to create and manage an admin instance.
tags:
  - aws
  - terraform
  - terraform-modules
  - platform
  - ec2
  - admin-server
  - instance
  - security
  - ansible
  - bastion
  - ssh

custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-admin-server/edit/master/README.md
---

# Component: `aws-ec2-admin-server`
Terraform Module for providing a server capable of running admin tasks. Use `terraform-aws-ec2-admin-server` to create and manage an admin instance.






## Usage

Note: add `${var.ssh_key_pair}` private key to the `ssh agent`.

Include this repository as a module in your existing terraform code:

```terraform
module "admin_tier" {
  source                      = "git::https://github.com/cloudposse/terraform-aws-ec2-admin-server.git?ref=master"
  ssh_key_pair                = "${var.ssh_key_pair}"
  github_api_token            = "${var.github_api_token}"
  github_organization         = "${var.github_organization}"
  github_team                 = "${var.github_team}"
  instance_type               = "${var.instance_type}"
  vpc_id                      = "${var.vpc_id}"
  name                        = "admin"
  namespace                   = "${var.namespace}"
  stage                       = "${var.stage}"
  subnets                     = ["${var.subnets}"]
  zone_id                     = "${module.terraform-aws-route53-cluster-zone.zone_id}"
  security_groups             = ["${var.security_groups}"]
  allow_cidr_blocks           = ["${var.allow_cidr_blocks}"]
}

```

### Module `terraform-aws-route53-cluster-zone`

Module `terraform-aws-ec2-admin-server` requires another module to be used additionally - `terraform-aws-route53-cluster-zone`.

`terraform-aws-ec2-admin-server` uses `terraform-aws-route53-cluster-hostname` to create a DNS record for created host. `terraform-aws-route53-cluster-hostname` module needs `zone_id` parameter as an input, and this parameter actually is an output from `terraform-aws-route53-cluster-zone`.

That is why `terraform-aws-route53-cluster-zone` should be implemented in `root` TF manifest when we need `terraform-aws-ec2-admin-server`.


### This module depends on the next modules:

* [terraform-null-label](https://github.com/cloudposse/terraform-null-label)
* [terraform-aws-ubuntu-github-authorized-keys-user-data](https://github.com/cloudposse/terraform-aws-ubuntu-github-authorized-keys-user-data)
* [terraform-aws-route53-cluster-hostname](https://github.com/cloudposse/terraform-aws-route53-cluster-hostname)
* [terraform-aws-route53-cluster-zone](https://github.com/cloudposse/terraform-aws-route53-cluster-zone) (not directly, but `terraform-aws-route53-cluster-hostname` need child `zone_id`)

It is necessary to run `terraform get` to download those modules.

Now reference the label when creating an instance (for example):
```terraform
resource "aws_ami_from_instance" "example" {
  name               = "terraform-example"
  source_instance_id = "${module.admin_tier.id}"
}
```






## Makefile Targets
```
Available targets:

  help                                Help screen
  help/all                            Display help for all targets
  help/short                          This help short screen
  lint                                Lint terraform code

```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| allow_cidr_blocks | List of CIDR blocks to permit SSH access | list | `<list>` | no |
| attributes | Additional attributes (e.g. `policy` or `role`) | list | `<list>` | no |
| delimiter | Delimiter to be used between `name`, `namespace`, `stage`, etc. | string | `-` | no |
| dns_ttl | The time for which a DNS resolver caches a response | string | `60` | no |
| ec2_ami | By default it is an AMI provided by Amazon with Ubuntu 16.04 | string | `ami-cd0f5cb6` | no |
| github_api_token | GitHub API token | string | - | yes |
| github_organization | GitHub organization name | string | - | yes |
| github_team | GitHub team | string | - | yes |
| instance_type | The type of instance that will be created (e.g. `t2.micro`) | string | `t2.micro` | no |
| namespace | Namespace (e.g. `cp` or `cloudposse`) | string | - | yes |
| security_groups | List of Security Group IDs permitted to connect to this instance | list | `<list>` | no |
| ssh_key_pair | SSH key pair to be provisioned on instance | string | - | yes |
| stage | Stage (e.g. `prod`, `dev`, `staging`) | string | - | yes |
| subnets | List of VPC Subnet IDs where the instance may be launched | list | - | yes |
| tags | Additional tags (e.g. `map('BusinessUnit','XYZ')`) | map | `<map>` | no |
| vpc_id | The ID of the VPC where the instance will be created | string | - | yes |
| zone_id | Route53 DNS Zone id | string | `` | no |

## Outputs

| Name | Description |
|------|-------------|
| fqhn | DNS name (Fully Qualified Host Name) of creating instance |
| id | Disambiguated ID |
| public_ip | IPv4 Public IP |
| role | Name of AWS IAM Role associated with creating instance |
| security_group_ids | List of IDs of AWS Security Groups associated with creating instance |
| ssh_key_pair | Name of used AWS SSH key |



