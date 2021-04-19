---
title: "Stacks"
icon: "fa fa-layer-group"
description: "Stacks are a way to express the complete infrastructure needed for an environment using a standard YAML configuration"
weight: 1
tags:
- yaml
- atmos
- configuration
- concept
---

# Background

Stacks are a central SweetOps abstraction layer that are used to instantiate components. They're a set of YAML files [that follow a standard schema](https://github.com/cloudposse/atmos/blob/master/docs/schema/stack-config-schema.json) to enable a **fully declarative description of your various environments**. This empowers you with the ability to separate your infrastructure's environment configuration settings from the business logic behind it (provided via components).

SweetOps utilizes YAML configuration for stacks because it's an easy to work with format that is nicely portable across multiple tools. The stack yaml format is natively supported today via [atmos](https://github.com/cloudposse/atmos), [the terraform-yaml-stack-config module](https://github.com/cloudposse/terraform-yaml-stack-config), and [Spacelift](https://spacelift.io) via [the terraform-spacelift-cloud-infrastructure-automation module](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation).

# Conventions

We have a number of important conventions around stacks that are worth noting.

## Stack Files

Stack files can be very numerous in large cloud environments (think many dozens to hundreds of stack files). To enable proper organization of stack files, SweetOps recommends the following:

* All stacks should be stored in a `stacks/` folder at the root of your infrastructure repository.
* Name individual environment stacks following the pattern of `$environment-$stage.yaml`
  * For example, `$environment` might be `ue2` (for `us-east-2`) and `$stage` might be `prod` which would result in `stacks/ue2-prod.yaml`
* For any **global** resources, such as Account Settings, IAM roles and policies, DNS records, or similar, the `environment` for the stack should be `gbl`.
  * For example, to deploy the `iam-delegated-roles` component (where all resources are global and not associated with an AWS region) to your production account, you should utilize a `stacks/gbl-prod.yaml` stack file.

## Shared Stack Configuration

When you have configuration that you want to share across various stacks, use catalogs. Catalogs are the SweetOps term for shared, reusable configuration.

By convention, all shared configuration for stacks is put in the `stacks/catalog/` folder, which can then be used in the root `stacks/` stack files via `import`. These files use the same stack schema. 

There are a few suggested shared catalog configurations that we recommend adopting:

* **Global Catalogs**: For any configuration to share across **all** stacks.
  * For example, you create a `stacks/catalogs/globals.yaml` file and utilize `import` wherever you need that catalog.
* **Environment Catalogs**: For any configuration you want to share across `environment` boundaries.
  * For example, to share configuration across `ue2-stage.yaml` and `uw2-stage.yaml` stacks, you create a `stacks/catalogs/stage-globals.yaml` file and utilize `import` in both the `ue2-stage.yaml` and `uw2-stage.yaml` stacks to pull in that catalog.
* **Stage Catalogs**: For any configuration that you want to share across `stage` boundaries.
  * For example, to share configuration across `ue2-dev.yaml`, `ue2-stage.yaml`, and `ue2-prod.yaml` stacks, you create a `stacks/catalogs/ue2-globals.yaml` file and `import` that catalog in the respective `dev`, `stage`, and `prod` stacks.
* **Base Components**: For any configuration that you want to share across all instances of a component.
  * For example, you're using the `eks` component and you want to ensure all of you EKS clusters are using the same Kubernetes version, you create a `stacks/catalogs/eks-globals.yaml` file which specifies the `eks` component's `vars.kubernetes_version`. You can then `import` that base component configuration in any stack file that uses the `eks` component.
  * More information in the below section.

## Component Inheritance

Using a component catalog, you can define the default values for all instances of a component across your stacks. But it is also important to note that you can provide default values for multiple instances of a component in a single stack using the component inheritance pattern via the `component` key / value:

```yaml
# stacks/catalog/component/s3-bucket.yaml
components:
  terraform:
    s3-bucket:
      vars:
        enabled: false
        user_enabled: false
        acl: private
        grants: null
        versioning_enabled: true
```

```yaml
# stacks/uw2-dev.yaml
import:
  - catalogs/s3-globals
  - catalogs/dev-globals
  - catalogs/uw2-globals

components:
  terraform:
    public-images:
      component: s3-bucket
      vars:
        enabled: true
        acl: public
        name: public-images

    export-data:
      component: s3-bucket
      vars:
        enabled: true
        name: export-data

    # ...
```

In the above example, we're able to utilize the default settings provided via the `s3-bucket` base component catalog, while also creating multiple instances of the same component and providing our own overrides. This enables maximum reuse of global component configuration.

## Terraform Workspace Names

