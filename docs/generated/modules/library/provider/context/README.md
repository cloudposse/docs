---
title: context
sidebar_label: context
sidebar_class_name: command
description: |-
  Terrform provider for managing a context in Terraform. A context, in this case, is a set of key-value pairs that can
  be used to enable or disable a module, as well as generating consistent resource names and tags for cloud resources.
custom_edit_url: https://github.com/cloudposse/terraform-provider-context/blob/main/README.yaml
---

# Module: `context`
Terrform provider for managing a context in Terraform. A context, in this case, is a set of key-value pairs that can
be used to enable or disable a module, as well as generating consistent resource names and tags for cloud resources.




## Introduction

Terrform provider for managing a context in Terraform. A context, in this case, is a set of key-value pairs that can
be used to enable or disable a module, as well as generating consistent resource names and tags for cloud resources.

This provider is intended to be a replacement for Cloud Posse's
[terraform-null-label](https://github.com/cloudposse/terraform-null-label) Terraform module as well as the
[context.tf](https://github.com/cloudposse/terraform-null-label/blob/main/exports/context.tf) export from that module,
which is copied into all of Cloud Posse's modules and components (root modules) via automation.

The provider is designed to be more flexible and easier to use than the `terraform-null-label` module, and to provide
a consistent way to manage context across all of Cloud Posse's modules and components via a provider, rather than a
Terraform module. This provider also allows flexibility in the property names that can be used to generate labels and
tags, where the previous module-based solution was limited to a fixed set of properties (namespace, tenant, stage,
environment, name and attributes).



## Usage

Here is how to use this provider in your own Terraform code:

```hcl
provider "context" {
  delimiter = "~"
  enabled   = false
  properties = {
    namespace   = {}
    tenant      = {}
    stage       = {}
    environment = {}
    name        = {}
  }

  property_order = ["namespace", "tenant", "stage", "environment", "name"]

  values = {
    "namespace"   = "cp"
    "tenant"      = "core"
    "stage"       = "prod"
    "environment" = "ue1"
    "name"        = "example"
  }
}

data "context_label" "example" {
  values = {
    "tenant" = "plat"
    "stage"  = "dev"
  }
}

data "context_label" "example" {
  template = "{{.namespace}}/{{.tenant}}/{{.stage}}/{{.name}}"
  values = {
    "tenant" = "plat"
    "stage"  = "dev"
  }
}
```
See the [Docs](https://github.com/cloudposse/terraform-provider-context/tree/main/docs) for additional information.




## Examples


Here are some additional examples:

- [`examples/data-sources/config`](https://github.com/cloudposse/terraform-provider-context/tree/main/examples/data-sources/config/)
- [`examples/data-sources/label-delimited`](https://github.com/cloudposse/terraform-provider-context/tree/main/examples/data-sources/label-delimited/)
- [`examples/data-sources/label-templated`](https://github.com/cloudposse/terraform-provider-context/tree/main/examples/data-sources/label-templated/)
- [`examples/data-sources/tags`](https://github.com/cloudposse/terraform-provider-context/tree/main/examples/data-sources/tags/)




