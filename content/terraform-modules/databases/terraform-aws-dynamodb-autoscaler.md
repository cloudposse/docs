---
title: "terraform-aws-dynamodb-autoscaler"
description: "Terraform module to provision DynamoDB autoscaler."
---
# Terraform AWS DynamoDB Autoscaler

|                  |                                                                                                                                                                                |
|:-----------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GitHub Repo      | https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler                                                                                                                |
| Terraform Module | terraform-aws-dynamodb-autoscaler                                                                                                                                              |
| Release          | [![Release](https://img.shields.io/github/release/cloudposse/terraform-aws-dynamodb-autoscaler.svg)](https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler/releases) |
| Build Status     | [![Build Status](https://travis-ci.org/cloudposse/terraform-aws-dynamodb-autoscaler.svg?branch=master)](https://travis-ci.org/cloudposse/terraform-aws-dynamodb-autoscaler)    |


Autoscaler scales up/down the provisioned IOPS for a DynamoDB table based on the load.

# Usage

Include this module in your existing terraform code:

##### HCL
```hcl
module "dynamodb_autoscaler" {
  source                           = "git::https://github.com/cloudposse/terraform-aws-dynamodb-autoscaler.git?ref=master"
  domain_name                      = "example.com"
  proces_domain_validation_options = "true"
  ttl                              = "300"
}
```

# Variables

| Name                           | Default | Description                                                                 | Required |
|:-------------------------------|:--------|:----------------------------------------------------------------------------|:---------|
| `namespace`                    | ``      | Namespace (_e.g._ `cp` or `cloudposse`)                                     | Yes      |
| `autoscale_read_target`        | `10`    | The target value for DynamoDB read autoscaling                              | No       |
| `autoscale_min_read_capacity`  | `5`     | DynamoDB autoscaling min read capacity                                      | No       |
| `autoscale_max_read_capacity`  | `20`    | DynamoDB autoscaling max read capacity                                      | No       |
| `autoscale_min_write_capacity` | `5`     | DynamoDB autoscaling min write capacity                                     | No       |
| `autoscale_max_write_capacity` | `20`    | DynamoDB autoscaling max write capacity                                     | No       |
| `enabled`                      | `true`  | Set to false to prevent the module from creating any resources              | No       |
| `stage`                        | ``      | Stage (_e.g._ `prod`, `dev`, `staging`)                                     | Yes      |
| `name`                         | ``      | Name  (_e.g._ `app` or `cluster`)                                           | Yes      |
| `dynamodb_table_name`          | ``      | DynamoDB table name                                                         | Yes      |
| `dynamodb_table_arn`           | ``      | DynamoDB table ARN                                                          | Yes      |
| `attributes`                   | `[]`    | Additional attributes (_e.g._ `policy` or `role`)                           | No       |
| `tags`                         | `{}`    | Additional tags  (_e.g._ `map("BusinessUnit","XYZ")`                        | No       |
| `delimiter`                    | `-`     | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |
| `autoscale_write_target`       | `10`    | Delimiter to be used between `namespace`, `stage`, `name`, and `attributes` | No       |
