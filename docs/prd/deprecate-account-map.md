# Deprecate Account-Map Documentation Updates

**Author:** Daniel Miller (@milldr)
**Date:** December 2025
**Status:** Draft
**Related:** [refarch-scaffold PR #818](https://github.com/cloudposse/refarch-scaffold/pull/818)

## Overview

The reference architecture is transitioning away from the `account-map` component and related identity components (`aws-teams`, `aws-team-roles`, `aws-saml`, `github-oidc-role`). This PRD outlines the documentation changes needed to reflect the new simplified architecture that uses:

- **Atmos Auth** with profiles instead of Leapp
- **Static `account_map` variable** instead of the `account-map` component
- **AWS SSO Permission Sets** for human users instead of `aws-teams`/`aws-team-roles`
- **`iam-role` component** for machine users instead of `github-oidc-role`
- **Atmos Pro** for CI/CD instead of legacy GitHub Actions workflows

## Goals

1. Update documentation to reflect the new architecture as the primary/recommended approach
2. Move legacy documentation to clearly marked sections for customers still using the old approach
3. Remove references to `core-identity` account (identity management now centralized in `core-root`)
4. Create new guides for Atmos Auth, profiles, and the simplified identity model
5. Update cold start/bootstrap documentation for the new workflow

## Files to Update

### High Priority - Identity Layer

These files directly describe identity management and need significant updates:

| File | Action | Notes |
|------|--------|-------|
| `docs/layers/identity/identity.mdx` | Update | Main identity overview - update for Atmos Auth |
| `docs/layers/identity/how-to-log-into-aws.mdx` | Rewrite | Replace Leapp with Atmos Auth |
| `docs/layers/identity/deploy.mdx` | Update | Remove aws-teams, aws-team-roles deployment |
| `docs/layers/identity/aws-sso.mdx` | Update | Add TerraformPlanAccess/TerraformApplyAccess/RootAccess |
| `docs/layers/identity/centralized-terraform-access.mdx` | Update | Update for iam-role component |
| `docs/layers/identity/docs/dynamic-terraform-roles.mdx` | Update/Move | Move to legacy, replace with iam-role approach |
| `docs/layers/identity/docs/aws-access-control-evolution.mdx` | Update | Add new evolution to account-map-less |
| `docs/layers/identity/tutorials/leapp/*.mdx` | Move | Move to legacy/optional section |
| `docs/layers/identity/optional/aws-saml.mdx` | Keep | Already optional, add deprecation note |

### High Priority - Accounts Layer

| File | Action | Notes |
|------|--------|-------|
| `docs/layers/accounts/accounts.mdx` | Update | Remove core-identity references |
| `docs/layers/accounts/deploy-accounts.mdx` | Update | Remove account-map deployment |
| `docs/layers/accounts/initialize-tfstate.mdx` | Update | Update for new tfstate-backend without account-map |
| `docs/layers/accounts/tutorials/cold-start.mdx` | Rewrite | Major update for new bootstrap workflow |
| `docs/layers/accounts/tutorials/deprecated-cold-start-components.mdx` | Update | Add account-map, aws-teams to deprecated list |
| `docs/layers/accounts/faq.mdx` | Update | Update FAQs for new approach |

### Medium Priority - Other References

| File | Action | Notes |
|------|--------|-------|
| `docs/learn/maintenance/tutorials/how-to-manage-terraform-dependencies-in-micro-service-repositori.mdx` | Update | Update account-map references |
| `docs/learn/maintenance/tutorials/how-to-update-components-yaml-to-new-organization.mdx` | Update | Update for new vendoring pattern |
| `docs/community/contribute/component-testing.mdx` | Update | Update testing patterns |
| `docs/resources/legacy/fundamentals/geodesic.mdx` | Keep | Already legacy |
| `docs/resources/legacy/troubleshooting.mdx` | Keep | Already legacy |

### New Pages to Create

| Page | Location | Description |
|------|----------|-------------|
| Atmos Profiles Guide | `docs/layers/identity/atmos-profiles.mdx` | How to use Atmos profiles for different user types |
| Atmos Auth Setup | `docs/layers/identity/atmos-auth.mdx` | How to configure and use Atmos Auth |
| Centralized Root Access | `docs/layers/identity/centralized-root-access.mdx` | How to use RootAccess permission set |
| Migration Guide | `docs/layers/identity/tutorials/migrate-from-account-map.mdx` | How to migrate from account-map |
| Static Account Map | `docs/layers/accounts/static-account-map.mdx` | How to configure static account_map variable |

## Documentation Structure Changes

### Current Structure
```
docs/layers/identity/
├── identity.mdx (overview with account-map)
├── how-to-log-into-aws.mdx (Leapp-focused)
├── tutorials/
│   └── leapp/ (Leapp setup guides)
└── docs/
    └── dynamic-terraform-roles.mdx (aws-teams approach)
```

### Proposed Structure
```
docs/layers/identity/
├── identity.mdx (overview with Atmos Auth - primary)
├── how-to-log-into-aws.mdx (Atmos Auth - primary)
├── atmos-profiles.mdx (NEW)
├── atmos-auth.mdx (NEW)
├── centralized-root-access.mdx (NEW)
├── tutorials/
│   ├── migrate-from-account-map.mdx (NEW)
│   └── leapp/ (moved, marked as legacy)
├── legacy/
│   ├── dynamic-terraform-roles.mdx (moved from docs/)
│   ├── aws-teams.mdx (moved/deprecated)
│   └── account-map-architecture.mdx (reference for old deployments)
└── docs/
    └── aws-access-control-evolution.mdx (updated)
```

## Key Messaging Changes

### Remove References To
- `core-identity` account - replaced by `core-root` for identity management
- `account-map` component - replaced by static `account_map` variable
- `aws-teams` component - replaced by AWS SSO groups + Permission Sets
- `aws-team-roles` component - replaced by Permission Sets
- `aws-saml` component - replaced by native AWS SSO SAML
- `github-oidc-role` component - replaced by `iam-role` component
- Leapp as primary CLI tool - replaced by Atmos Auth

### Emphasize
- **Atmos Auth** as the primary way to authenticate to AWS
- **Atmos Profiles** for role-based access (managers, devops, developers, github)
- **Permission Sets** for human user access
- **`iam-role` component** for machine user access (terraform, planner, gitops roles)
- **Static configuration** instead of dynamic lookups
- **Simplicity** - fewer components, less complexity, faster cold starts

## Implementation Plan

### Phase 1: Create New Content
1. Create `atmos-profiles.mdx` guide
2. Create `atmos-auth.mdx` setup guide
3. Create `centralized-root-access.mdx` guide
4. Create migration guide from account-map

### Phase 2: Update Existing Content
1. Update `identity.mdx` overview
2. Rewrite `how-to-log-into-aws.mdx` for Atmos Auth
3. Update `cold-start.mdx` for new bootstrap workflow
4. Update `deploy-accounts.mdx` to remove account-map
5. Update `aws-sso.mdx` with new permission sets

### Phase 3: Reorganize Legacy Content
1. Create `legacy/` folder structure
2. Move Leapp tutorials to legacy
3. Move dynamic-terraform-roles to legacy
4. Add deprecation notices to moved content

### Phase 4: Update References
1. Search and update all `account-map` references
2. Update all `core-identity` references to `core-root`
3. Update component references throughout docs

## Success Criteria

- [ ] New users can follow documentation to deploy without account-map
- [ ] Atmos Auth is clearly documented as the primary authentication method
- [ ] Legacy content is preserved but clearly marked as such
- [ ] No broken links after reorganization
- [ ] All 20+ files with account-map references are updated

## Out of Scope

- Component library documentation (auto-generated from component READMEs)
- Atmos CLI documentation (maintained in atmos.tools)
- Video content updates

## References

- [refarch-scaffold PR #818](https://github.com/cloudposse/refarch-scaffold/pull/818) - Implementation PR
- [refarch-scaffold PRD](https://github.com/cloudposse/refarch-scaffold/blob/upstream-account-map-less/docs/prd/remove-account-map.md) - Original PRD
- [Atmos Auth Documentation](https://atmos.tools/cli/auth/) - Atmos auth reference
