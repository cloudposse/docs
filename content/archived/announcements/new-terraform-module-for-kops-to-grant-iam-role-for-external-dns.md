---
title: "Terraform Module to Manage IAM for Kops External DNS"
description: "Terraform module to provision an IAM role for `external-dns` running in a Kops cluster, and attach an IAM policy to the role with permissions to modify Route53 recordsets."
publishDate: "2018-03-31 19:40:53"
---


## Overview

This module assumes you are running [external-dns](https://github.com/kubernetes-incubator/external-dns) in a Kops cluster.

It will provision an IAM role with the required permissions and grant the k8s masters the permission to assume it.

This is useful to make Kubernetes services discoverable via AWS DNS services.

The module uses [terraform-aws-kops-metadata](https://github.com/cloudposse/terraform-aws-kops-metadata) to lookup resources within a Kops cluster for easier integration with Terraform.


## Usage

```hcl
module "kops_external_dns" {
  source       = "git::https://github.com/cloudposse/terraform-aws-kops-external-dns.git?ref=master"
  namespace    = "cp"
  stage        = "prod"
  name         = "domain.com"
  masters_name = "masters"

  tags = {
    Cluster = "k8s.domain.com"
  }
}
```


## Variables

|  Name              |  Default     |  Description                                                                     | Required |
|:-------------------|:-------------|:---------------------------------------------------------------------------------|:--------:|
| `namespace`        | ``           | Namespace (_e.g._ `cp` or `cloudposse`)                                          | Yes      |
| `stage`            | ``           | Stage (_e.g._ `prod`, `dev`, `staging`)                                          | Yes      |
| `name`             | ``           | Name of the Kops DNS zone (e.g. `domain.com`)                                    | Yes      |
| `attributes`       | `[]`         | Additional attributes (_e.g._ `policy` or `role`)                                | No       |
| `tags`             | `{}`         | Additional tags  (_e.g._ `map("Cluster","k8s.domain.com")`                       | No       |
| `delimiter`        | `-`          | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes`      | No       |
| `masters_name`     | `masters`    | k8s masters subdomain name in the Kops DNS zone                                  | No       |


## Outputs

| Name               | Description          |
|:-------------------|:---------------------|
| `role_name`        | IAM role name        |
| `role_unique_id`   | IAM role unique ID   |
| `role_arn`         | IAM role ARN         |
| `policy_name`      | IAM policy name      |
| `policy_id`        | IAM policy ID        |
| `policy_arn`       | IAM policy ARN       |
