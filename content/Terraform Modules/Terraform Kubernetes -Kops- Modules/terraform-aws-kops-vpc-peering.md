---
title: "terraform-aws-kops-vpc-peering"
excerpt: "Terraform module to create a peering connection between a backing services VPC and a VPC created by [Kops](https://github.com/kubernetes/kops)."
---
# Terraform AWS Kops VPC Peering
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-kops-vpc-peering",
    "1-1": "terraform-aws-kops-vpc-peering",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-vpc-peering.svg)](https://github.com/cloudposse/terraform-aws-kops-vpc-peering/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-vpc-peering.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-vpc-peering)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

The module depends on the following Terraform modules

- [terraform-aws-kops-metadata](doc:terraform-aws-kops-metadata) - to lookup resources within a Kops cluster
- [terraform-aws-vpc-peering](doc:terraform-aws-vpc-peering) - to create a peering connection between two VPCs

# Usage

[block:code]
{
  "codes": [
    {
      "code": "module \"kops_vpc_peering\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-kops-vpc-peering.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "The backing services VPC must have subnets associated with route tables.",
  "title": "NOTE"
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
    "3-0": "`backing_services_vpc_id`",
    "4-0": "`dns_zone`",
    "5-0": "`bastion_name`",
    "6-0": "`masters_name`",
    "7-0": "`nodes_name`",
    "8-0": "`attributes`",
    "9-0": "`tags`",
    "10-0": "`delimiter`",
    "11-0": "`enabled`",
    "12-0": "`auto_accept`",
    "13-0": "`backing_services_allow_remote_vpc_dns_resolution`",
    "13-1": "`true`",
    "12-1": "`true`",
    "11-1": "`true`",
    "10-1": "`-`",
    "9-1": "`{}`",
    "8-1": "`[]`",
    "7-1": "`nodes`",
    "6-1": "`masters`",
    "5-1": "`bastion`",
    "3-1": "``",
    "4-1": "``",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name  (_e.g._ `app` or `cluster`)",
    "3-2": "Backing services VPC ID",
    "4-2": "Name of the Kops DNS zone",
    "5-2": "Bastion server subdomain name in the `Kops` DNS zone",
    "6-2": "K8s masters subdomain name in the `Kops` DNS zone",
    "7-2": "K8s nodes subdomain name in the `Kops` DNS zone",
    "8-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "9-2": "Additional tags  (_e.g._ `map(\"BusinessUnit\",\"XYZ\")`",
    "10-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "11-2": "Set to `false` to prevent the module from creating or accessing any resources",
    "12-2": "Automatically accept the peering (both VPCs need to be in the same AWS account)",
    "13-2": "Allow the backing services VPC to resolve public DNS hostnames to private IP addresses when queried from instances in the `Kops` VPC",
    "13-3": "No",
    "12-3": "No",
    "11-3": "No",
    "10-3": "No",
    "9-3": "No",
    "8-3": "No",
    "3-3": "Yes",
    "4-3": "Yes",
    "5-3": "Yes",
    "6-3": "Yes",
    "7-3": "Yes",
    "2-3": "Yes",
    "1-3": "Yes",
    "0-3": "Yes"
  },
  "cols": 4,
  "rows": 14
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "When enabled, the DNS resolution feature (`backing_services_allow_remote_vpc_dns_resolution`)\nrequire that the backing services VPC must have support for the DNS hostnames enabled.\n\nThis can be done using the [`enable_dns_hostnames`](https://www.terraform.io/docs/providers/aws/r/vpc.html#enable_dns_hostnames) attribute in the `aws_vpc` resource.\n\nRead more: [www.terraform.io/docs/providers/aws/r/vpc_peering.html](https://www.terraform.io/docs/providers/aws/r/vpc_peering.html#allow_remote_vpc_dns_resolution)",
  "title": "NOTE"
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`connection_id`",
    "1-0": "`accept_status`",
    "2-0": "`kops_vpc_id`",
    "2-1": "Kops VPC ID",
    "1-1": "The status of the VPC peering connection request",
    "0-1": "VPC peering connection ID"
  },
  "cols": 2,
  "rows": 3
}
[/block]