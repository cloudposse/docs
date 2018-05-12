---
title: terraform-aws-kops-chart-repo
description: >-
  Terraform module to provision an S3 bucket for [Helm](https://helm.sh/) chart
  repository, and an IAM role and policy with permissions for k8s nodes to
  access the bucket.
---

# Terraform AWS Kops Chart Repo

|                  |                                                                                                                                                                        |
|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | <https://github.com/cloudposse/terraform-aws-kops-chart-repo>                                                                                                          |
| Terraform Module | terraform-aws-kops-chart-repo                                                                                                                                          |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-kops-chart-repo.svg)](https://github.com/cloudposse/terraform-aws-kops-chart-repo/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-kops-chart-repo.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-kops-chart-repo)    |

The module uses [terraform-aws-kops-metadata](https://github.com/cloudposse/terraform-aws-kops-metadata) to lookup resources within a Kops cluster for easier integration with Terraform.

# Usage

## HCL

```hcl
module "kops_chart_repo" {
  source       = "git::https://github.com/cloudposse/terraform-aws-kops-chart-repo.git?ref=master"
  namespace    = "cp"
  stage        = "prod"
  name         = "domain.com"
  nodes_name   = "nodes"

  tags = {
    Cluster = "k8s.domain.com"
  }
}
```

# Variables

| Name         | Default | Description                                                                 | Required |
|:-------------|:--------|:----------------------------------------------------------------------------|:---------|
| `namespace`  | ``      | Namespace (_e.g._ `cp` or `cloudposse`)                                     | Yes      |
| `stage`      | ``      | Stage (_e.g._ `prod`, `dev`, `staging`)                                     | Yes      |
| `name`       | ``      | Name of the Kops DNS zone (_e.g._ `domain.com`)                             | Yes      |
| `attributes` | `[]`    | Additional attributes (_e.g._ `policy` or `role`)                           | No       |
| `tags`       | `{}`    | Additional tags (_e.g._ `map("BusinessUnit","XYZ")`                         | No       |
| `delimiter`  | `-`     | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |
| `nodes_name` | `nodes` | k8s nodes subdomain name in the Kops DNS zone                               | No       |

# Outputs

| Name                 | Description           |
|:---------------------|:----------------------|
| `bucket_domain_name` | S3 bucket domain name |
| `bucket_id`          | S3 bucket ID          |
| `bucket_arn`         | S3 bucket ARN         |
| `role_name`          | IAM role name         |
| `role_unique_id`     | IAM role unique ID    |
| `role_arn`           | IAM role ARN          |
| `policy_name`        | IAM policy name       |
| `policy_id`          | IAM policy ID         |
| `policy_arn`         | IAM policy ARN        |
