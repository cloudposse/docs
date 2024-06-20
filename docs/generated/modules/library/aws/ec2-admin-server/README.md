---
title: ec2-admin-server
sidebar_label: ec2-admin-server
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

custom_edit_url: https://github.com/cloudposse/terraform-aws-ec2-admin-server/blob/main/README.yaml
---

# Module: `ec2-admin-server`
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






<!-- markdownlint-disable -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.0 |
| <a name="requirement_null"></a> [null](#requirement\_null) | >= 2.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 5.0 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_dns"></a> [dns](#module\_dns) | cloudposse/route53-cluster-hostname/aws | 0.13.0 |
| <a name="module_instance"></a> [instance](#module\_instance) | cloudposse/ec2-instance/aws | 1.2.1 |
| <a name="module_label"></a> [label](#module\_label) | cloudposse/label/null | 0.25.0 |

## Resources

| Name | Type |
|------|------|
| [aws_security_group.default](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.egress](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.ssh](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_allow_cidr_blocks"></a> [allow\_cidr\_blocks](#input\_allow\_cidr\_blocks) | List of CIDR blocks to permit SSH access | `list(string)` | <pre>[<br/>  "0.0.0.0/0"<br/>]</pre> | no |
| <a name="input_attributes"></a> [attributes](#input\_attributes) | Additional attributes (e.g. `policy` or `role`) | `list(string)` | `[]` | no |
| <a name="input_delimiter"></a> [delimiter](#input\_delimiter) | Delimiter to be used between `name`, `namespace`, `stage`, etc. | `string` | `"-"` | no |
| <a name="input_dns_ttl"></a> [dns\_ttl](#input\_dns\_ttl) | The time for which a DNS resolver caches a response | `string` | `"60"` | no |
| <a name="input_ec2_ami"></a> [ec2\_ami](#input\_ec2\_ami) | By default it is an AMI provided by Amazon with Ubuntu 16.04 | `string` | `"ami-cd0f5cb6"` | no |
| <a name="input_github_api_token"></a> [github\_api\_token](#input\_github\_api\_token) | GitHub API token | `any` | n/a | yes |
| <a name="input_github_organization"></a> [github\_organization](#input\_github\_organization) | GitHub organization name | `any` | n/a | yes |
| <a name="input_github_team"></a> [github\_team](#input\_github\_team) | GitHub team | `any` | n/a | yes |
| <a name="input_instance_type"></a> [instance\_type](#input\_instance\_type) | The type of instance that will be created (e.g. `t2.micro`) | `string` | `"t2.micro"` | no |
| <a name="input_name"></a> [name](#input\_name) | The Name of the application or solution  (e.g. `bastion` or `portal`) | `any` | n/a | yes |
| <a name="input_namespace"></a> [namespace](#input\_namespace) | Namespace (e.g. `cp` or `cloudposse`) | `any` | n/a | yes |
| <a name="input_security_groups"></a> [security\_groups](#input\_security\_groups) | List of Security Group IDs permitted to connect to this instance | `list(string)` | `[]` | no |
| <a name="input_ssh_key_pair"></a> [ssh\_key\_pair](#input\_ssh\_key\_pair) | SSH key pair to be provisioned on instance | `any` | n/a | yes |
| <a name="input_stage"></a> [stage](#input\_stage) | Stage (e.g. `prod`, `dev`, `staging`) | `any` | n/a | yes |
| <a name="input_subnets"></a> [subnets](#input\_subnets) | List of VPC Subnet IDs where the instance may be launched | `list(string)` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Additional tags (e.g. `map('BusinessUnit','XYZ')`) | `map(string)` | `{}` | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The ID of the VPC where the instance will be created | `any` | n/a | yes |
| <a name="input_zone_id"></a> [zone\_id](#input\_zone\_id) | Route53 DNS Zone id | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_fqhn"></a> [fqhn](#output\_fqhn) | DNS name (Fully Qualified Host Name) of creating instance |
| <a name="output_id"></a> [id](#output\_id) | Disambiguated ID |
| <a name="output_public_ip"></a> [public\_ip](#output\_public\_ip) | IPv4 Public IP |
| <a name="output_role"></a> [role](#output\_role) | Name of AWS IAM Role associated with creating instance |
| <a name="output_security_group_ids"></a> [security\_group\_ids](#output\_security\_group\_ids) | List of IDs of AWS Security Groups associated with creating instance |
| <a name="output_ssh_key_pair"></a> [ssh\_key\_pair](#output\_ssh\_key\_pair) | Name of used AWS SSH key |
<!-- markdownlint-restore -->

