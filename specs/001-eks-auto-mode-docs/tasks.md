# Tasks: EKS Auto Mode Documentation Update

**Input**: Design documents from `/specs/001-eks-auto-mode-docs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: No test tasks — this is a documentation-only feature. Validation is via MDX linting and build verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project initialization needed — all target files already exist. Skip to Foundational.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify current state and identify any internal links that reference obsolete components before editing.

- [x] T001 Grep all MDX files in docs/layers/eks/ for references to "eks/karpenter" (not karpenter-node-pool), "alb-controller", and "alb-controller-ingress-group" to build a complete edit list in docs/docs/layers/eks/
- [x] T002 Grep docs/layers/identity/ and docs/learn/ for references to obsolete EKS components to identify any additional files needing updates in docs/docs/layers/

**Checkpoint**: Full list of files requiring edits is known. User story implementation can begin.

---

## Phase 3: User Story 1 - Update EKS Foundational Platform Documentation (Priority: P1)

**Goal**: Rewrite the foundational platform page to describe EKS Auto Mode architecture instead of manual Karpenter/ALB controller setup.

**Independent Test**: The foundational-platform.mdx page describes Auto Mode, references `eks/ingress-class`, has no mentions of `eks/karpenter` or `eks/alb-controller` as required components, and includes a migration callout.

### Implementation for User Story 1

- [x] T003 [US1] Rewrite intro paragraph in docs/docs/layers/eks/foundational-platform.mdx to describe EKS Auto Mode flow replacing manual Karpenter → ALB controller flow
- [x] T004 [US1] Update Foundation section in docs/docs/layers/eks/foundational-platform.mdx: replace `eks/karpenter` component entry with EKS Auto Mode description, keep `eks/karpenter-node-pool` entry (updated description for v3), keep iam-service-linked-roles/idp-roles/metrics-server/reloader unchanged
- [x] T005 [US1] Update Network section in docs/docs/layers/eks/foundational-platform.mdx: replace `alb-controller` and `alb-controller-ingress-group` entries with `eks/ingress-class` component entry and Auto Mode ELB management description
- [x] T006 [US1] Add Auto Mode info admonition in docs/docs/layers/eks/foundational-platform.mdx noting which addons Auto Mode manages (vpc-cni, kube-proxy, coredns, aws-ebs-csi-driver) vs self-managed (aws-efs-csi-driver), with link to AWS Auto Mode docs
- [x] T007 [US1] Add migration callout admonition at bottom of docs/docs/layers/eks/foundational-platform.mdx with component removal/rename table (eks/karpenter removed, eks/alb-controller removed, alb-controller-ingress-group renamed to ingress-class, karpenter-node-pool updated to v3)

**Checkpoint**: foundational-platform.mdx fully rewritten for Auto Mode. Page can be verified independently via `npm start`.

---

## Phase 4: User Story 2 - Document EKS Capabilities (Priority: P1)

**Goal**: Add documentation for EKS Capabilities (Argo CD, ACK, KRO) with per-stage configuration.

**Independent Test**: A Capabilities section exists in the EKS docs explaining the three types and their per-stage assignments.

### Implementation for User Story 2

- [x] T008 [US2] Add new "EKS Capabilities" subsection after Network section in docs/docs/layers/eks/foundational-platform.mdx describing Argo CD, ACK, and KRO capabilities with per-stage configuration table (dev=all, staging/prod=argocd only, core-auto=none)
- [x] T009 [US2] Update "Our Solution" paragraph in docs/docs/layers/eks/eks.mdx to mention EKS Auto Mode and EKS Capabilities replacing manual Karpenter + ALB controller + self-managed Argo CD setup

**Checkpoint**: EKS Capabilities documented. Both pages can be verified independently via `npm start`.

---

## Phase 5: User Story 3 - Document Atmos Auth for EKS/kubectl Access (Priority: P2)

**Goal**: Add kubectl access examples using `atmos auth exec` to the identity documentation.

**Independent Test**: The login page includes `atmos auth exec` examples with kubectl commands and a VPN requirement note.

### Implementation for User Story 3

- [x] T010 [US3] Add "EKS/Kubernetes Access" subsection in docs/docs/layers/identity/how-to-log-into-aws.mdx after the "Run a specific AWS CLI command" examples, with `atmos auth exec --identity plat-dev/terraform -- kubectl get pods` and `kubectl get nodes` examples, VPN requirement note, and link to EKS deploy-clusters page

**Checkpoint**: kubectl access documented. Page can be verified independently via `npm start`.

---

## Phase 6: User Story 4 - Update Deploy Clusters Guide (Priority: P2)

**Goal**: Update deployment guide step descriptions to reflect Auto Mode workflow changes.

**Independent Test**: The deploy-clusters page descriptions no longer reference karpenter controller, alb-controller, or alb-controller-ingress-group, and mention ingress-class.

### Implementation for User Story 4

- [x] T011 [US4] Update step descriptions in docs/docs/layers/eks/deploy-clusters.mdx: remove references to deploying karpenter controller, alb-controller, alb-controller-ingress-group from explanatory text around AtmosWorkflow components; add mention of ingress-class in deploy/cluster step description; note that Auto Mode handles compute and networking

**Checkpoint**: Deploy guide updated. Page can be verified independently via `npm start`.

---

## Phase 7: User Story 5 - Update EKS FAQ and Design Decisions (Priority: P3)

**Goal**: Mark obsolete FAQ entries and design decisions as legacy with admonitions pointing to Auto Mode docs.

**Independent Test**: FAQ and design decision pages have legacy admonitions on obsolete content.

### Implementation for User Story 5

- [x] T012 [P] [US5] Add `:::caution Legacy` admonition to the "How does the alb-controller-ingress-group determine the name of the ALB?" FAQ entry in docs/docs/layers/eks/faq.mdx, pointing to the EKS Auto Mode section in foundational-platform.mdx and noting `eks/ingress-class` as the replacement
- [x] T013 [P] [US5] Add `:::caution Legacy` admonition at top of docs/docs/layers/eks/design-decisions/decide-on-kubernetes-ingress-controller-s.mdx noting EKS Auto Mode is the current default for new deployments
- [x] T014 [P] [US5] Add EKS Auto Mode as option 5 in "Provisioning of Node Pools" section of docs/docs/layers/eks/design-decisions/decide-on-eks-node-pool-architecture.mdx, noting it as the recommended default for new deployments

**Checkpoint**: All legacy content marked. Pages can be verified independently via `npm start`.

---

## Phase 8: User Story 6 - Document Migration Path (Priority: P3)

**Goal**: Ensure migration guidance exists for users transitioning from old components to Auto Mode.

**Independent Test**: Migration notes exist with the component removal/rename table and links to upgrade guides.

### Implementation for User Story 6

- [x] T015 [US6] Verify migration callout from T007 in docs/docs/layers/eks/foundational-platform.mdx includes links to component UPGRADING.md docs for karpenter-node-pool v3 and ingress-class; add links if missing

**Checkpoint**: Migration path documented. No separate page needed — covered by the admonition in foundational-platform.mdx.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validation across all modified files.

- [x] T016 Run MDX linter: `npx docusaurus-mdx-checker --cwd docs` to verify all modified pages pass
- [x] T017 Run full build: `npm run build` to verify no broken links introduced (pre-existing build error in ecs-atmos docs unrelated to our changes)
- [ ] T018 Start dev server with `npm start` and visually verify each modified page in browser: foundational-platform, eks overview, deploy-clusters, how-to-log-into-aws, faq, and both design-decisions pages
- [x] T019 Grep docs/docs/layers/eks/ for any remaining references to "eks/karpenter" (not karpenter-node-pool), "eks/alb-controller", or "alb-controller-ingress-group" that are not within a legacy admonition or migration callout

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: Depends on Foundational — provides the base rewrite
- **User Story 2 (Phase 4)**: Depends on US1 (adds Capabilities section to the same file US1 rewrites)
- **User Story 3 (Phase 5)**: Depends on Foundational only — different file, can run in parallel with US1/US2
- **User Story 4 (Phase 6)**: Depends on Foundational only — different file, can run in parallel with US1/US2
- **User Story 5 (Phase 7)**: Depends on US1 (legacy admonitions point to Auto Mode docs that US1 creates)
- **User Story 6 (Phase 8)**: Depends on US1 (migration callout created in US1)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependencies on other stories
- **US2 (P1)**: Depends on US1 (adds content to same file)
- **US3 (P2)**: Can start after Foundational — independent file (how-to-log-into-aws.mdx)
- **US4 (P2)**: Can start after Foundational — independent file (deploy-clusters.mdx)
- **US5 (P3)**: Depends on US1 (legacy admonitions reference Auto Mode section)
- **US6 (P3)**: Depends on US1 (verifies migration callout from T007)

### Parallel Opportunities

- T012, T013, T014 can all run in parallel (different files)
- US3 and US4 can run in parallel with each other (different files)
- US3 and US4 can run in parallel with US1 (different files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (grep for references)
2. Complete Phase 3: User Story 1 (rewrite foundational-platform.mdx)
3. **STOP and VALIDATE**: Run MDX linter and build
4. The core Auto Mode documentation is live

### Incremental Delivery

1. US1 → foundational platform rewritten for Auto Mode
2. US2 → EKS Capabilities documented
3. US3 + US4 (parallel) → kubectl access + deploy guide updated
4. US5 → legacy content marked
5. US6 → migration path verified
6. Polish → full validation

### Sequential Execution (Single Developer)

1. T001-T002 (Foundational)
2. T003-T007 (US1 — rewrite foundational platform)
3. T008-T009 (US2 — add Capabilities)
4. T010 (US3 — kubectl access)
5. T011 (US4 — deploy guide)
6. T012-T014 (US5 — legacy admonitions, parallel)
7. T015 (US6 — verify migration)
8. T016-T019 (Polish — validate everything)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
