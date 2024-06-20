---
title: "Proposed: Use Strict Provider Pinning in Components"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1260617729/Proposed%3A+Use+Strict+Provider+Pinning+in+Components
sidebar_position: 200
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/proposed-use-strict-provider-pinning-in-components.md
---

# Proposed: Use Strict Provider Pinning in Components
**Date**: **11 Feb 2022**

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

:::

## Status
**DRAFT**

## Problem
New major provider versions can break planning and applying of terraform components/modules.

[https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.0.0](https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.0.0)

While we wait to upgrade broken modules to newer provider versions, we should come up with a solution that won’t break customer workflows.

Currently, we set this in both modules and components for most customers

```
required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0"
    }
  }
}
```

## Considered Options

### Option 1: Pinning Providers in Components to Major, Minor Versions

- The easiest way for Cloud Posse to distribute components with versions that have been tested in a particular configuration (E.g. as opposed to using `.terraform.lock.hcl`)

- Pin providers to major versions in downstream components for clients

```
required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}
```

### Option 2: Pinning Providers in Upstream Modules

:::info
Cloud Posse needs to do lower-bound pinning for terraform core version and AWS provider in our open source modules on `github.com/cloudposse`. We learned this lesson the hard way. The essence of the problem is that terraform computes the intersection of all supported provider versions and takes the highest number supported. If the sets are disjoint, it errors.

-
```
Error: Failed to query available provider packages

Could not retrieve the list of available versions for provider hashicorp/aws:
no available releases match the given constraints ~> 3.0, ~> 2.0
```

If we pin a module to `~> 3.0` it presents several problems when version 4.0 comes out:

- We cannot tell (without removing the version constraint) whether or not the module works with 4.0 as-is or needs modification.

- Anyone wanting to use version 4.0 cannot do so with this module or any module that uses it, even if it would otherwise work.

- This includes other Cloud Posse modules: if we want to upgrade another module to work with 4.0, we cannot do that if it uses any other modules pinned to `~> 3.0`

The net result is that as soon as 4.0 comes out, in practice we need to remove the `~> 3.0` pin anyway, just to see if the module needs modification, and more often than not it does not, so the pin has just created a lot of extra work for no real benefit. (If the code still works, then the pin did nothing but break it. If the code is broken at 4.0, then the best we can say is the pin makes it a little easier to see why the previously working code is now broken, but either way it is broken, so that is not great consolation.)

Therefore, Cloud Posse today by convention only does lower bound pinning in our open source module until all the modules are updated. We only bump the the lower bound when the code takes advantage of a new feature that requires it.

:::

- Pin providers to major versions in upstream modules

```
required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}
```

### Option 3: Pinning Providers in Components to Exact Versions

- This can also be done by committing the `.terraform.lock.hcl` file instead of ignoring it in `.gitignore` and using a github action to periodically update it.

- This can be done using a `required_providers` and using something like rennovatebot to update it

```
required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "= 3.70"
    }
  }
}
```

## Decision

- Use Option 1

## Consequences

- Update `providers.tf` in all components to follow this convention

- Something should still update the pinning when new providers are available.

## Related Documentation

- [Components](/components)

- [How to Keep Everything Up to Date](/reference-architecture/how-to-guides/upgrades/how-to-keep-everything-up-to-date)


