# Implementation Plan: EKS Auto Mode Documentation Update

**Branch**: `001-eks-auto-mode-docs` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-eks-auto-mode-docs/spec.md`

## Summary

Update the Cloud Posse reference architecture documentation to reflect EKS Auto Mode as the default compute/networking/storage management approach, replacing self-managed Karpenter controller, ALB controller, and ALB ingress group components. Add documentation for EKS Capabilities (Argo CD, ACK, KRO), Atmos Auth for kubectl access, and migration guidance for updated components. This is a documentation-only change affecting MDX files in `docs/layers/eks/` and `docs/layers/identity/`.

## Technical Context

**Language/Version**: MDX (Markdown + JSX), Docusaurus v2
**Primary Dependencies**: Docusaurus, React components from `src/components/`
**Storage**: N/A (static site)
**Testing**: `npx docusaurus-mdx-checker --cwd docs` (MDX linting), `npm run build` (broken link detection)
**Target Platform**: Static website (docs.cloudposse.com)
**Project Type**: Documentation site
**Performance Goals**: N/A (static site)
**Constraints**: All changes must pass `npm run build` with zero broken links; MDX linter must pass
**Scale/Scope**: ~8 MDX files to modify, ~1 new MDX file to create

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content Source Fidelity | PASS | Changes are to editorial/learning content authored in this repo. Auto-generated component library docs are explicitly out of scope. Snippet files in `examples/` are not modified. |
| II. Link Integrity (NON-NEGOTIABLE) | GATE | All internal link updates must be verified. Redirects must be added if any page URLs change. `npm run build` must pass. No page URLs are changing in this plan (editing existing files + one new file). |
| III. MDX-First Content | PASS | All changes use MDX with proper frontmatter. React components from `src/components/` used where applicable. |
| IV. No File Bloat | PASS | Editing 8 existing files. Creating 1 new file (EKS Capabilities) which is explicitly required by the spec for net-new content. |
| V. Build Verification | GATE | `npm run build` must succeed. `npm start` for visual verification of updated pages. |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-eks-auto-mode-docs/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (content model)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
docs/
├── docs/
│   ├── layers/
│   │   ├── eks/
│   │   │   ├── eks.mdx                          # [EDIT] Update overview text
│   │   │   ├── foundational-platform.mdx        # [EDIT] Major rewrite for Auto Mode
│   │   │   ├── deploy-clusters.mdx              # [EDIT] Update workflow steps
│   │   │   ├── faq.mdx                          # [EDIT] Mark ALB question as legacy
│   │   │   ├── design-decisions/
│   │   │   │   └── decide-on-kubernetes-ingress-controller-s.mdx  # [EDIT] Add legacy admonition
│   │   │   │   └── decide-on-eks-node-pool-architecture.mdx       # [EDIT] Add Auto Mode context
│   │   │   └── tutorials/
│   │   │       └── how-to-setup-vanity-domains-on-alb-eks.mdx     # [NO CHANGE] ALB annotations still valid
│   │   └── identity/
│   │       └── how-to-log-into-aws.mdx          # [EDIT] Add kubectl examples
│   └── learn/
│       └── maintenance/
│           └── tutorials/
│               └── how-to-update-components-yaml-to-new-organization.mdx  # [CHECK] May reference old components
├── src/
│   └── components/                              # [NO CHANGE] Existing React components reused
└── plugins/
    └── staticRedirects/                         # [NO CHANGE] No URLs are changing
```

**Structure Decision**: This is a documentation site. All changes are MDX file edits within the existing `docs/` directory structure. No new directories needed. One new conceptual section (EKS Capabilities) will be added as content within `foundational-platform.mdx` rather than a separate file, to avoid file bloat per Constitution Principle IV.

## Complexity Tracking

No violations. All changes fit within existing file structure.

---

## Phase 0: Research

### Research Findings

All technical context is already known from the scaffold PR #897 analysis. No NEEDS CLARIFICATION items exist.

### Key Decisions

1. **EKS Auto Mode scope**: Auto Mode manages compute (replaces Karpenter controller), networking (replaces ALB controller), and storage (manages EBS CSI driver). EFS CSI driver remains self-managed.

2. **Component mapping** (old → new):
   - `eks/karpenter` (controller) → **Removed** (Auto Mode manages nodes)
   - `eks/alb-controller` → **Removed** (Auto Mode manages ELB)
   - `eks/alb-controller-ingress-group` → `eks/ingress-class` (renamed, v2.1.0)
   - `eks/karpenter-node-pool` → **Updated** (v2.1.1 → v3.0.0, still needed for additional node pools)

