---
title: glue-schema
sidebar_label: glue-schema
sidebar_class_name: command
description: glue-schema
custom_edit_url: https://github.com/cloudposse/terraform-aws-glue/blob/main/modules/glue-schema/README.md
---

# glue-schema

Terraform module to provision AWS Glue Schemas.

## Usage

```hcl
module "glue_registry" {
  source = "cloudposse/glue/aws//modules/glue-registry"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  registry_name        = "analytics"
  registry_description = "Glue Registry for analytics"
}

module "glue_schema" {
  source = "cloudposse/glue/aws//modules/glue-schema"
  # Cloud Posse recommends pinning every module to a specific version
  # version     = "x.x.x"

  schema_name        = "geo"
  schema_description = "Glue Schema for geo data"
  registry_arn       = module.glue_registry.arn
  compatibility      = "NONE"
  data_format        = "JSON"
  schema_definition = "{\"type\": \"record\", \"name\": \"geo\", \"fields\": [ {\"name\": \"state\", \"type\": \"string\"}, {\"name\": \"city\", \"type\": \"string\"} ]}"
}
```

