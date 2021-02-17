---
title: "Root Module"
description: "Every Terraform configuration has at least one module, known as its root module, which consists of the resources defined in the .tf files in the main working directory. Root modules are the terraform configuration that we actually **apply**."
tags:
- Terraform
- Module
terms:
- Terraform
- Module
- Root Module
---
Terraform overloads the word "module", but it comes down to "root" and "child" modules. Root modules are the terraform working directory projects that we actually plan and apply while child modules are the reusable modules that we consume in root modules. [You can read more about this in Terraform documentation](https://www.terraform.io/docs/language/modules/index.html).
