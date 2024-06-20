---
title: glue-workflow
sidebar_label: glue-workflow
sidebar_class_name: command
description: glue-workflow
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-workflow/README.md
---

# glue-workflow

Terraform module to provision AWS Glue Workflows.

## Usage

```hcl
module "glue_workflow" {
  source = "cloudposse/glue/aws//modules/glue-workflow"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  workflow_name          = "geo"
  workflow_description   = "Glue workflow to process geo data"
  max_concurrent_runs    = 2
  default_run_properties = {}
}
```

