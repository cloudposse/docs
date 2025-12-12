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
2. Add deprecation admonitions to legacy pages (keep in existing locations, no separate legacy folders)
3. Remove references to `core-identity` account (identity management now centralized in `core-root`)
4. Create new guides for Atmos Auth, profiles, and the simplified identity model
5. Update cold start/bootstrap documentation for the new workflow

---

## 1. Identity Layer

### 1.1 `docs/layers/identity/identity.mdx`
**Action:** Update

**Changes:**
- Replace account-map overview with static account_map variable approach
- Update architecture diagram to show Atmos Auth flow
- Remove references to aws-teams and aws-team-roles
- Add section on Permission Sets (TerraformPlanAccess, TerraformApplyAccess, TerraformStateAccess, RootAccess)
- Update to reference core-root instead of core-identity

### 1.2 `docs/layers/identity/how-to-log-into-aws.mdx`
**Action:** Rewrite

**Changes:**
- Replace Leapp instructions with Atmos Auth
- Document `atmos auth login` command
- Add profile selection (`ATMOS_PROFILE=devops`)
- Remove all Leapp references
- Add troubleshooting for SSO session expiry

### 1.3 `docs/layers/identity/deploy.mdx`
**Action:** Update

**Changes:**
- Remove aws-teams deployment steps
- Remove aws-team-roles deployment steps
- Add iam-role component deployment for terraform/planner roles
- Update deployment order for new architecture

### 1.4 `docs/layers/identity/aws-sso.mdx`
**Action:** Update

**Changes:**
- Add TerraformPlanAccess permission set documentation
- Add TerraformApplyAccess permission set documentation
- Add TerraformStateAccess permission set documentation
- Add RootAccess permission set for organizational root access
- Document permission set assignment patterns per account type

### 1.5 `docs/layers/identity/centralized-terraform-access.mdx`
**Action:** Update

**Changes:**
- Replace github-oidc-role with iam-role component
- Document terraform and planner IAM roles
- Update trust policy examples for GitHub OIDC
- Add Atmos Pro integration notes

### 1.6 `docs/layers/identity/docs/dynamic-terraform-roles.mdx`
**Action:** Add deprecation admonition

**Changes:**
- Add deprecation admonition at top of page
- Add link to new iam-role approach
- Keep file in existing location

### 1.7 `docs/layers/identity/docs/aws-access-control-evolution.mdx`
**Action:** Update

**Changes:**
- Add new section for "Phase 4: Account-Map-Less Architecture"
- Document evolution from account-map to static configuration
- Add timeline and rationale for deprecation

### 1.8 `docs/layers/identity/tutorials/leapp/*.mdx`
**Action:** Add deprecation admonition

**Changes:**
- Add deprecation admonition at top of each file
- Add link to Atmos Auth documentation as replacement
- Keep files in existing tutorials/leapp/ location

### 1.9 `docs/layers/identity/optional/aws-saml.mdx`
**Action:** Add deprecation notice

**Changes:**
- Add deprecation banner noting AWS SSO is now preferred
- Keep content for legacy deployments

---

## 2. Accounts Layer

### 2.1 `docs/layers/accounts/accounts.mdx`
**Action:** Update

**Changes:**
- Remove core-identity account references
- Update account list to show identity managed in core-root
- Update architecture diagram

### 2.2 `docs/layers/accounts/deploy-accounts.mdx`
**Action:** Update

**Changes:**
- Remove account-map deployment steps
- Add static account_map variable configuration
- Update deployment order

### 2.3 `docs/layers/accounts/initialize-tfstate.mdx`
**Action:** Update

**Changes:**
- Update tfstate-backend configuration for new architecture
- Remove account-map remote state references
- Document access_roles with Permission Set patterns
- Add use_organization_id configuration

### 2.4 `docs/layers/accounts/tutorials/cold-start.mdx`
**Action:** Rewrite

**Changes:**
- Remove account-map bootstrap steps
- Remove aws-teams bootstrap steps
- Add SuperAdmin profile bootstrap flow
- Document static account_map creation
- Update for Atmos Auth authentication

### 2.5 `docs/layers/accounts/tutorials/deprecated-cold-start-components.mdx`
**Action:** Update

**Changes:**
- Add account-map to deprecated list
- Add aws-teams to deprecated list
- Add aws-team-roles to deprecated list
- Add aws-saml to deprecated list
- Add github-oidc-role to deprecated list

### 2.6 `docs/layers/accounts/faq.mdx`
**Action:** Update

**Changes:**
- Update FAQs for new architecture
- Add FAQ about static vs dynamic account mapping
- Add FAQ about Permission Sets vs aws-teams
- Remove outdated account-map FAQs

---

## 3. Automate Terraform (Deprecate GitHub Actions)

### 3.1 `docs/layers/gitops/gitops.mdx`
**Action:** Add deprecation admonition

**Changes:**
- Add deprecation admonition at top pointing to Atmos Pro
- Keep file in existing location
- Content remains for legacy deployments

### 3.2 `docs/layers/gitops/setup.mdx`
**Action:** Add deprecation admonition

**Changes:**
- Add deprecation admonition at top pointing to Atmos Pro
- Keep file in existing location

