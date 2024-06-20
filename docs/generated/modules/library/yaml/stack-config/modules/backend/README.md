---
title: backend
sidebar_label: backend
sidebar_class_name: command
description: backend
custom_edit_url: https://github.com/cloudposse/terraform-yaml-stack-config/blob/main/modules/backend/README.md
---

# backend

Terraform module that accepts stack configuration and returns backend config for a component.

## Usage

The following example loads the stack config `my-stack` (which in turn imports other YAML config dependencies)
and returns the backend config for the component `my-vpc`.

  ```hcl
    module "backend" {
      source = "cloudposse/stack-config/yaml//modules/backend"
      # version     = "x.x.x"
    
      stack                   = "my-stack"
      component               = "my-vpc"
    
      context = module.this.context
    }
  ```

The example returns the following `backend` configuration:

```hcl
  backend_type = s3

  backend = {
    "acl" = "bucket-owner-full-control"
    "bucket" = "eg-ue2-root-tfstate"
    "dynamodb_table" = "eg-ue2-root-tfstate-lock"
    "encrypt" = true
    "key" = "terraform.tfstate"
    "region" = "us-east-2"
    "role_arn" = "arn:aws:iam::xxxxxxxxxxxx:role/eg-gbl-root-terraform"
    "workspace_key_prefix" = "vpc"
  }
```

See [examples/complete](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/backend/../../examples/complete) for more details.

