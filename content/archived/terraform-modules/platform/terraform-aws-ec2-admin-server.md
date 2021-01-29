---
title: terraform-aws-ec2-admin-server
description: >-
  Terraform Module for providing a server capable of running admin tasks. Use
  `terraform-aws-ec2-admin-server` to create and manage an admin instance.
---

# Terraform AWS EC2 Admin Server

|                  |                                                                                                                                                                          |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-ec2-admin-server>                                                                                                           |
| Terraform Module | terraform-aws-ec2-admin-server                                                                                                                                           |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-admin-server.svg)](https://github.com/cloudposse/terraform-aws-ec2-admin-server/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-admin-server.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-admin-server)    |

# Usage

Include this repository as a module in your existing terraform code:

## HCL

```hcl
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

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Add `${var.ssh_key_pair}` private key to your `ssh-agent` to easily access the server.
{{% /dialog %}}

# About terraform-aws-route53-cluster-zone

This requires terraform-aws-route53-cluster-zone to provide a cluster-level DNS zone. The module uses [terraform-aws-route53-cluster-hostname]({{< relref "terraform-modules/networking/terraform-aws-route53-cluster-hostname.md" >}}) to create a DNS record for created host. `terraform-aws-route53-cluster-hostname` module needs `zone_id` parameter as an input, and this parameter actually is an output from [terraform-aws-route53-cluster-zone]({{< relref "terraform-modules/networking/terraform-aws-route53-cluster-zone.md" >}}).

That is why [terraform-aws-route53-cluster-zone]({{< relref "terraform-modules/networking/terraform-aws-route53-cluster-zone.md" >}}) should be implemented in `root` TF manifest when we need `terraform-aws-ec2-admin-server`.

# Dependencies

This module depends on the following modules:

- [terraform-null-label]({{< relref "terraform-modules/supported/terraform-null-label.md" >}})
- [terraform-template-user-data-github-authorized-keys]({{< relref "terraform-modules/user-data/terraform-template-user-data-github-authorized-keys.md" >}})
- [terraform-aws-route53-cluster-hostname]({{< relref "terraform-modules/networking/terraform-aws-route53-cluster-hostname.md" >}})
- [terraform-aws-route53-cluster-zone]({{< relref "terraform-modules/networking/terraform-aws-route53-cluster-zone.md" >}}) (not directly, but `terraform-aws-route53-cluster-hostname` need child `zone_id`)

It is necessary to run `terraform get` to download these modules.

Reference the label when creating an instance. See below for examples.

# Usage

Include this module in your existing terraform code:

## HCL

```hcl
module "admin_tier" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-ec2-admin-server.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                  | Default        | Description                                                                             | Required |
|:----------------------|:---------------|:----------------------------------------------------------------------------------------|:---------|
| `namespace`           | `global`       | Namespace (e.g. `cp` or `cloudposse`) - required for `terraform-null-label` module      | Yes      |
| `vpc_id`              | ``             | The ID of the VPC where the instance will be created                                    | Yes      |
| `security_groups`     | []             | List of Security Group IDs permitted to connect to this instance                        | Yes      |
| `subnets`             | []             | List of VPC Subnet IDs where the instance may be launched                               | Yes      |
| `allow_cidr_blocks`   | ["0.0.0.0/0"]  | List of CIDR blocks to permit SSH access                                                | No       |
| `zone_id`             | ``             | ID of the domain zone to use - is a result of terraform-aws-route53-cluster-zone output | Yes      |
| `stage`               | `default`      | Stage (e.g. `prod`, `dev`, `staging` - required for `terraform-null-label` module       | Yes      |
| `name`                | `admin`        | Name (e.g. `bastion` or `db`) - required for `terraform-null-label` module              | Yes      |
| `ec2_ami`             | `ami-cd0f5cb6` | By default it is an AMI provided by Amazon with Ubuntu 16.04                            | No       |
| `ssh_key_pair`        | ``             | SSH key pair to be provisioned on instance                                              | Yes      |
| `github_api_token`    | ``             | GitHub API token                                                                        | Yes      |
| `github_organization` | ``             | GitHub organization name                                                                | Yes      |
| `github_team`         | ``             | GitHub team                                                                             | Yes      |
| `instance_type`       | `t2.micro`     | The type of instance that will be created (e.g. `t2.micro`)                             | No       |

# Outputs

| Name                 | Description                                                          |
|:---------------------|:---------------------------------------------------------------------|
| `id`                 | Disambiguated ID                                                     |
| `fqhn`               | DNS name (Fully Qualified Host Name) of creating instance            |
| `public_ip`          | IPv4 Public IP                                                       |
| `ssh_key_pair`       | Name of used AWS SSH key                                             |
| `security_group_ids` | List of IDs of AWS Security Groups associated with creating instance |
| `role`               | Name of AWS IAM Role associated with creating instance               |
