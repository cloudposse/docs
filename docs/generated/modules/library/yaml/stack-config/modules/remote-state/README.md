---
title: remote-state
sidebar_label: remote-state
sidebar_class_name: command
description: remote-state
custom_edit_url: https://github.com/cloudposse/terraform-yaml-stack-config/blob/main/modules/remote-state/README.md
---

# remote-state

Terraform module that accepts a component and a stack name and returns remote state outputs for the component.

The module supports `s3` and `remote` (Terraform Cloud) backends.

## Usage

The following example accepts a stack config `my-stack` (which in turn imports other YAML config dependencies)
and returns remote state outputs from the `s3` backend for `my-vpc` and `eks` Terraform components.

__NOTE:__ The backend type (`s3`) and backend configuration for the components are defined in the stack YAML config files.

  ```hcl
    module "remote_state_my_vpc" {
      source = "cloudposse/stack-config/yaml//modules/remote-state"
      # Cloud Posse recommends pinning every module to a specific version
      # version     = "x.x.x"
    
      stack                   = "my-stack"
      component               = "my-vpc"
    }
    
    module "remote_state_eks" {
      source = "cloudposse/stack-config/yaml//modules/remote-state"
      # Cloud Posse recommends pinning every module to a specific version
      # version     = "x.x.x"
    
      stack                   = "my-stack"
      component               = "eks"
    }
  ```

See [examples/remote-state](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/remote-state/../../examples/remote-state) for more details.

