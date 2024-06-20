---
title: "Use Imports and Catalogs in Stacks"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1183973406/How+to+Use+Imports+and+Catalogs+in+Stacks
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-use-imports-and-catalogs-in-stacks.md
---

# How to Use Imports and Catalogs in Stacks

## Problem

As infrastructure grows, we end up with hundreds or thousands of settings for components and stack configurations. If we copy and paste these settings everywhere, it’s error-prone and not DRY. What we really want to do is to define a sane set of defaults and override those defaults when we need them to change.

## Solution

:::tip
Use the `import` together with the `catalog` convention to write DRY configurations you can re-use any number of times.

:::

Using a component catalog, you can define the default values for all instances of a component across your stacks.

It is also important to note that you can provide default values for multiple instances of a component in a single stack using the component inheritance pattern via the `component` attribute.

```
# stacks/catalog/s3/bucket.yaml
components:
  terraform:
    s3-bucket:
      vars:
        # By convention, leave the component disabled in the catalog configuration (you can enable each inherited components individually)
        enabled: false
        user_enabled: false
        acl: private
        grants: null
        versioning_enabled: true
```

:::info
The `import` works by deep merging all files in the order they are defined using the [Mergo](https://github.com/imdario/mergo) library.

:::

Then inside of a stack configuration (`uw2-dev` for example), we can `import` the `catalog/s3/bucket` component configuration into our stack and use the `s3-bucket` component defined therein.

```
# stacks/uw2-dev.yaml
import:
  - catalog/s3/bucket

components:
  terraform:
    public-images:
      component: s3-bucket       # Inherit all the settings from the `s3-bucket` component
      vars:
        enabled: true            # Enable the component
        acl: public              # Override the ACL and make this a public bucket
        name: public-images      # Give it a unique name

    private-artifacts:
      component: s3-bucket       # Inherit all the settings from the `s3-bucket` component
      vars:
        enabled: true            # Enable the component
        name: private-artifacts  # Give it a unique name

    # ...
```

In the above example, we’re able to utilize the default settings provided via the `s3-bucket` base component from the catalog, while also creating multiple instances of the same component and providing our own overrides. This enables maximum reuse of global component configuration with minimal configuration.


