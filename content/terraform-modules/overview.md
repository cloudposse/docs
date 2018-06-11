---
title: Terraform Modules Overview
description: 'Terraform modules are the best way to encapsulate "business logic" and "Best Practices" for provisioning infrastructure.'
weight: -3
---

![HashiCorp Terraform](/assets/774b11e-terraform.png)

Terraform modules are the best way to encapsulate "business logic" and "Best Practices" for provisioning infrastructure. Terraform modules are used almost like functions in `terraform`; that is, they take inputs (aka `variables`) and produce some `outputs`.

# Features

- Easily version pin infrastructure
- Useful for staging changes across infrastructure
- [Public module registry](https://registry.terraform.io) makes it easy to find modules
- Distributed using `git` repos

# Examples

Here are some perfect examples of highly reusable, composable terraform modules:

- [`terraform-aws-key-pair`](https://github.com/cloudposse/terraform-aws-key-pair) - Automatically Generate SSH Key Pairs (Public/Private Keys)
- [`terraform-aws-rds`](https://github.com/cloudposse/terraform-aws-rds) - Provision an RDS instance along with subnets, security groups and hostname
- [`terraform-aws-s3-log-storage`](https://github.com/cloudposse/terraform-aws-s3-log-storage) - create an encrypted S3 bucket with log retention policies. It's suitable for receiving logs from other AWS services such as S3, CloudFront, and CloudTrails.

# Limitations

- The `count` parameter cannot be used on modules
- Cannot pass modules as inputs to other modules

# Resources

- [Module Usage](https://www.terraform.io/docs/modules/usage.html)
- [Creating Modules](https://www.terraform.io/docs/modules/create.html)
