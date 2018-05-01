---
title: "terraform-aws-route53-alias"
excerpt: "Terraform module that implements \"vanity\" host names (e.g. `brand.com`) as `ALIAS` records to another Route53 DNS resource record (e.g. ELB/ALB, S3 Bucket Endpoint or CloudFront Distribution).\nUnlike `CNAME` records, the synthetic `ALIAS` record works with zone apexes."
---
# Terraform AWS Route53 Alias 
[block:parameters]
{
  "data": {
    "0-0": "GitHub Repo",
    "1-0": "Terraform Module",
    "2-0": "Release",
    "3-0": "Build Status",
    "0-1": "https://github.com/cloudposse/terraform-aws-route53-alias",
    "1-1": "terraform-aws-route53-alias",
    "2-1": "[![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-route53-cluster-hostname.svg)](https://github.com/cloudposse/terraform-aws-route53-cluster-hostname/releases)",
    "3-1": "[![Build Status](https://travis-ci.org/cloudposse/terraform-aws-route53-alias.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-route53-alias)"
  },
  "cols": 2,
  "rows": 4
}
[/block]
# Usage

This will define a `A` resource record for `www.example.com` as an alias of the `aws_elb.example.dns_name`.
[block:code]
{
  "codes": [
    {
      "code": "module \"production_www\" {\n  source          = \"git::https://github.com/cloudposse/terraform-aws-route53-alias.git?ref=master\"\n  aliases         = [\"www.example.com.\", \"static1.cdn.example.com.\", \"static2.cdn.example.com\"]\n  parent_zone_id  = \"${var.parent_zone_id}\"\n  target_dns_name = \"${aws_elb.example.dns_name}\"\n  target_zone_id  = \"${aws_elb.example.zone_id}\"\n}",
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
    "0-0": "`aliases`",
    "1-0": "`parent_zone_id`",
    "2-0": "`parent_zone_name`",
    "3-0": "`target_dns_name`",
    "4-0": "`target_zone_id`",
    "5-0": "`evaluate_target_health`",
    "5-1": "`false`",
    "4-1": "``",
    "3-1": "``",
    "2-1": "``",
    "1-1": "``",
    "0-1": "`[]`",
    "5-2": "Set to true if you want Route 53 to determine whether to respond to DNS queries",
    "4-2": "ID of target resource (e.g. ALB,ELB)",
    "3-2": "DNS-name of target resource (e.g. ALB,ELB)",
    "2-2": "Name of the hosted zone to contain this record (or specify `parent_zone_id`)",
    "1-2": "ID of the hosted zone to contain this record  (or specify `parent_zone_name`)",
    "0-2": "List of aliases",
    "0-3": "Yes",
    "1-3": "Yes",
    "2-3": "Yes",
    "3-3": "Yes",
    "4-3": "Yes",
    "5-3": "No"
  },
  "cols": 4,
  "rows": 6
}
[/block]
# Outputs
[block:parameters]
{
  "data": {
    "h-0": "Name",
    "h-1": "Description",
    "2-1": "Name of the hosted zone to contain this record",
    "1-1": "ID of the hosted zone to contain this record",
    "0-1": "List of DNS-records",
    "0-0": "`hostnames`",
    "1-0": "`parent_zone_id`",
    "2-0": "`parent_zone_name`"
  },
  "cols": 2,
  "rows": 3
}
[/block]