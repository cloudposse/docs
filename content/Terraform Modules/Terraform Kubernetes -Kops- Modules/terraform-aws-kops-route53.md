---
title: "terraform-aws-kops-route53"
excerpt: "Terraform module to lookup an IAM role associated with `kops` masters, and attach an IAM policy to the role with permissions to modify Route53 record sets."
---
# Terraform AWS Kops Route53 
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-kops-route53",
    "1-1": "terraform-aws-kops-route53",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-route53.svg)](https://github.com/cloudposse/terraform-aws-kops-route53/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-route53.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-route53)"
  },
  "cols": 2,
  "rows": 4
}
[/block]

It provides the IAM permissions needed by [route53-kubernetes](https://github.com/cloudposse/route53-kubernetes) for `kops`.

This is useful to make Kubernetes services discoverable via AWS DNS services.

# Usage
[block:code]
{
  "codes": [
    {
      "code": "module \"kops_route53\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-kops-route53.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
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
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "No",
    "4-3": "No",
    "5-3": "No",
    "6-3": "No",
    "6-2": "K8s masters subdomain name in the Kops DNS zone",
    "5-2": "Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`",
    "4-2": "Additional tags  (_e.g._ `map(\"Cluster\",\"k8s.domain.com\")`",
    "3-2": "Additional attributes (_e.g._ `policy` or `role`)",
    "2-2": "Name (_e.g._ `route53`)",
    "1-2": "Stage (_e.g._ `prod`, `dev`, `staging`)",
    "0-2": "Namespace (_e.g._ `cp` or `cloudposse`)",
    "0-1": "``",
    "1-1": "``",
    "2-1": "``",
    "3-1": "`[]`",
    "4-1": "`{}`",
    "5-1": "`-`",
    "6-1": "`masters`",
    "6-0": "`masters_name`",
    "5-0": "`delimiter`",
    "4-0": "`tags`",
    "3-0": "`attributes`",
    "2-0": "`name`",
    "1-0": "`stage`",
    "0-0": "`namespace`"
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
    "0-0": "`policy_id`",
    "1-0": "`policy_name`",
    "2-0": "`policy_arn`",
    "2-1": "Policy ARN",
    "1-1": "Policy name",
    "0-1": "Policy ID"
  },
  "cols": 2,
  "rows": 3
}
[/block]