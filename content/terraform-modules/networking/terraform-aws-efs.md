---
title: terraform-aws-efs
description: >-
  Terraform module to provision an AWS [`EFS`](https://aws.amazon.com/efs/)
  Network File System.
---

# Terraform AWS EFS

|                  |                                                                                                                                                |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-efs>                                                                                              |
| Terraform Module | terraform-aws-efs                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-efs.svg)](https://github.com/cloudposse/terraform-aws-efs/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-efs.svg)](https://travis-ci.org/cloudposse/terraform-aws-efs)                  |

# Usage

Include this repository as a module in your existing terraform code:

## HCL

```hcl
module "efs" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-efs.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name               | Default   | Description                                                     | Required |
|:-------------------|:----------|:----------------------------------------------------------------|:---------|
| namespace          | `global`  | Namespace (_e.g._ `cp` or `cloudposse`)                         |          |
| attributes         | `[]`      | Additional attributes (e.g. `policy` or `role`)                 |          |
| tags               | `{}`      | Additional tags (e.g. `map("BusinessUnit","XYZ")`               |          |
| delimiter          | `-`       | Delimiter to be used between `name`, `namespace`, `stage`, etc. |          |
| stage              | `default` | Stage (_e.g._ `prod`, `dev`, `staging`)                         |          |
| name               | `app`     | Name (_e.g._ `app` or `wordpress`)                              |          |
| security_groups    | `[]`      | AWS security group IDs to allow to connect to the EFS           |          |
| aws_region         |           | AWS region ID                                                   | Y        |
| vpc_id             |           | AWS VPC ID                                                      | Y        |
| subnets            |           | AWS subnet IDs                                                  | Y        |
| availability_zones |           | Availability Zone IDs                                           | Y        |
| zone_id            |           | Route53 dns zone ID                                             | Y        |

# Outputs

| Name             | Description                                                      |
|:-----------------|:-----------------------------------------------------------------|
| id               | EFS id                                                           |
| host             | Assigned DNS-record for the EFS                                  |
| mount_target_ids | List of IDs of the EFS mount targets (one per Availability Zone) |
| mount_target_ips | List of IPs of the EFS mount targets (one per Availability       |
