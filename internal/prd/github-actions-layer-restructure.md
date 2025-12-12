# PRD: GitHub Actions Layer Restructure

## Overview

Restructure the GitHub Actions layer documentation to position **Runs On** as the primary (and recommended) self-hosted runner solution, while preserving historical context about previous approaches.

## Current State

The GitHub Actions layer (`/layers/github-actions/`) currently contains:

| File | Purpose | Status |
|------|---------|--------|
| `github-actions.mdx` | Layer index page | Keep, update |
| `runs-on.mdx` | Runs On setup guide | Keep, promote to primary |
| `philips-labs-github-runners.mdx` | Philips Labs runner setup | Move to tutorials/ |
| `eks-github-actions-controller.mdx` | ARC (EKS) runner setup | Move to tutorials/ |
| `github-oidc-with-aws.mdx` | OIDC explanation | Keep, update |
| `design-decisions/` | Architecture decisions | Keep |

## Problems

1. **Multiple competing options presented equally** - Users are confused about which runner solution to use
2. **Legacy workflows referenced** - Philips Labs and ARC pages reference workflows that no longer exist in the standard quickstart structure
3. **OIDC deployment instructions redundant** - OIDC is now deployed via the Identity layer, but the page still implies separate deployment
4. **No clear recommendation** - Documentation doesn't guide users toward the best solution

## Proposed Changes

### 1. Update Layer Index Page (`github-actions.mdx`)

**Current:** Generic introduction with DocCardList showing all options equally

**Proposed:**
- Clear recommendation for Runs On as the primary solution
- Brief explanation of why Runs On is recommended
- Links to legacy approaches in tutorials section for users with existing deployments

### 2. Promote Runs On to Primary Position

**File:** `runs-on.mdx`

**Changes:**
- Update `sidebar_position` to be first (after index)
- Enhance intro to explain why Runs On is the recommended approach:
  - No infrastructure to manage (serverless)
  - Simple setup (GitHub App installation)
  - Cost-effective (pay-per-use, spot instances)
  - No Kubernetes required
  - Works with any repository
- Update OIDC note to clarify it's deployed via Identity layer
- Keep workflow references (already updated to `quickstart/foundation/runs-on`)

### 3. Move Legacy Approaches to Tutorials

**Create:** `tutorials/` subdirectory

**Move and update:**

#### `tutorials/philips-labs-github-runners.mdx`
- Add deprecation notice at top explaining this is a legacy approach
- **Remove all AtmosWorkflow components** - workflows no longer exist
- Keep explanatory content about how Philips Labs runners work
- Add note: "For new deployments, use [Runs On](/layers/github-actions/runs-on/)"

#### `tutorials/eks-github-actions-controller.mdx`
- Add deprecation notice at top explaining this is a legacy approach
- **Remove all AtmosWorkflow components** - workflows no longer exist
- Keep explanatory content about how ARC works
- Add note: "For new deployments, use [Runs On](/layers/github-actions/runs-on/)"

### 4. Update GitHub OIDC Page (`github-oidc-with-aws.mdx`)

**Keep:** All explanatory content about how OIDC works with AWS

**Update:**
- Remove any deployment instructions
- Add note at top: "GitHub OIDC Provider is deployed as part of the [Identity layer](/layers/identity/deploy/). This page explains how OIDC works for reference."
- Keep the conceptual explanation - it's valuable for understanding

### 5. Sidebar Structure

**Before:**
```
GitHub Actions
├── GitHub OIDC with AWS
├── Actions Runner Controller (EKS)
├── Philips Labs Action Runners
├── Runs On
└── Design Decisions
```

**After:**
```
GitHub Actions
├── Setup Runs On (primary)
├── GitHub OIDC with AWS (reference)
├── Design Decisions
└── Tutorials (legacy approaches)
    ├── Philips Labs Runners
    └── Actions Runner Controller (EKS)
```

## Implementation Tasks

### Phase 1: File Structure

1. [ ] Create `docs/layers/github-actions/tutorials/` directory
2. [ ] Move `philips-labs-github-runners.mdx` to `tutorials/`
3. [ ] Move `eks-github-actions-controller.mdx` to `tutorials/`
4. [ ] Create `tutorials/tutorials.mdx` index page

### Phase 2: Content Updates

5. [ ] Update `github-actions.mdx` (layer index):
   - Add clear Runs On recommendation
   - Update DocCardList or replace with curated content

6. [ ] Update `runs-on.mdx`:
   - Change `sidebar_position` to 1
   - Add "Why Runs On?" section explaining benefits
   - Update OIDC note to reference Identity layer

7. [ ] Update `github-oidc-with-aws.mdx`:
   - Add note that OIDC is deployed via Identity layer
   - Remove any deployment steps (keep explanatory content)

8. [ ] Update `tutorials/philips-labs-github-runners.mdx`:
   - Add deprecation admonition at top
   - Remove all `<AtmosWorkflow>` components
   - Update sidebar metadata

9. [ ] Update `tutorials/eks-github-actions-controller.mdx`:
   - Add deprecation admonition at top
   - Remove all `<AtmosWorkflow>` components
   - Update sidebar metadata

### Phase 3: Redirects

10. [ ] Add redirects for moved pages:
    - `/layers/github-actions/philips-labs-github-runners/` → `/layers/github-actions/tutorials/philips-labs-github-runners/`
    - `/layers/github-actions/eks-github-actions-controller/` → `/layers/github-actions/tutorials/eks-github-actions-controller/`

### Phase 4: Verification

11. [ ] Run `npm run build` to verify no broken links
12. [ ] Review sidebar navigation
13. [ ] Test all internal links

## Why Runs On?

Content to include in the updated documentation:

### Benefits of Runs On

1. **Zero Infrastructure Management**
   - No EC2 instances, Lambda functions, or Kubernetes clusters to maintain
   - No patching, scaling, or monitoring required

2. **Simple Setup**
   - Deploy single Terraform component
   - Install GitHub App
   - Start using immediately

3. **Cost Effective**
   - Pay only for what you use
   - Automatic spot instance usage
   - No idle infrastructure costs

4. **Works Everywhere**
   - No Kubernetes required
   - Works with any GitHub repository
   - Supports organization-wide configuration

5. **Feature Rich**
   - Multiple runner sizes and architectures
   - Custom images supported
   - Built-in caching and persistence options

### When to Consider Alternatives

- **ARC (Actions Runner Controller)**: Only if you have existing EKS infrastructure and want runners in Kubernetes
- **Philips Labs**: Legacy approach, not recommended for new deployments

## Deprecation Notice Template

```mdx
:::warning Legacy Approach

This page documents a legacy approach to self-hosted GitHub runners. **For new deployments, we recommend using [Runs On](/layers/github-actions/runs-on/)**, which provides:
- Zero infrastructure management
- Simple GitHub App installation
- Cost-effective pay-per-use pricing

This content is preserved for organizations with existing deployments using this approach.

:::
```

## Success Criteria

1. Users landing on GitHub Actions layer clearly understand Runs On is the recommended approach
2. Legacy pages are accessible but clearly marked as historical
3. No broken links after restructure
4. OIDC explanation remains available without implying separate deployment
5. Build passes with no errors

## Related

- Identity Layer (deploys GitHub OIDC Provider)
- Atmos Workflows Restructure PRD (removed legacy runner workflows)
