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
Terraform has two types of modules; the top-level module is always called the "root" module and the modules that are called from the root module are called "child" modules. Root modules are the most opinionated. They describe the architecture you want to deploy. It's these "root" modules that we actually deploy when we run the `terraform apply` command. The "root" modules may contain many child modules or none at all. The "child" modules reusable modules that we invoke in root modules. [You can read more about this in Terraform documentation](https://www.terraform.io/docs/language/modules/index.html). Generally, when we refer to "modules" we mean "child modules". 