3. **EKS Capabilities** (new feature):
   - Argo CD: Managed GitOps CD, replaces self-managed Helm chart
   - ACK: AWS Controllers for Kubernetes (manage AWS resources via CRDs)
   - KRO: Kube Resource Orchestrator (resource composition/abstraction)
   - Per-stage: dev = all three, staging/prod = Argo CD only, core-auto = none

4. **Auto Mode Mixin architecture**: `catalog/eks/cluster/mixins/auto-mode.yaml` imported after k8s version mixin. Disables managed node groups, karpenter IAM role, fargate profiles, and sets Auto Mode-managed addons to `enabled: false`.

5. **Atmos Auth for kubectl**: Uses `atmos auth exec --identity=<account>/<permission-set> -- kubectl <command>`. Requires prior `atmos auth login --provider sso` and VPN connection. The `terraform` identity has the EKS access needed for kubectl.

6. **Storage class changes**: EBS storage classes now use `ebs.csi.eks.amazonaws.com` provisioner (Auto Mode managed) instead of the default `ebs.csi.aws.com`.

7. **Legacy content treatment** (from clarification): Keep obsolete FAQ/design-decision content but mark as legacy with admonition pointing to Auto Mode docs.

---

## Phase 1: Design

### Content Model

See [data-model.md](./data-model.md) for the content structure and page-by-page edit plan.

### Files to Modify (in implementation order)

**P1 - Core content (US1, US2):**

1. **`docs/layers/eks/foundational-platform.mdx`** - Major rewrite
   - Rewrite intro paragraph: describe Auto Mode flow instead of manual Karpenter/ALB flow
   - Update Foundation section: replace `eks/karpenter` with Auto Mode description, keep `eks/karpenter-node-pool`
   - Update Network section: replace `alb-controller` + `alb-controller-ingress-group` with `eks/ingress-class` and Auto Mode ELB management
   - Add new "EKS Capabilities" subsection after Network: describe Argo CD, ACK, KRO with per-stage configuration
   - Add "Auto Mode Addons" note: vpc-cni, kube-proxy, coredns, aws-ebs-csi-driver managed by AWS; aws-efs-csi-driver remains self-managed
   - Add link to AWS Auto Mode documentation
   - Add migration callout (admonition) for existing deployments

2. **`docs/layers/eks/eks.mdx`** - Update overview
   - Update "Our Solution" paragraph: mention Auto Mode instead of manual Karpenter + ALB controller setup
   - Add EKS Capabilities to the solution description
   - Update references list if needed

**P2 - Deployment guide & kubectl access (US3, US4):**

3. **`docs/layers/eks/deploy-clusters.mdx`** - Update workflow steps
   - The page uses `<AtmosWorkflow>` components that render from workflow files
   - Update step descriptions to reflect Auto Mode (no manual Karpenter/ALB deploy steps)
   - Update the explanatory text around each workflow step
   - Note: The actual workflow YAML files in `examples/snippets/` come from refarch-scaffold and will be updated separately (Content Source Fidelity)

4. **`docs/layers/identity/how-to-log-into-aws.mdx`** - Add kubectl examples
   - Add a subsection under "Run a specific AWS CLI command" for EKS/kubectl access
   - Examples: `atmos auth exec --identity plat-dev/terraform -- kubectl get pods`
   - Note VPN requirement for EKS access

**P3 - Legacy content & migration (US5, US6):**

5. **`docs/layers/eks/faq.mdx`** - Mark ALB question as legacy
   - Add `:::caution Legacy` admonition to the `alb-controller-ingress-group` FAQ entry
   - Point to Auto Mode documentation and `eks/ingress-class`

6. **`docs/layers/eks/design-decisions/decide-on-kubernetes-ingress-controller-s.mdx`** - Add legacy admonition
   - Add `:::caution Legacy` admonition at top
   - Note that EKS Auto Mode is the current default for new deployments
   - Keep existing content for reference

7. **`docs/layers/eks/design-decisions/decide-on-eks-node-pool-architecture.mdx`** - Add Auto Mode context
   - Add note about EKS Auto Mode as an alternative to all listed provisioning options
   - Keep existing content as it's still valid for non-Auto-Mode deployments

### Constitution Re-check (Post-Design)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content Source Fidelity | PASS | Only editing editorial content. Not touching `examples/snippets/` or auto-generated docs. |
| II. Link Integrity | PASS | No page URLs changing. No redirects needed. Internal links to component library pages remain valid (auto-generated docs not removed). |
| III. MDX-First Content | PASS | All edits are MDX with proper frontmatter preserved. Using existing React components. |
| IV. No File Bloat | PASS | No new files created in `docs/`. EKS Capabilities documented as a section within existing page. |
| V. Build Verification | GATE | Must run `npm run build` after all edits. Must verify pages in browser via `npm start`. |
