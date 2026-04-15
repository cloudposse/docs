# Feature Specification: EKS Auto Mode Documentation Update

**Feature Branch**: `001-eks-auto-mode-docs`
**Created**: 2026-04-15
**Status**: Draft
**Input**: User description: "Update documentation in accordance with changes in refarch-scaffold PR #897. Remove mention of eks karpenter controller, alb controller, alb ingress default group from the learn section. Describe that this is now managed by EKS Auto Mode. Mention migration plan references for components that have been updated like karpenter-node-pool. Add documentation for atmos native eks auth -- `atmos auth exec --identity=plat-dev/terraform -- kubectl ...`. Add documentation about EKS capabilities."

## Clarifications

### Session 2026-04-15

- Q: How should obsolete FAQ/design-decision content be treated? → A: Keep but mark as legacy with an admonition pointing to Auto Mode docs.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Update EKS Foundational Platform Documentation (Priority: P1)

A DevOps engineer reading the EKS foundational platform documentation should learn about EKS Auto Mode as the primary compute, networking, and storage management approach. The documentation currently describes a manual setup flow involving `eks/karpenter` (the controller), `eks/alb-controller`, and `eks/alb-controller-ingress-group` as required components. These components have been removed from the refarch scaffold in favor of EKS Auto Mode. The documentation must be updated to reflect this new architecture.

**Why this priority**: This is the primary EKS learning page and currently contains incorrect/obsolete component references that will confuse users following the setup guide.

**Independent Test**: Navigate to the EKS foundational platform page and verify that:
- No references to `eks/karpenter` (the controller component) exist as a required deployment step
- No references to `eks/alb-controller` or `eks/alb-controller-ingress-group` exist
- EKS Auto Mode is described as the mechanism for compute, networking, and storage management
- The `eks/karpenter-node-pool` component is still referenced (it is updated, not removed)
- The new `eks/ingress-class` component replaces `eks/alb-controller-ingress-group`

**Acceptance Scenarios**:

1. **Given** a user reads `docs/layers/eks/foundational-platform.mdx`, **When** they look at the Foundation section, **Then** they see EKS Auto Mode described instead of manual Karpenter controller deployment
2. **Given** a user reads the Network section, **When** they look for load balancer setup, **Then** they see that ALB/NLB management is handled by EKS Auto Mode (not `alb-controller`) and that `eks/ingress-class` replaces `eks/alb-controller-ingress-group`
3. **Given** a user reads the page, **When** they search for "alb-controller" or "eks/karpenter", **Then** no results are found (except historical/migration context)

---

### User Story 2 - Document EKS Capabilities (Priority: P1)

A DevOps engineer needs to understand EKS Capabilities -- a new feature where AWS manages Argo CD, ACK (AWS Controllers for Kubernetes), and KRO (Kube Resource Orchestrator) as native EKS capabilities. The scaffold PR introduces capability mixins (`capabilities-all.yaml` for dev, `capabilities-argocd.yaml` for staging/prod). This needs to be documented in the EKS layer docs.

**Why this priority**: EKS Capabilities is a net-new feature with no existing documentation. Users need to understand what capabilities are available, how they differ per stage, and how they replace self-managed Argo CD.

**Independent Test**: A new section or page about EKS Capabilities exists and covers: what capabilities are, the three types (Argo CD, ACK, KRO), per-stage configuration (dev=all, staging/prod=argocd only), and how this replaces self-managed Argo CD Helm deployments.

**Acceptance Scenarios**:

1. **Given** a user wants to understand EKS Capabilities, **When** they navigate to the EKS documentation, **Then** they find a clear explanation of what Capabilities are and the three types available
2. **Given** a user wants to configure capabilities per stage, **When** they read the documentation, **Then** they understand that dev uses `capabilities-all` (Argo CD + ACK + KRO) while staging/prod use `capabilities-argocd` (Argo CD only)
3. **Given** a user previously deployed self-managed Argo CD, **When** they read the capabilities docs, **Then** they understand that EKS-managed Argo CD capability replaces the self-managed Helm chart deployment

---

