---
title: settings
sidebar_label: settings
sidebar_class_name: command
description: settings
custom_edit_url: https://github.com/cloudposse/terraform-yaml-stack-config/blob/main/modules/settings/README.md
---

# settings

Terraform module that accepts stack configuration and returns deep-merged settings for a Terraform or helmfile component.

## Usage

The following example loads the stack config `my-stack` (which in turn imports other YAML config dependencies)
and returns settings for Terraform component `my-vpc`.

  ```hcl
    module "vars" {
      source = "cloudposse/stack-config/yaml//modules/settings"
      # version     = "x.x.x"
    
      stack_config_local_path = "./stacks"
      stack                   = "my-stack"
      component_type          = "terraform"
      component               = "my-vpc"
    
      context = module.this.context
    }
```

See [examples/complete](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/settings/../../examples/complete) for more details.

