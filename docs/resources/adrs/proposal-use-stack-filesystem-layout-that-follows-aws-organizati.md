---
title: "Proposal: Use Stack Filesystem Layout That Follows AWS Organization Conventions"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1333395457/Proposal%3A+Use+Stack+Filesystem+Layout+That+Follows+AWS+Organization+Conventions
sidebar_position: 200
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/proposal-use-stack-filesystem-layout-that-follows-aws-organizati.md
---

# Proposal: Use Stack Filesystem Layout That Follows AWS Organization Conventions
**Date**: **27 May 2022**

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

- The proposal has already been adopted, and this ADR needs to be updated to reflect the final decision.

:::

## Status
**DRAFT**

## Decision
Use Option 4: Use an organization directory.

## Problem
We have stacks defined all over the place. It’s not clear what is a top-level stack and what is imported. It’s not clear where to define something and where a service is deployed. There are too many ways to do things and we haven’t standardized how we organize configurations across customers.

## Context

## Considered Options

### Option 1: Current

- `stacks/catalog`

- `stacks/<tenant>`

- `stacks/<env>`

```
✗ tree -L 2 stacks
stacks
├── catalog
│   ├── account-map.yaml
│   ├── ...
│   └── waf.yaml
├── core
│   ├── gbl
│   ├── globals.yaml
│   ├── ue1
│   └── ue2
├── gbl
│   ├── artifacts.yaml
│   ...
│   └── staging.yaml
├── globals.yaml
├── plat
│   ├── gbl
│   ├── globals.yaml
│   └── ue2
├── ue1
│   └── globals.yaml
└── ue2
    ├── audit.yaml
    ...
    └── staging.yaml
```

### Option 2: Put region within catalog

- `stacks/catalog/<env>`

- `stacks/<tenant>`

```
✗ tree -L 3 stacks --dirsfirst
stacks
├── catalog
│   ├── argocd
│   │   └── repo
...
│   ├── gbl
│   │   ├── artifacts.yaml
...
│   │   └── staging.yaml
│   ├── s3-bucket
│   ├── ue1
│   │   └── globals.yaml
│   ├── ue2
│   │   ├── audit.yaml
│   │   ├── auto.yaml
│   │   ├── corp.yaml
│   │   ├── dev.yaml
│   │   ├── globals.yaml
│   │   ├── marketplace.yaml
│   │   ├── network.yaml
│   │   ├── prod.yaml
│   │   ├── root.yaml
│   │   ├── sandbox.yaml
│   │   └── staging.yaml
│   ├── account-map.yaml
...
│   └── waf.yaml
├── core
│   ├── gbl
│   │   ├── artifacts.yaml
...
│   │   └── security.yaml
│   ├── ue1
│   │   ├── globals.yaml
│   │   └── public.yaml
│   ├── ue2
│   │   ├── audit.yaml
...
│   │   └── root.yaml
│   └── globals.yaml
├── plat
│   ├── gbl
│   │   ├── dev.yaml
...
│   │   └── staging.yaml
│   ├── ue2
│   │   ├── dev.yaml
...
│   │   └── staging.yaml
│   └── globals.yaml
└── globals.yaml
```

### Option 3: Put root level stacks in order tenant/account/region instead of tenant/region/account

- `stacks/catalog`

- `stacks/mixins/<env>`

- `stacks/<tenant>`

```
✗ tree -L 3 stacks --dirsfirst
stacks
├── catalog
│   ├── argocd
...
│   └── waf.yaml
├── mixins
│   ├── gbl
│   │   ├── artifacts.yaml
...
│   │   └── staging.yaml
│   ├── ue1
│   │   └── globals.yaml
│   └── ue2
│       ├── audit.yaml
...
│       └── staging.yaml
├── plat
│   ├── gbl
│   │   ├── dev.yaml
...
│   │   └── staging.yaml
│   ├── ue2
│   │   ├── dev.yaml
...
│   │   └── staging.yaml
│   └── globals.yaml
├── tenants
│   ├── core
│   │   ├── gbl
│   │   ├── ue1
│   │   ├── ue2
│   │   └── globals.yaml
│   └── plat
│       ├── gbl
│       ├── ue2
│       └── globals.yaml
└── globals.yaml

```

### Option 4: Use an organization directory

Use a filesystem hierarchy that mirrors the AWS hierarchy: Organization → OU → Account → Region → Resources

- `stacks/catalog/`

- e.g. `eks/cluster.yaml`

- `stacks/mixins/`

- e.g. `regions/us-east-1.yaml`

- `stacks/orgs/<namespace>/<ou>/<account>/<region>.yaml`

| |  | |
| ----- | ----- | ----- |
|namespace | The namespace for the organization | |
|ou | Typically the tenant name | |
|account | The stage within the tenant | |
|region | The canonical AWS region | |

Use fully spelled out canonical region name (e.g. `us-east-1`)

Use `global-region.yaml` for resources that are not tied to any particular region (e.g. Route53).

Use `_defaults.yaml` for any other default settings.

## Decision

**DECIDED**:

## Consequences

-

## References

-


