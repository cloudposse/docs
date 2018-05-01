---
title: "terraform-aws-kops-metadata"
excerpt: "Terraform module to lookup resources within a [Kops](https://github.com/kubernetes/kops) cluster"
---
# Terraform AWS Kops Metadata 
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-kops-metadata",
    "1-1": "terraform-aws-kops-metadata",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-metadata.svg)](https://github.com/cloudposse/terraform-aws-kops-metadata/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-metadata.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-metadata)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"kops_metadatas\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-kops-metadata.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "0-3": "Yes",
    "1-3": "No",
    "2-3": "No",
    "3-3": "No",
    "4-3": "No",
    "0-2": "Name of the Kops DNS zone",
    "1-2": "Set to `false` to prevent the module from creating or accessing any resources",
    "2-2": "Bastion server subdomain name in the Kops DNS zone",
    "3-2": "K8s masters subdomain name in the Kops DNS zone",
    "4-2": "K8s nodes subdomain name in the Kops DNS zone",
    "4-1": "`nodes`",
    "3-1": "`masters`",
    "2-1": "`bastion`",
    "1-1": "`true`",
    "0-1": "``",
    "4-0": "`nodes_name`",
    "3-0": "`masters_name`",
    "2-0": "`bastion_name`",
    "1-0": "`enabled`",
    "0-0": "`dns_zone`"
  },
  "cols": 4,
  "rows": 5
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "`vpc_id`",
    "1-0": "`private_subnet_ids`",
    "2-0": "`utility_subnet_ids`",
    "3-0": "`bastion_security_group_arn`",
    "4-0": "`bastion_security_group_id`",
    "5-0": "`masters_security_group_arn`",
    "6-0": "`masters_security_group_id`",
    "7-0": "`nodes_security_group_arn`",
    "8-0": "`nodes_security_group_id`",
    "9-0": "`masters_role_name`",
    "10-0": "`masters_role_arn`",
    "11-0": "`nodes_role_name`",
    "12-0": "`nodes_role_arn`",
    "12-1": "Kops nodes Role ARN",
    "11-1": "Kops nodes Role name",
    "10-1": "Kops masters Role ARN",
    "9-1": "Kops masters Role name",
    "8-1": "K8s nodes Security Group ID",
    "7-1": "K8s nodes Security Group ARN",
    "6-1": "K8s masters Security Group ID",
    "5-1": "K8s masters Security Group ARN",
    "4-1": "Bastion server Security Group ID",
    "3-1": "Bastion server Security Group ARN",
    "2-1": "Utility submets IDs in the VPC",
    "1-1": "Private subnets IDs in the VPC",
    "0-1": "Kops VPC ID"
  },
  "cols": 2,
  "rows": 13
}
[/block]