---
title: "terraform-aws-ec2-admin-server"
excerpt: "Terraform Module for providing a server capable of running admin tasks. Use `terraform-aws-ec2-admin-server` to create and manage an admin instance."
---
# Terraform AWS EC2 Admin Server
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-ec2-admin-server",
    "1-1": "terraform-aws-ec2-admin-server",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-ec2-admin-server.svg)](https://github.com/cloudposse/terraform-aws-ec2-admin-server/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-ec2-admin-server.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-ec2-admin-server)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage

Include this repository as a module in your existing terraform code:
[block:code]
{
  "codes": [
    {
      "code": "module \"admin_tier\" {\n  source                      = \"git::https://github.com/cloudposse/terraform-aws-ec2-admin-server.git?ref=master\"\n  ssh_key_pair                = \"${var.ssh_key_pair}\"\n  github_api_token            = \"${var.github_api_token}\"\n  github_organization         = \"${var.github_organization}\"\n  github_team                 = \"${var.github_team}\"\n  instance_type               = \"${var.instance_type}\"\n  vpc_id                      = \"${var.vpc_id}\"\n  name                        = \"admin\"\n  namespace                   = \"${var.namespace}\"\n  stage                       = \"${var.stage}\"\n  subnets                     = [\"${var.subnets}\"]\n  zone_id                     = \"${module.terraform-aws-route53-cluster-zone.zone_id}\"\n  security_groups             = [\"${var.security_groups}\"]\n  allow_cidr_blocks           = [\"${var.allow_cidr_blocks}\"]\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "NOTE",
  "body": "Add `${var.ssh_key_pair}` private key to your `ssh-agent` to easily access the server."
}
[/block]
# About terraform-aws-route53-cluster-zone

This requires terraform-aws-route53-cluster-zone to provide a cluster-level DNS zone. The module uses [terraform-aws-route53-cluster-hostname](doc:terraform-aws-route53-cluster-hostname) to create a DNS record for created host. `terraform-aws-route53-cluster-hostname` module needs `zone_id` parameter as an input, and this parameter actually is an output from [terraform-aws-route53-cluster-zone](doc:terraform-aws-route53-cluster-zone).

That is why [terraform-aws-route53-cluster-zone](doc:terraform-aws-route53-cluster-zone) should be implemented in `root` TF manifest when we need `terraform-aws-ec2-admin-server`.

# Dependencies

This module depends on the following modules:
* [terraform-null-label](doc:terraform-null-label)  
* [terraform-template-user-data-github-authorized-keys](doc:terraform-template-user-data-github-authorized-keys) 
* [terraform-aws-route53-cluster-hostname](doc:terraform-aws-route53-cluster-hostname) 
* [terraform-aws-route53-cluster-zone](doc:terraform-aws-route53-cluster-zone) (not directly, but `terraform-aws-route53-cluster-hostname` need child `zone_id`)

It is necessary to run `terraform get` to download these modules.

Reference the label when creating an instance. See below for examples.

# Usage

Include this module in your existing terraform code:

[block:code]
{
  "codes": [
    {
      "code": "module \"admin_tier\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-ec2-admin-server.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`ec2_ami`",
    "4-0": "`ssh_key_pair`",
    "5-0": "`github_api_token`",
    "6-0": "`github_organization`",
    "7-0": "`github_team`",
    "8-0": "`instance_type`",
    "9-0": "`vpc_id`",
    "10-0": "`security_groups`",
    "11-0": "`subnets`",
    "12-0": "`allow_cidr_blocks`",
    "13-0": "`zone_id`",
    "0-1": "`global`",
    "1-1": "`default`",
    "2-1": "`admin`",
    "3-1": "`ami-cd0f5cb6`",
    "4-1": "``",
    "5-1": "``",
    "6-1": "``",
    "7-1": "``",
    "9-1": "``",
    "13-1": "``",
    "12-1": "[\"0.0.0.0/0\"]",
    "11-1": "[]",
    "10-1": "[]",
    "8-1": "`t2.micro`",
    "0-2": "Namespace (e.g. `cp` or `cloudposse`) - required for `terraform-null-label` module",
    "1-2": "Stage (e.g. `prod`, `dev`, `staging` - required for `terraform-null-label` module",
    "2-2": "Name  (e.g. `bastion` or `db`) - required for `terraform-null-label` module",
    "3-2": "By default it is an AMI provided by Amazon with Ubuntu 16.04",
    "4-2": "SSH key pair to be provisioned on instance",
    "5-2": "GitHub API token",
    "6-2": "GitHub organization name",
    "7-2": "GitHub team",
    "8-2": "The type of instance that will be created (e.g. `t2.micro`)",
    "9-2": "The ID of the VPC where the instance will be created",
    "10-2": "List of Security Group IDs permitted to connect to this instance",
    "11-2": "List of VPC Subnet IDs where the instance may be launched",
    "12-2": "List of CIDR blocks to permit SSH access",
    "13-2": "ID of the domain zone to use - is a result of terraform-aws-route53-cluster-zone output",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "Yes",
    "5-3": "Yes",
    "7-3": "Yes",
    "6-3": "Yes",
    "8-3": "No",
    "9-3": "Yes",
    "10-3": "Yes",
    "11-3": "Yes",
    "12-3": "No",
    "13-3": "Yes"
  },
  "cols": 4,
  "rows": 14
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-1": "Disambiguated ID",
    "1-1": "DNS name (Fully Qualified Host Name) of creating instance",
    "2-1": "IPv4 Public IP",
    "3-1": "Name of used AWS SSH key",
    "4-1": "List of IDs of AWS Security Groups associated with creating instance",
    "5-1": "Name of AWS IAM Role associated with creating instance",
    "5-0": "`role`",
    "4-0": "`security_group_ids`",
    "2-0": "`public_ip`",
    "3-0": "`ssh_key_pair`",
    "1-0": "`fqhn`",
    "0-0": "`id`"
  },
  "cols": 2,
  "rows": 6
}
[/block]