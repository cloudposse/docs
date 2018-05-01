---
title: "terraform-aws-route53-cluster-hostname"
excerpt: "Terraform module to define a consistent AWS Route53 hostname"
---
# Terraform AWS Route53 Cluster Hostname
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-route53-cluster-hostname",
    "1-1": "terraform-aws-route53-cluster-hostname",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-route53-cluster-hostname.svg)](https://github.com/cloudposse/terraform-aws-route53-cluster-hostname/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-hostname.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-hostname)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Variables
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Default",
    "h-2": "Description",
    "0-0": "enabled",
    "1-0": "name",
    "2-0": "namespace",
    "3-0": "records",
    "4-0": "stage",
    "5-0": "ttl",
    "6-0": "type",
    "7-0": "zone_id",
    "0-1": "\"true\"",
    "1-1": "\"dns\"",
    "2-1": "\"global\"",
    "3-1": "__REQUIRED__",
    "4-1": "\"default\"",
    "5-1": "\"300\"",
    "6-1": "\"CNAME\"",
    "7-1": "__REQUIRED__",
    "0-2": "Set to false to prevent the module from creating any resources"
  },
  "cols": 3,
  "rows": 8
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "0-0": "hostname"
  },
  "cols": 2,
  "rows": 1
}
[/block]