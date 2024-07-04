---
title: "Version Pin Components in Stack Configurations"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1183973747/How+to+Version+Pin+Components+in+Stack+Configurations
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-version-pin-components-in-stack-configurations.md
---

# How to Version Pin Components in Stack Configurations

## Problem
One of the common best practices in Infrastructure as Code is to use strict version pinning. But before we get into the details on how to do this, let’s note that in all of our components and modules, we refer to a module by specific version (e.g. `1.2.3`) or some semver expression (e.g. `~> 1.2.0`). However, in most of our stack configs, you’ll generally see that all stacks refer to the same exact version of a component (e.g. the same exact directory). Doesn’t this violate the principle of version pinning? Not exactly. Rather than pin each environment to a specific version, we’re saying we want to pin all environments to the same version (commit SHA), and instead, release to environments at the cadence we want. The driver behind this is we want all environments to converge on the same version and we want our tools (e.g. Spacelift) to tell us when they diverge. If on the other hand, we were version pinning each environment, then we would need to devise some other strategy to ensure that environments do not diverge.

With that said, there are still some situations where we want to forcibly diverge environments for an extended period of time. For example, perhaps some environment will be sunset in the near future, and keeping it current is not worth the effort. In this case, we might want to diverge so we can release hotfixes without needing to upgrade.

## Solution

:::tip
Simply version the directories of components by version and use the component inheritance documented in [How to Use Imports and Catalogs in Stacks](/reference-architecture/how-to-guides/tutorials/how-to-use-imports-and-catalogs-in-stacks).

:::

1. Version the component you want to diverge, e.g. rename `components/terraform/rds` to `components/terraform/rds@1.2.3`

2. Create a new version of the component, e.g. `components/terraform/rds@2.0.0`; we strongly recommend trying to keep an identical module interface (e.g. variable and outputs) between versions to reduce upgrade pains

3. Update the stack configuration for the environments to pin to a specific version of the component:

```
components:
  terraform:
    rds:                         # Keep our component name as `rds` so we can eventually upgrade to `2.0.0` and maintain state
      component: rds@1.2.3       # Use the component from `components/terraform/rds@1.2.3`
      vars:
        enabled: true            # Enable the component

```

What we like about this is it makes it exceptionally clear that there are now 2 (or more) versions of the same component. Also, it shows that you're incurring tech debt by taking on maintenance two similar but diverging components. Thus our recommendation is to diverge for only short periods of time.

:::info
There’s nothing special about the `rds@1.2.3` component name. You could use `rds-1.2.3` or `rds_1`, etc.

:::
Other hacks like Git submodules can be used to accomplish a similar outcome. We just cannot stress enough that practicing version pinning of components by the environment will lead to serious drift and offload the burden to keep the environments updated to engineers, rather than automation.

## Related
- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)

