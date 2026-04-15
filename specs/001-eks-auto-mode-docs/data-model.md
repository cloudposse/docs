# Content Model: EKS Auto Mode Documentation Update

**Date**: 2026-04-15

This feature is a documentation update (no code entities). The "data model" describes the content structure and page-level edit plan.

## Page Edit Map

### 1. `docs/layers/eks/foundational-platform.mdx` (Major Rewrite)

**Current structure**:
- Intro paragraph (Karpenter → ALB controller flow)
- Foundation section (eks/cluster, eks/karpenter, eks/karpenter-provisioner, iam-service-linked-roles, idp-roles, metrics-server, reloader)
- Network section (cert-manager, alb-controller, alb-controller-ingress-group, external-dns, echo-server)
- Storage section (efs, eks/efs-controller)
- Additional Operators section (external-secrets-operator)

**New structure**:
- Intro paragraph — rewrite for Auto Mode flow
- Foundation section:
  - `eks/cluster` — now with Auto Mode enabled
  - Auto Mode description — replaces manual Karpenter controller
  - `eks/karpenter-node-pool` — for additional node pools beyond Auto Mode defaults
  - `iam-service-linked-roles` — still needed
  - `idp-roles`, `metrics-server`, `reloader` — unchanged
- Network section:
  - `cert-manager` — unchanged
  - `eks/ingress-class` — replaces alb-controller + alb-controller-ingress-group
  - `external-dns` — unchanged
  - `echo-server` — unchanged
- **NEW: EKS Capabilities section** (after Network):
  - Argo CD capability — replaces self-managed Argo CD Helm chart
  - ACK capability — AWS Controllers for Kubernetes
  - KRO capability — Kube Resource Orchestrator
  - Per-stage configuration table (dev/staging/prod/core-auto)
- Storage section — unchanged (EFS still self-managed)
- Additional Operators section — unchanged
- **NEW: Migration Notes** (admonition at bottom):
  - Component removal/rename table
  - Link to refarch-scaffold PR #897

### 2. `docs/layers/eks/eks.mdx` (Text Updates)

**Changes**:
- "Our Solution" paragraph: replace Karpenter + ALB controller description with Auto Mode
- Add mention of EKS Capabilities
- Keep all existing reference links

### 3. `docs/layers/eks/deploy-clusters.mdx` (Workflow Step Updates)

**Changes**:
- Step descriptions around `<AtmosWorkflow>` components
- Remove references to deploying karpenter controller, alb-controller, alb-controller-ingress-group
- Add mention of ingress-class in deploy/cluster step
- Note: `<AtmosWorkflow>` components auto-render from snippet files; snippet updates come from refarch-scaffold separately

### 4. `docs/layers/identity/how-to-log-into-aws.mdx` (Add kubectl Section)

**Changes**:
- Add new subsection "EKS/Kubernetes Access" after the "Run a specific AWS CLI command" examples
- Include `atmos auth exec --identity plat-dev/terraform -- kubectl get pods` example
- Include `atmos auth exec --identity plat-dev/terraform -- kubectl get nodes` example
- Note VPN requirement
- Reference the EKS deploy-clusters page

### 5. `docs/layers/eks/faq.mdx` (Legacy Admonition)

**Changes**:
- Add `:::caution Legacy` admonition to the `alb-controller-ingress-group` FAQ entry
- Point to foundational-platform.mdx for the current Auto Mode approach

### 6. `docs/layers/eks/design-decisions/decide-on-kubernetes-ingress-controller-s.mdx` (Legacy Admonition)

**Changes**:
- Add `:::caution Legacy` admonition at top of page
- Note EKS Auto Mode as current default for new deployments
- Keep all existing content

### 7. `docs/layers/eks/design-decisions/decide-on-eks-node-pool-architecture.mdx` (Add Auto Mode Option)

**Changes**:
- Add EKS Auto Mode as option 5 in "Provisioning of Node Pools" section
- Note it as the recommended default for new deployments

## Terminology

| Canonical Term | Avoid | Notes |
|---------------|-------|-------|
| EKS Auto Mode | Auto Mode, auto mode, automode | Always use full "EKS Auto Mode" on first reference per page, then "Auto Mode" |
| EKS Capabilities | EKS capabilities, capabilities | Capitalize as proper noun |
| `eks/ingress-class` | ingress-class, IngressClass component | Use backtick-quoted component name |
| `eks/karpenter-node-pool` | karpenter-node-pool, karpenter node pool | Use backtick-quoted component name |
| Atmos Auth | atmos auth | Capitalize as product name in prose |
