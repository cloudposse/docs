---
title: "Terraform Root Module"
description: "Every Terraform configuration has at least one module, known as its root module, which consists of the resources defined in the `.tf` files in the main working directory. Root modules are the terraform configuration that we actually **apply** and have terraform state."
tags:
- Terraform
- Module
- Component
terms:
- Terraform
- Module
- Root Module
---
Terraform overloads the word "module", but it comes down to "root" and "child" modules. Root modules are the most opinionated, top-level terraform modules (typically found in the current working directory). They describe the architecture you want to deploy. It's these "root" modules that we actually run `terraform plan` and `terraform apply` apply on, while child modules are the reusable modules that we invoke in root modules. [You can read more about this in Terraform documentation](https://www.terraform.io/docs/language/modules/index.html).
