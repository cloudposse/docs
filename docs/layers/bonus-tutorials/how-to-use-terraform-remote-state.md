---
title: "Use Terraform Remote State"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1193738389/How+to+Use+Terraform+Remote+State
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-use-terraform-remote-state.md
---

# How to Use Terraform Remote State

## Problem

One of the well-established best-practices for managing large-scale infrastructures with terraform is to break the state into multiple smaller “root modules” each having their own terraform state and independent SDLC, what we call [Components](/components). But the problem then arises that you cannot directly access the properties of a resource that was provisioned (e.g. the `vpc_id`). One option is just to copy and paste 🍝  the settings from component to component, but this is error-prone and far from DRY.

To solve this, Terraform has the concept of “remote state” which can be accessed using the `terraform_remote_state` [data source](https://www.terraform.io/docs/language/state/remote-state-data.html). All a root module needs to do is add an `output { ... }` for every thing it wants to export. However, knowing how to access the remote state in S3 requires a deep understanding of the [Structure of Terraform S3 State Backend Bucket](/reference-architecture/reference/structure-of-terraform-s3-state-backend-bucket) used by terraform to manage state. It’s easy to get it wrong, and the consequences of referencing the values from the wrong state can be catastrophic.

## Solution

Cloud Posse maintains a “remote state” module that is  💯  aware of all [Stacks](/fundamentals/stacks) and is, therefore, able to abstract all this complexity down to a simple module invocation. Using this module, it’s almost as convenient as using the native resources directly.

:::tip
Use the Cloud Posse `remote-state` module to seamlessly access the remote state of any component from any stack in any region or account.

:::

The `remote-state` submodule of the `terraform-yaml-stack-config` module accepts a `component` and a `stack` name and returns remote state outputs for the component.

The module supports `s3`, `remote` (Terraform Cloud), and `static` backends.

### Usage

The following example passes a `component` config and returns remote state outputs from the `s3` backend for the `vpc` Terraform component in the current stack. Passing the `stack` argument, we could request the outputs from any other stack.

:::info
Our convention is to put all usage of `remote-state` into a single file called `remote-state.tf` so it’s clear what are the external dependencies of the module

:::

```
# remote-state.tf
module "vpc" {
  source  = "cloudposse/stack-config/yaml//modules/remote-state"
  version = "0.21.1"

  component = "vpc"
  stack     = "<stack>"

  context = module.this.context
}
```

:::caution
When upstream components are updated, dependent components should be replanned.  Be sure to read [How to Enable Spacelift Drift Detection](/reference-architecture/how-to-guides/integrations/spacelift/how-to-enable-spacelift-drift-detection) to mitigate this with continuous reconciliation, and[How to Manage Explicit Component Dependencies with Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/how-to-manage-explicit-component-dependencies-with-spacelift) to ensure explicit dependencies are defined.

:::

### State Backend Configuration

The backend type (`s3`) and backend configuration for the components are defined in the stack YAML config files. A global backend configuration is typically defined in the `globals.yaml` file and then overridden in each components' catalog configuration to define the `workspace_key_prefix`.

```
# globals.yaml
terraform:
  backend_type: s3 # s3, remote, static, vault, etc.
  backend:
    s3:
      encrypt: true
      bucket: "acme-mgmt-uw2-root-tfstate"
      key: "terraform.tfstate"
      dynamodb_table: "acme-mgmt-uw2-root-tfstate-lock"
      profile: "acme-mgmt-gbl-root-terraform"
      acl: "bucket-owner-full-control"
      region: "us-west-2"
    remote: {}
    vault: {}
    static: {}
```

## References

- [https://www.hashicorp.com/resources/evolving-infrastructure-terraform-opencredo](https://www.hashicorp.com/resources/evolving-infrastructure-terraform-opencredo)

- [https://www.terraform.io/docs/language/state/remote-state-data.html](https://www.terraform.io/docs/language/state/remote-state-data.html)

- [https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/remote-state](https://github.com/cloudposse/terraform-yaml-stack-config/tree/main/modules/remote-state)


