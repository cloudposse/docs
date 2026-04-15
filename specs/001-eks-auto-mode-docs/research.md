# Research: EKS Auto Mode Documentation Update

**Date**: 2026-04-15
**Source**: refarch-scaffold PR #897 analysis + existing docs codebase review

## Research Tasks

### 1. EKS Auto Mode Architecture

**Decision**: EKS Auto Mode is the default compute, networking, and storage management approach for new scaffold deployments.

**Rationale**: PR #897 adds `auto_mode_enabled: true` to `config/eks.yaml` and introduces the `auto-mode.yaml` mixin. Auto Mode delegates node provisioning (replacing Karpenter controller), ELB management (replacing ALB controller), and EBS storage to AWS. This reduces operational overhead by eliminating 3 self-managed components.

**Alternatives considered**:
- Self-managed Karpenter + ALB controller (previous default) — more operational burden
- Fargate-only — too many limitations (no daemonsets, no GPU, no HostPort)

### 2. Component Removal/Rename Mapping

**Decision**: Document the following component changes:

| Old Component | New State | Migration Notes |
|---------------|-----------|-----------------|
| `eks/karpenter` (controller) | Removed | Auto Mode manages nodes; no replacement needed |
| `eks/alb-controller` | Removed | Auto Mode manages ELB; no replacement needed |
| `eks/alb-controller-ingress-group` | Renamed to `eks/ingress-class` | Component vendored from `aws-eks-alb-controller-ingress-class` v2.1.0 |
| `eks/karpenter-node-pool` | Updated to v3.0.0 | Still needed for additional node pools beyond Auto Mode defaults |

**Rationale**: Direct mapping from PR #897 file changes. The `eks/karpenter` and `eks/alb-controller` components and their catalog entries were deleted. `alb-controller-ingress-group` was renamed to `ingress-class`.

### 3. EKS Capabilities Feature

**Decision**: Document three capability types with per-stage configuration.

**Rationale**: PR #897 introduces two new mixin files:
- `capabilities-all.yaml` — enables Argo CD + ACK + KRO (used in dev)
- `capabilities-argocd.yaml` — enables Argo CD only (used in staging/prod)
- `core-auto` gets no capabilities

The IDC instance ARN is resolved dynamically from the `aws-sso` component via `!terraform.state`.

**Alternatives considered**: Self-managed Argo CD via Helm chart — still available when `auto_mode_enabled` is false, but no longer the default path.

### 4. Atmos Auth for kubectl

**Decision**: Document `atmos auth exec --identity=<account>/terraform -- kubectl <command>` pattern.

**Rationale**: The `terraform` identity has EKS cluster access. This pattern is consistent with existing `atmos auth exec` examples already documented for AWS CLI usage. No kubeconfig setup scripts needed.

**Alternatives considered**: Geodesic `set-cluster` script — still works but is optional/legacy approach.

### 5. Deploy Workflow Changes

**Decision**: Update deploy-clusters.mdx to reflect the new workflow steps.

**Rationale**: PR #897 modifies `stacks/workflows/quickstart/platform/eks.yaml`:
- Vendor: removed `eks/karpenter`, `eks/alb-controller`, `eks/alb-controller-ingress-group`; added `eks/ingress-class`
- Deploy/cluster: added `eks/ingress-class`
- Deploy/resources: removed `eks/karpenter`, `eks/alb-controller`, `eks/alb-controller-ingress-group`, `eks/alb-controller-ingress-group/internal`
- Destroy: removed the same; added `eks/ingress-class`

Note: The deploy-clusters.mdx page uses `<AtmosWorkflow>` React components that render workflow YAML from `examples/snippets/`. The snippets come from refarch-scaffold and will be updated separately. The page text descriptions need updating.

### 6. Legacy Content Treatment

**Decision**: Keep obsolete FAQ/design-decision content but mark as legacy with admonition.

**Rationale**: Clarification session decision. Existing users with pre-Auto-Mode deployments still reference these pages. A `:::caution Legacy` admonition with a forward pointer preserves value.

### 7. Auto Mode Addons

**Decision**: Document which addons Auto Mode manages vs. self-managed.

**Rationale**: From the `auto-mode.yaml` mixin:
- **Auto Mode managed** (set to `enabled: false`): vpc-cni, kube-proxy, coredns, aws-ebs-csi-driver
- **Self-managed** (still required): aws-efs-csi-driver

### 8. Storage Class Provisioner Change

**Decision**: Note that EBS storage classes use `ebs.csi.eks.amazonaws.com` provisioner under Auto Mode.

**Rationale**: PR #897 adds `provisioner: ebs.csi.eks.amazonaws.com` to storage class defaults. This is the Auto Mode EBS CSI provisioner.
