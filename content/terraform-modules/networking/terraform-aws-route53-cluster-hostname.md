---
title: terraform-aws-route53-cluster-hostname
description: Terraform module to define a consistent AWS Route53 hostname
---

# Terraform AWS Route53 Cluster Hostname

|                  |                                                                                                                                                                                          |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-route53-cluster-hostname>                                                                                                                   |
| Terraform Module | terraform-aws-route53-cluster-hostname                                                                                                                                                   |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-route53-cluster-hostname.svg)](https://github.com/cloudposse/terraform-aws-route53-cluster-hostname/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-hostname.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-route53-cluster-hostname)    |

# Variables

| Name      | Default      | Description                                                    |
|:----------|:-------------|:---------------------------------------------------------------|
| enabled   | "true"       | Set to false to prevent the module from creating any resources |
| name      | "dns"        |                                                                |
| namespace | "global"     |                                                                |
| records   | **REQUIRED** |                                                                |
| stage     | "default"    |                                                                |
| ttl       | "300"        |                                                                |
| type      | "CNAME"      |                                                                |
| zone_id   | **REQUIRED** |                                                                |

# Outputs

| Name     | Description |
|:---------|:------------|
| hostname |             |
