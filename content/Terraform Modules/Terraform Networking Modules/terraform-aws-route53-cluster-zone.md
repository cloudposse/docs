---
title: "terraform-aws-route53-cluster-zone"
excerpt: "Terraform module to easily define consistent cluster domains on `Route53`."
---
# Terraform AWS Route53 Cluster Zone
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-route53-cluster-zone",
    "1-1": "terraform-aws-route53-cluster-zone",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-route53-cluster-zone.svg)](https://github.com/cloudposse/terraform-aws-route53-cluster-zone/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-zone.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-zone)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Usage

Define a cluster domain of `foobar.example.com` using a custom naming convention for `zone_name`. The `zone_name` variable is optional. It defaults to `$${stage}.$${parent_zone_name}`.

[block:code]
{
  "codes": [
    {
      "code": "module \"domain\" {\n  source                           = \"git::https://github.com/cloudposse/terraform-aws-route53-cluster-zone.git?ref=master\"\n  domain_name                      = \"example.com\"\n  proces_domain_validation_options = \"true\"\n  ttl                              = \"300\"\n}",
      "language": "json",
      "name": "HCL"
    }
  ]
}
[/block]