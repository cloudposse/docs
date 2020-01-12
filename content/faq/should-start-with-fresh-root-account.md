---
title: "Do you recommend starting with a fresh root account?"
description: "We recommend starting fresh with a completely clean account provisioned 100% from the ground up using Infrastructure as Code."
tags:
- root account
- AWS
- Terraform
- Infrastructure as Code
---

## Question

Do you recommend starting with a fresh root account, or building out of our current root AWS account?


## Answer

We recommend starting fresh with a completely clean account provisioned 100% from the ground up using automation tools like Terraform and consistent naming conventions that are programmatically generated .

This is not a hard requirement to "start fresh with AWS accounts." It really depends on what things look like. If there's a lot of cruft, we like to start clean. It's ultimately based on your preference. By starting completely fresh, we can still peer VPCs to obtain DB access and setup whitelists for cross-account access to Lambdas, KMS keys, and DynamoDB tables.

We also eliminate naming collisions or impact to  production systems.
