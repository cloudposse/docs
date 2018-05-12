---
title: "terraform-aws-dynamodb"
description: "Terraform module to provision a DynamoDB table with autoscaling."
---
# Terraform AWS DynamoDB

|                  |                                                                                                                                                          |
|:-----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-dynamodb                                                                                                     |
| Terraform Module | terraform-aws-dynamodb                                                                                                                                   |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-dynamodb.svg)](https://github.com/cloudposse/terraform-aws-dynamodb/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-dynamodb.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-dynamodb)    |


Autoscaler scales up/down the provisioned IOPS for the DynamoDB table based on the load.

# Usage

Include this module in your existing terraform code:


##### HCL
```hcl
module "dynamodb_table" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-dynamodb.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                           | Default | Description                                                                 | Required |
|:-------------------------------|:--------|:----------------------------------------------------------------------------|:---------|
| `namespace`                    | ``      | Namespace (_e.g._ `cp` or `cloudposse`)                                     | Yes      |
| `delimiter`                    | `-`     | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |
| `autoscale_write_target`       | `10`    | The target value for DynamoDB write autoscaling                             | No       |
| `autoscale_read_target`        | `10`    | The target value for DynamoDB read autoscaling                              | No       |
| `autoscale_min_read_capacity`  | `5`     | DynamoDB autoscaling min read capacity                                      | No       |
| `autoscale_max_read_capacity`  | `20`    | DynamoDB autoscaling max read capacity                                      | No       |
| `autoscale_min_write_capacity` | `5`     | DynamoDB autoscaling min write capacity                                     | No       |
| `autoscale_max_write_capacity` | `20`    | DynamoDB autoscaling max write capaci                                       | No       |
| `enable_autoscaler`            | `true`  | Flag to enable/disable DynamoDB autoscaling                                 | No       |
| `stage`                        | ``      | Stage (_e.g._ `prod`, `dev`, `staging`)                                     | Yes      |
| `name`                         | ``      | Name  (_e.g._ `app` or `cluster`)                                           | Yes      |
| `hash_key`                     | ``      | DynamoDB table Hash Key                                                     | Yes      |
| `range_key`                    | ``      | DynamoDB table Range Key                                                    | Yes      |
| `ttl_attribute`                | ``      | DynamoDB table TTL attribute                                                | No       |
| `enable_encryption`            | `true`  | Enable DynamoDB server-side encryption                                      | No       |
| `attributes`                   | `[]`    | Additional attributes (_e.g._ `policy` or `role`)                           | No       |
| `tags`                         | `{}`    | Additional tags  (_e.g._ `map("BusinessUnit","XYZ")`                        | No       |

# Outputs

| Name         | Description         |
|:-------------|:--------------------|
| `table_id`   | DynamoDB table ID   |
| `table_arn`  | DynamoDB table ARN  |
| `table_name` | DynamoDB table name |