### User Story 3 - Document Atmos Auth for EKS/kubectl Access (Priority: P2)

A developer or DevOps engineer needs to run `kubectl` commands against an EKS cluster using Atmos Auth. The existing `how-to-log-into-aws.mdx` docs cover `atmos auth exec` for AWS CLI commands but do not show the EKS/kubectl use case. Documentation should show how to use `atmos auth exec --identity=plat-dev/terraform -- kubectl get pods` and similar patterns for native EKS authentication without requiring kubeconfig setup scripts.

**Why this priority**: EKS cluster access is a daily workflow for engineers. Documenting the `atmos auth exec` pattern for kubectl eliminates confusion and replaces the legacy Geodesic `set-cluster` approach.

**Independent Test**: The EKS or identity documentation includes examples of `atmos auth exec` with kubectl commands, and users can follow the instructions to access their EKS clusters.

**Acceptance Scenarios**:

1. **Given** a developer wants to run kubectl commands, **When** they read the EKS documentation, **Then** they find examples using `atmos auth exec --identity=plat-dev/terraform -- kubectl get pods`
2. **Given** a user reads the kubectl access docs, **When** they follow the instructions, **Then** they understand they need to be authenticated via `atmos auth login` first and connected to VPN

---

### User Story 4 - Update Deploy Clusters Guide (Priority: P2)

The deploy clusters guide (`docs/layers/eks/deploy-clusters.mdx`) references the deployment workflow which has changed. The vendor and deploy steps no longer include `eks/karpenter`, `eks/alb-controller`, or `eks/alb-controller-ingress-group`. The deploy/cluster step now includes `eks/ingress-class`. These changes come from the updated workflow files in the scaffold PR.

**Why this priority**: This is the step-by-step deployment guide. Incorrect steps will cause deployment failures.

**Independent Test**: The deploy clusters page reflects the updated workflow steps matching the scaffold PR changes.

**Acceptance Scenarios**:

1. **Given** a user follows the deploy clusters guide, **When** they reach the vendor step, **Then** the component list matches the updated workflow (no karpenter controller, no alb-controller, includes ingress-class)
2. **Given** a user follows the deploy/resources step, **When** they execute the workflow, **Then** the component deployment order matches the updated workflow (no karpenter, no alb-controller, no alb-controller-ingress-group)

---

### User Story 5 - Update EKS FAQ and Design Decisions (Priority: P3)

The EKS FAQ contains a question about `alb-controller-ingress-group` determining ALB names. The ingress controller design decision references `aws-loadbalancer-controller`. These should be updated to reflect the EKS Auto Mode approach where AWS manages load balancing natively.

**Why this priority**: FAQ and design decisions are reference material. They should be accurate but are lower priority than the main learning path.

**Independent Test**: FAQ no longer references obsolete components without context. Design decisions reference EKS Auto Mode as the current recommendation.

**Acceptance Scenarios**:

1. **Given** a user reads the EKS FAQ, **When** they look at the ALB question, **Then** it is marked as legacy with an admonition pointing to the Auto Mode documentation
2. **Given** a user reads the ingress controller design decision, **When** they look for the current recommendation, **Then** it is marked as legacy with an admonition noting that EKS Auto Mode is the default approach for new deployments

---

### User Story 6 - Document Migration Path for Updated Components (Priority: P3)

Users with existing deployments need to understand the migration path from the old component set to the new EKS Auto Mode architecture. Components that have been updated (like `karpenter-node-pool` v2 to v3) or renamed (like `alb-controller-ingress-group` to `eks/ingress-class`) need migration guidance references.

**Why this priority**: Existing users need to know what changed and how to migrate, but this is a follow-up concern after new deployments are documented correctly.

**Independent Test**: Migration notes exist that reference the component changes and link to relevant component UPGRADING.md docs.

**Acceptance Scenarios**:

1. **Given** a user has an existing deployment, **When** they read the EKS Auto Mode documentation, **Then** they find a migration section or callout explaining what components were removed/renamed and linking to upgrade guides
2. **Given** a user needs to migrate `alb-controller-ingress-group` to `ingress-class`, **When** they read the docs, **Then** they understand the rename and version change