`atmos` and accompanying terraform automation modules like [terraform-spacelift-cloud-infrastructure-automation](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation) will automatically create terraform [workspaces](https://www.terraform.io/docs/language/state/workspaces.html) when managing components. These workspaces derive their names from the stack name and the component name in question following this pattern: `$env-$stage-$component`. The result is workspace names like `ue2-dev-eks` or `uw2-prod-mq-broker`.

# Stack Schema

<!--
TODO: Is the vault backend supported as of today?
TODO: Should we mention the `remote` backend considering the current state of the TFC automation module?
-->

[The official JSON Schema document for Stacks can be found here](https://github.com/cloudposse/atmos/blob/master/docs/schema/stack-config-schema.json). The below is a walk through of a complete example utilizing all capabilities.

```yaml
# stacks/ue2-dev.yaml
s3-bucket:
      vars:
        enabled: false
        user_enabled: false
        acl: "private"
        grants: null
        policy: ""
        force_destroy: false
        versioning_enabled: true
        allow_encrypted_uploads_only: false
        lifecycle_rule_enabled: false
        noncurrent_version_glacier_transition_days: 30
        noncurrent_version_deeparchive_transition_days: 60
        noncurrent_version_expiration_days: 90
        standard_transition_days: 30
        glacier_transition_days: 60
        deeparchive_transition_days: 90
        enable_glacier_transition: false
        enable_deeparchive_transition: false
        enable_standard_ia_transition: false
        enable_current_object_expiration: false
        expiration_days: 90
        lifecycle_tags: {}
        block_public_acls: true
        block_public_policy: true
        ignore_public_acls: true
        restrict_public_buckets: true

# Imports enables shared configuration / settings across different stacks
# The referenced files are deep merged into this stack to support granular configuration capabilities
import:
  # Merge the below `stacks/catalog/*.yaml` files into this stack to provide any shared `vars` or `components.*` configuration
  - catalog/globals
  - catalog/ue2-globals
  - catalog/dev-globals

# `vars` provides shared configuration for all components -- both terraform + helmfile
vars:
  # Used to determine the name of the workspace (e.g. the 'dev' in 'ue2-dev')
  stage: dev
  # Used to determine the name of the workspace (e.g. the 'ue2' in 'ue2-dev')
  environment: ue2

# Define cross-cutting terraform configuration
terraform:
  # `terraform.vars` provides shared configuration for terraform components
  vars: {}

  # `backend_type` + `backend` provide configuration for the terraform backend you
  # would like to use for all components. This is typically defined in `globals.yaml`
  backend_type: s3 # s3, remote, vault
  backend:
    s3:
      encrypt: true
      bucket: "eg-uw2-root-tfstate"
      key: "terraform.tfstate"
      dynamodb_table: "eg-uw2-root-tfstate-lock"
      role_arn: "arn:aws:iam::999999999999:role/eg-gbl-root-terraform"
      acl: "bucket-owner-full-control"
      region: "us-east-2"
    remote: {}
    vault: {}

# Define cross-cutting helmfile configuration
helmfile:
  # `helmfile.vars` provides shared configuration for terraform components
  vars:
    account_number: "999999999999"

# Components are all the top-level units that make up this stack
components:

  # All terraform components should be listed under this section.
  terraform:

    # List one or more Terraform components here
    first-component:
      # Provide automation settings for this component
      settings:
        # Provide spacelift specific automation settings for this component
        # (Only relevant if utilizing terraform-spacelift-cloud-infrastructure-automation)
        spacelift:

          # Controls whether or not this workspace should be created
          # NOTE: If set to 'false', you cannot reference this workspace via `triggers` in another workspace!
          workspace_enabled: true

          # Override the version of Terraform for this workspace (defaults to the latest in Spacelift)
          terraform_version: 0.13.4

          # Which git branch trigger's this workspace
          branch: develop

          # Controls the `autodeploy` setting within this workspace (defaults to `false`)
          auto_apply: true

          # Add extra 'Run Triggers' to this workspace, beyond the parent workspace, which is created by default
          # These triggers mean this component workspace will be automatically planned if any of these workspaces are applied.
          triggers:
            - ue2-dev-second-component
            - gbl-root-example1

      # Set the Terraform input variable values for this component.
      vars:
        my_input_var: "Hello world! This is a value that needs to be passed to my `first-component` Terraform component."
        bool_var: true
        number_var: 47

        # Complex types like maps and lists are supported.
        list_var:
          - example1
          - example2

        map_var:
          key1: value1
          key2: value2


    # Every terraform component should be uniquely named and correspond to a folder in the `components/terraform/` directory
    second-component:
      vars:
        my_input_var: "Hello world! This is another example!"

    # You can also define component inheritance in stacks to enable unique workspace names or multiple usages of the same component in one stack.
    # In this example, `another-second-component` inherits from the base `second-component` component and overrides the `my_input_var` variable.
    another-second-component:
      component: second-component
      vars:
        my_input_var: "Hello world! This is an override."

  # All helmfile components should be listed under this section.
  helmfile:

    # Helmfile components should be uniquely named and correspond to a folder in the `components/helmfile/` directory
    # Helmfile components also support virtual components
    alb-controller:

      # Set the helmfile input variable values for this component.
      vars:
        installed: true
        chart_values:
          enableCertManager: true

# `workflows` enable the ability to define an ordered operation for `atmos` to accomplish
# See "Getting started with Atmos" documentation for full details: https://docs.cloudposse.com/tutorials/atmos-getting-started/
workflows:

  # `workflows` is a map where the key is the name of the workflow that you're defining
  deploy-eks-default-helmfiles:

    # `description` should provide useful information about what this workflow does
    description: Deploy helmfile charts in the specific order

    # `steps` defines the ordering of the jobs that you want to accomplish
    steps:

      # `job` entries defined `atmos` commands that you want to execute as part of the workflow
      - job: helmfile sync cert-manager
      - job: helmfile sync external-dns
      - job: helmfile sync alb-controller
      - job: helmfile sync metrics-server
      - job: helmfile sync ocean-controller
      - job: helmfile sync efs-provisioner
      - job: helmfile sync idp-roles
      - job: helmfile sync strongdm
      - job: helmfile sync reloader
      - job: helmfile sync echo-server
```
