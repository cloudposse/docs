---
title: terraform-aws-route53-alias
description: >-
  Terraform module that implements "vanity" host names (e.g. `brand.com`) as
  `ALIAS` records to another Route53 DNS resource record (e.g. ELB/ALB, S3
  Bucket Endpoint or CloudFront Distribution).

  Unlike `CNAME` records, the synthetic `ALIAS` record works with zone apexes.
---

# Terraform AWS Route53 Alias

|                  |                                                                                                                                                                                          |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-route53-alias>                                                                                                                              |
| Terraform Module | terraform-aws-route53-alias                                                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-route53-cluster-hostname.svg)](https://github.com/cloudposse/terraform-aws-route53-cluster-hostname/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-route53-alias.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-route53-alias)                          |

# Usage

This will define a `A` resource record for `www.example.com` as an alias of the `aws_elb.example.dns_name`.

## HCL

```hcl
module "production_www" {
  source          = "git::https://github.com/cloudposse/terraform-aws-route53-alias.git?ref=master"
  aliases         = ["www.example.com.", "static1.cdn.example.com.", "static2.cdn.example.com"]
  parent_zone_id  = "${var.parent_zone_id}"
  target_dns_name = "${aws_elb.example.dns_name}"
  target_zone_id  = "${aws_elb.example.zone_id}"
}
```

# Variables

| Name                     | Default | Description                                                                     | Required |
|:-------------------------|:--------|:--------------------------------------------------------------------------------|:---------|
| `aliases`                | `[]`    | List of aliases                                                                 | Yes      |
| `parent_zone_id`         | ``      | ID of the hosted zone to contain this record (or specify `parent_zone_name`)    | Yes      |
| `parent_zone_name`       | ``      | Name of the hosted zone to contain this record (or specify `parent_zone_id`)    | Yes      |
| `target_dns_name`        | ``      | DNS-name of target resource (e.g. ALB,ELB)                                      | Yes      |
| `target_zone_id`         | ``      | ID of target resource (e.g. ALB,ELB)                                            | Yes      |
| `evaluate_target_health` | `false` | Set to true if you want Route 53 to determine whether to respond to DNS queries | No       |

# Outputs

| Name               | Description                                    |
|:-------------------|:-----------------------------------------------|
| `hostnames`        | List of DNS-records                            |
| `parent_zone_id`   | ID of the hosted zone to contain this record   |
| `parent_zone_name` | Name of the hosted zone to contain this record |
