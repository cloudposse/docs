---
title: terraform-aws-route53-cluster-zone
description: Terraform module to easily define consistent cluster domains on `Route53`.
---

# Terraform AWS Route53 Cluster Zone

|                  |                                                                                                                                                                                  |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-route53-cluster-zone>                                                                                                               |
| Terraform Module | terraform-aws-route53-cluster-zone                                                                                                                                               |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-route53-cluster-zone.svg)](https://github.com/cloudposse/terraform-aws-route53-cluster-zone/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-zone.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-zone)    |

# Usage

Define a cluster domain of `foobar.example.com` using a custom naming convention for `zone_name`. The `zone_name` variable is optional. It defaults to `$${stage}.$${parent_zone_name}`.

## HCL

```hcl
module "domain" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-route53-cluster-zone.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```