---

### Edge Cases

- What happens when a user has Auto Mode disabled? Documentation should note that the self-managed path still exists but is no longer the default scaffold configuration.
- How does a user with existing `eks/karpenter` and `eks/alb-controller` deployments transition? A migration callout should reference the scaffold PR and component upgrade guides.
- What about the `core-auto` account which now gets Auto Mode but no capabilities? This should be documented as the minimal Auto Mode configuration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Documentation MUST remove references to `eks/karpenter` (controller) as a required deployment component from the EKS learning section
- **FR-002**: Documentation MUST remove references to `eks/alb-controller` and `eks/alb-controller-ingress-group` as required deployment components
- **FR-003**: Documentation MUST describe EKS Auto Mode as the default approach for compute, networking, and storage management
- **FR-004**: Documentation MUST link to the official AWS EKS Auto Mode documentation (https://docs.aws.amazon.com/eks/latest/userguide/automode.html)
- **FR-005**: Documentation MUST describe EKS Capabilities (Argo CD, ACK, KRO) and their per-stage configuration
- **FR-006**: Documentation MUST include examples of `atmos auth exec --identity=<identity> -- kubectl <command>` for EKS cluster access
- **FR-007**: Documentation MUST reference the `eks/ingress-class` component as the replacement for `eks/alb-controller-ingress-group`
- **FR-008**: Documentation MUST note migration considerations for `karpenter-node-pool` (v2 to v3) and `alb-controller-ingress-group` to `ingress-class` rename
- **FR-009**: Documentation MUST still reference `eks/karpenter-node-pool` as it remains in the scaffold (updated, not removed)
- **FR-010**: The deploy clusters guide MUST reflect the updated Atmos workflow steps from the scaffold PR
- **FR-011**: Obsolete FAQ entries and design decisions MUST be preserved but marked as legacy with an admonition pointing readers to the EKS Auto Mode documentation

### Key Entities

- **EKS Auto Mode**: AWS-managed compute, networking, and storage for EKS clusters. Replaces self-managed Karpenter controller, ALB controller, and related addons.
- **EKS Capabilities**: AWS-managed cluster features including Argo CD, ACK, and KRO. Configured via catalog mixins (`capabilities-all.yaml`, `capabilities-argocd.yaml`).
- **Auto Mode Mixin**: Catalog configuration (`catalog/eks/cluster/mixins/auto-mode.yaml`) that enables Auto Mode and disables self-managed compute/addons.
- **Ingress Class**: New component (`eks/ingress-class`) replacing `eks/alb-controller-ingress-group`. Detects Auto Mode via `!terraform.state`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All pages in `docs/layers/eks/` pass MDX linting with no errors
- **SC-002**: `npm run build` completes successfully with no broken links
- **SC-003**: Zero references to `eks/karpenter` (as a controller deployment step), `eks/alb-controller`, or `eks/alb-controller-ingress-group` exist in the EKS layer learning docs (excluding component library auto-generated docs and explicit legacy/migration context)
- **SC-004**: EKS Auto Mode is described with a link to the AWS documentation on at least one EKS layer page
- **SC-005**: At least one page contains `atmos auth exec` examples for kubectl usage
- **SC-006**: EKS Capabilities are documented with the three types and per-stage configuration

## Assumptions

- The component library auto-generated docs (`docs/components/library/`) are NOT modified -- they are generated from upstream repos and will be updated separately
- The existing tutorials (e.g., `how-to-setup-vanity-domains-on-alb-eks.mdx`) may reference ALB controller annotations; these can remain as they describe Kubernetes-native ALB annotations that still work with EKS Auto Mode
- The `eks/karpenter-node-pool` component remains relevant (it was updated to v3, not removed)
- The `core-auto` account is a new EKS deployment target with Auto Mode but no capabilities
- EKS Auto Mode manages vpc-cni, kube-proxy, coredns, and aws-ebs-csi-driver addons; aws-efs-csi-driver remains self-managed
- The existing `how-to-log-into-aws.mdx` already documents `atmos auth exec` for AWS CLI; the EKS kubectl use case extends this pattern