### 3.3 `docs/layers/gitops/example-workflows.mdx`
**Action:** Add deprecation admonition

**Changes:**
- Add deprecation admonition at top pointing to Atmos Pro
- Keep file in existing location

### 3.4 `docs/layers/gitops/faq.mdx`
**Action:** Add deprecation admonition

**Changes:**
- Add deprecation admonition at top pointing to Atmos Pro
- Keep file in existing location

### 3.5 `docs/layers/atmos-pro/atmos-pro.mdx`
**Action:** Update

**Changes:**
- Make this the primary entry point for "Automate Terraform"
- Add comparison with legacy GitHub Actions approach
- Emphasize as recommended approach
- Add migration notes from GitHub Actions GitOps

### 3.6 `docs/layers/atmos-pro/setup.mdx`
**Action:** Update

**Changes:**
- Update for iam-role component integration
- Document terraform and planner role configuration
- Add GitHub OIDC setup with new patterns

### 3.7 `docs/layers/atmos-pro/tutorials/*.mdx`
**Action:** Update

**Changes:**
- Update examples for new architecture
- Remove account-map references
- Use static account_map patterns

### 3.8 `sidebars.js`
**Action:** Update

**Changes:**
- Remove "GitHub Actions" from "Automate Terraform" category
- Keep only "Atmos Pro" under "Automate Terraform"
- Update category to link directly to atmos-pro.mdx

---

## 4. GitHub Actions Layer (Keep for Runners)

### 4.1 `docs/layers/github-actions/github-actions.mdx`
**Action:** Update

**Changes:**
- Remove references to GitOps Terraform automation
- Focus on runner configuration only
- Add note that Atmos Pro is used for Terraform automation

### 4.2 `docs/layers/github-actions/github-oidc-with-aws.mdx`
**Action:** Update

**Changes:**
- Update for iam-role component instead of github-oidc-role
- Update trust policy examples
- Add Atmos Pro context

### 4.3 `docs/layers/github-actions/eks-github-actions-controller.mdx`
**Action:** Keep as-is

### 4.4 `docs/layers/github-actions/philips-labs-github-runners.mdx`
**Action:** Keep as-is

### 4.5 `docs/layers/github-actions/runs-on.mdx`
**Action:** Keep as-is

### 4.6 `docs/layers/github-actions/design-decisions/*.mdx`
**Action:** Keep as-is

---

## 5. GitHub Actions Library (Add Deprecation Notices)

### 5.1 `docs/github-actions/github-actions.mdx`
**Action:** Update

**Changes:**
- Add note that Atmos Pro is now preferred for Terraform automation
- Keep as reference library

### 5.2 `docs/github-actions/library/library.mdx`
**Action:** Update

**Changes:**
- Add deprecation notice for Terraform-related actions
- Point to Atmos Pro documentation

### 5.3 `docs/github-actions/library/actions/atmos-terraform-*.md`
**Action:** Add deprecation notice

**Changes:**
- Add deprecation banner to all atmos-terraform-* action docs
- Point to Atmos Pro as replacement

---

## 6. Other References

### 6.1 `docs/learn/maintenance/tutorials/how-to-manage-terraform-dependencies-in-micro-service-repositori.mdx`
**Action:** Update

**Changes:**
- Update account-map references to static account_map

### 6.2 `docs/learn/maintenance/tutorials/how-to-update-components-yaml-to-new-organization.mdx`
**Action:** Update

**Changes:**
- Update for new vendoring pattern with mixins
- Add provider-without-account-map.tf mixin example

### 6.3 `docs/community/contribute/component-testing.mdx`
**Action:** Update

**Changes:**
- Update testing patterns for new architecture

---

## 7. New Pages to Create

### 7.1 `docs/layers/identity/atmos-profiles.mdx`
**Action:** Create

**Content:**
- Overview of 6 profiles (superadmin, managers, devops, developers, github-plan, github-apply)
- Profile selection and usage
- Identity naming conventions
- Security considerations

### 7.2 `docs/layers/identity/atmos-auth.mdx`
**Action:** Create

**Content:**
- How to configure Atmos Auth
- Provider configuration (aws/iam-identity-center)
- Login commands and troubleshooting
- Credential caching

### 7.3 `docs/layers/identity/centralized-root-access.mdx`
**Action:** Create

**Content:**
- RootAccess permission set overview
- Organizational root access for delegated accounts
- Security considerations
- Usage examples

### 7.4 `docs/layers/identity/tutorials/migrate-from-account-map.mdx`
**Action:** Create

**Content:**
- Step-by-step migration guide
- Before/after comparisons
- Common issues and solutions

### 7.5 `docs/layers/accounts/static-account-map.mdx`
**Action:** Create

**Content:**
- How to configure static account_map variable
- Format and structure
- Where to define (stacks/orgs/NAMESPACE/_defaults.yaml)

### 7.6 `docs/layers/accounts/component-vendoring-mixins.mdx`
**Action:** Create

**Content:**
- How to vendor components with mixins
- provider-without-account-map.tf usage
- account-verification.mixin.tf usage
- component.yaml examples

---

