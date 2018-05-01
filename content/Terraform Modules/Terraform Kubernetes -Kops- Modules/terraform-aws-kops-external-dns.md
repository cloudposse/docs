---
title: "terraform-aws-kops-external-dns"
excerpt: "Terraform module to provision an IAM role for `external-dns` running in a Kops cluster, and attach an IAM policy to the role with permissions to modify Route53 record sets."
---
# Terraform AWS Kops Externa DNS


[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-kops-external-dns",
    "1-1": "terraform-aws-kops-external-dns ",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-external-dns.svg)](https://github.com/cloudposse/terraform-aws-kops-external-dns/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-external-dns.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-external-dns)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Overview

This module assumes you are running [external-dns](https://github.com/kubernetes-incubator/external-dns) in a Kops cluster.

It will provision an IAM role with the required permissions and grant the k8s masters the permission to assume it.

This is useful to make Kubernetes services discoverable via AWS DNS services.

The module uses [terraform-aws-kops-metadata](https://github.com/cloudposse/terraform-aws-kops-metadata) to lookup resources within a Kops cluster for easier integration with Terraform.


# Usage

[block:code]
{
  "codes": [
    {
      "code": "module \"kops_external_dns\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-kops-external-dns.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "h-3": "Required",
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "`namespace`",
    "1-0": "`stage`",
    "2-0": "`name`",
    "3-0": "`attributes`",
    "4-0": "`tags`",
    "5-0": "`delimiter`",
    "6-0": "`masters_name`",
    "6-1": "`masters`",
    "5-1": "`-`",
    "4-1": "`{}`",
    "3-1": "`[]`",
    "2-1": "``",
    "1-1": "``",
    "0-1": "``",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "2-2": "Name of the Kops DNS zone (e.g. `domain.com`)",
    "3-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "4-2": "Additional tags  (_e.g._ `map(\"Cluster\",\"k8s.domain.com\")`",
    "5-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "6-2": "k8s masters subdomain name in the Kops DNS zone",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No"
  },
  "cols": 4,
  "rows": 7
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-1": "IAM role name",
    "1-1": "IAM role unique ID",
    "2-1": "IAM role ARN",
    "3-1": "IAM policy name",
    "4-1": "IAM policy ID",
    "5-1": "IAM policy ARN",
    "5-0": "`policy_arn`",
    "0-0": "`role_name`",
    "1-0": "`role_unique_id`",
    "2-0": "`role_arn`",
    "3-0": "`policy_name`",
    "4-0": "`policy_id`"
  },
  "cols": 2,
  "rows": 6
}
[/block]