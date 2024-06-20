---
title: spacelift
sidebar_label: spacelift
sidebar_class_name: command
description: spacelift
custom_edit_url: https://github.com/cloudposse/terraform-yaml-stack-config/blob/main/modules/spacelift/README.md
---

# spacelift

Terraform module that accepts infrastructure stack configurations and transforms it into Spacelift stacks.

## Usage

The following example loads the infrastructure YAML stack configs and returns Spacelift stack configurations:


  ```hcl
    module "spacelift" {
      source = "../../modules/spacelift"
  
      stack_config_path_template        = "stacks/%s.yaml"
      component_deps_processing_enabled = true
    
      context = module.this.context
    }
  ```

See [examples/spacelift](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/spacelift/../../examples/spacelift) for more details.

