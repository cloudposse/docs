---
title: terraform-aws-kops-metadata
description: >-
  Terraform module to lookup resources within a
  [Kops](https://github.com/kubernetes/kops) cluster
---

# Terraform AWS Kops Metadata

|                  |                                                                                                                                                                    |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-kops-metadata>                                                                                                        |
| Terraform Module | terraform-aws-kops-metadata                                                                                                                                        |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-metadata.svg)](https://github.com/cloudposse/terraform-aws-kops-metadata/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-metadata.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-metadata)    |

# Usage

## HCL

```hcl
module "kops_metadatas" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-kops-metadata.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name           | Default   | Description                                                                   | Required |
|:---------------|:----------|:------------------------------------------------------------------------------|:---------|
| `dns_zone`     | ``        | Name of the Kops DNS zone                                                     | Yes      |
| `enabled`      | `true`    | Set to `false` to prevent the module from creating or accessing any resources | No       |
| `bastion_name` | `bastion` | Bastion server subdomain name in the Kops DNS zone                            | No       |
| `masters_name` | `masters` | K8s masters subdomain name in the Kops DNS zone                               | No       |
| `nodes_name`   | `nodes`   | K8s nodes subdomain name in the Kops DNS zone                                 | No       |

# Outputs

| Name                         | Description                       |
|:-----------------------------|:----------------------------------|
| `vpc_id`                     | Kops VPC ID                       |
| `masters_role_name`          | Kops masters Role name            |
| `masters_role_arn`           | Kops masters Role ARN             |
| `nodes_role_name`            | Kops nodes Role name              |
| `nodes_role_arn`             | Kops nodes Role ARN               |
| `private_subnet_ids`         | Private subnets IDs in the VPC    |
| `utility_subnet_ids`         | Utility submets IDs in the VPC    |
| `bastion_security_group_arn` | Bastion server Security Group ARN |
| `bastion_security_group_id`  | Bastion server Security Group ID  |
| `masters_security_group_arn` | K8s masters Security Group ARN    |
| `masters_security_group_id`  | K8s masters Security Group ID     |
| `nodes_security_group_arn`   | K8s nodes Security Group ARN      |
| `nodes_security_group_id`    | K8s nodes Security Group ID       |