## Documentation Structure Changes

### Approach: Deprecation Admonitions (No File Moves)

Instead of moving files to legacy folders, we add deprecation admonitions to the top of deprecated pages. This:
- Preserves existing URLs and links
- Keeps content discoverable for users with legacy deployments
- Clearly communicates the recommended approach

### Deprecation Admonition Template

Add this admonition to the top of deprecated pages:

```mdx
:::warning Deprecated
This documentation describes the legacy approach using `account-map` and GitHub Actions GitOps.

**The recommended approach now uses:**
- [Atmos Auth](/layers/identity/atmos-auth) for authentication
- [Atmos Pro](/layers/atmos-pro/atmos-pro) for CI/CD automation
- Static `account_map` variable instead of the account-map component

This content is preserved for users with existing deployments.
:::
```

### Identity Layer - Changes
```
docs/layers/identity/
├── identity.mdx                    → Updated for Atmos Auth
├── how-to-log-into-aws.mdx        → Rewritten for Atmos Auth
├── atmos-profiles.mdx             → NEW
├── atmos-auth.mdx                 → NEW
├── centralized-root-access.mdx    → NEW
├── tutorials/
│   ├── migrate-from-account-map.mdx → NEW
│   └── leapp/                     → Add deprecation admonition to each file
└── docs/
    ├── dynamic-terraform-roles.mdx → Add deprecation admonition
    └── aws-access-control-evolution.mdx → Updated
```

### Automate Terraform - Changes
```
docs/layers/gitops/
├── gitops.mdx           → Add deprecation admonition
├── setup.mdx            → Add deprecation admonition
├── example-workflows.mdx → Add deprecation admonition
└── faq.mdx              → Add deprecation admonition

docs/layers/atmos-pro/
├── atmos-pro.mdx        → Updated as primary entry point
├── setup.mdx            → Updated
└── tutorials/           → Updated
```

### Sidebar Changes (sidebars.js)
```javascript
// BEFORE
{
  type: 'category',
  label: 'Automate Terraform',
  items: [
    { label: 'GitHub Actions', ... },  // REMOVE from sidebar
    { label: 'Atmos Pro', ... }
  ]
}

// AFTER
{
  type: 'category',
  label: 'Automate Terraform',
  link: { type: 'doc', id: 'layers/atmos-pro/atmos-pro' },
  items: [
    { type: 'autogenerated', dirName: 'layers/atmos-pro' }
  ]
}
```

Note: GitOps pages remain accessible via direct URL but are removed from the sidebar navigation.

---

## Key Messaging Changes

### Remove References To
- `core-identity` account → replaced by `core-root`
- `account-map` component → replaced by static `account_map` variable
- `aws-teams` component → replaced by AWS SSO groups + Permission Sets
- `aws-team-roles` component → replaced by Permission Sets
- `aws-saml` component → replaced by native AWS SSO SAML
- `github-oidc-role` component → replaced by `iam-role` component
- Leapp as primary CLI tool → replaced by Atmos Auth
- GitHub Actions GitOps workflows → replaced by Atmos Pro

### Emphasize
- **Atmos Auth** as the primary way to authenticate to AWS
- **Atmos Profiles** for role-based access:
  - `superadmin` - Emergency/break-glass access
  - `managers` - Full access to all environments
  - `devops` - Full access to all environments
  - `developers` - Limited access (apply in dev/sandbox, plan-only in staging/prod)
  - `github-plan` - CI/CD plan operations (any branch)
  - `github-apply` - CI/CD apply operations (main branch only)
- **Permission Sets** for human user access:
  - `TerraformPlanAccess` - Read-only access for planning
  - `TerraformApplyAccess` - Full access for applying changes
  - `TerraformStateAccess` - Read-only state access for Atmos functions
  - `RootAccess` - Organizational root access for delegated accounts
- **`iam-role` component** for machine user access
- **Atmos Pro** as the primary/only way to automate Terraform in CI/CD
- **Static configuration** instead of dynamic lookups
- **Simplicity** - fewer components, less complexity, faster cold starts

---

## Success Criteria

- [ ] New users can follow documentation to deploy without account-map
- [ ] Atmos Auth is clearly documented as the primary authentication method
- [ ] Atmos Pro is clearly documented as the primary/only Terraform automation method
- [ ] GitHub Actions GitOps documentation has deprecation admonitions
- [ ] Legacy content is preserved with clear deprecation notices
- [ ] No broken links (files stay in existing locations)
- [ ] All 20+ files with account-map references are updated
- [ ] "Automate Terraform" section in sidebar only shows Atmos Pro

---

## Out of Scope

- Component library documentation (auto-generated from component READMEs)
- Atmos CLI documentation (maintained in atmos.tools)
- Video content updates

---

## References

- [refarch-scaffold PR #818](https://github.com/cloudposse/refarch-scaffold/pull/818) - Implementation PR
- [refarch-scaffold PRD](https://github.com/cloudposse/refarch-scaffold/blob/upstream-account-map-less/docs/prd/remove-account-map.md) - Original PRD
- [Atmos Auth Documentation](https://atmos.tools/cli/auth/) - Atmos auth reference
