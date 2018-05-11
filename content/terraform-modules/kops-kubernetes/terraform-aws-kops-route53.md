---
title: terraform-aws-kops-route53
description: >-
  Terraform module to lookup an IAM role associated with `kops` masters, and
  attach an IAM policy to the role with permissions to modify Route53 record
  sets.
---

# Terraform AWS Kops Route53

|                  |                                                                                                                                                                  |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-kops-route53>                                                                                                       |
| Terraform Module | terraform-aws-kops-route53                                                                                                                                       |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-route53.svg)](https://github.com/cloudposse/terraform-aws-kops-route53/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-route53.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-route53)    |

It provides the IAM permissions needed by [route53-kubernetes](https://github.com/cloudposse/route53-kubernetes) for `kops`.

This is useful to make Kubernetes services discoverable via AWS DNS services.

# Usage

## HCL

```hcl
module "kops_route53" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-kops-route53.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name           | Default   | Description                                                                 | Required |
|:---------------|:----------|:----------------------------------------------------------------------------|:---------|
| `namespace`    |           | Namespace (_e.g._ `cp` or `cloudposse`)                                     | Yes      |
| `stage`        |           | Stage (_e.g._ `prod`, `dev`, `staging`)                                     | Yes      |
| `name`         |           | Name (_e.g._ `route53`)                                                     | Yes      |
| `attributes`   | `[]`      | Additional attributes (_e.g._ `policy` or `role`)                           | No       |
| `tags`         | `{}`      | Additional tags (_e.g._ `map("Cluster","k8s.domain.com")`                   | No       |
| `delimiter`    | `-`       | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |
| `masters_name` | `masters` | K8s masters subdomain name in the Kops DNS zone                             | No       |

# Outputs

| Name          | Description |
|:--------------|:------------|
| `policy_id`   | Policy ID   |
| `policy_name` | Policy name |
| `policy_arn`  | Policy ARN  |
