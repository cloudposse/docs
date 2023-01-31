---
title: example-module
sidebar_label: aws-amplify-app
sidebar_class_name: command
description: |-
  This is an example project to provide all the scaffolding for a typical well-built Cloud Posse
  Terraform module for AWS resources. It's a template repository you can
  use when creating new repositories. This is not a useful module by itself.
custom_edit_url: https://github.com/cloudposse/terraform-aws-amplify-app/edit/main/README.md
---

# Component: `example-module`
This is an example project to provide all the scaffolding for a typical well-built Cloud Posse
Terraform module for AWS resources. It's a template repository you can
use when creating new repositories. This is not a useful module by itself.







## Quick Start

1. Use this repo as a template for a new repo.
2. Check out the new repo and create a `git` branch to work on.
3. Replace the Terraform code at the root of the repo with the code you want to publish.
4. Replace the code in `examples/complete` with Terraform code that will make a good automated test.
   Please keep `context.tf` and `fixtures.us-east-2.tfvars` in place and change only `name`, leaving
   `region`, `namespace`, `environment`, and `stage` as is. Provide outputs that will be useful for testing.
5. Update `test/src/examples_complete_test.go` to verify the outputs of running `terraform apply` on `examples/complete`.
6. Run `make github/init` to update the repo with the current Cloud Posse framework files (e.g. `CODEOWNERS`).
7. Run `make pr/auto-format` to format the Terraform code and generate documentation.
8. Commit everything to `git` and open your first PR on the new repo.





