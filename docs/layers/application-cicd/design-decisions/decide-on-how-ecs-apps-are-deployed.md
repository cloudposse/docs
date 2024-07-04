---
title: "Decide on how ECS apps are deployed"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175847107/REFARCH-411+-+Decide+on+how+ECS+apps+are+deployed
sidebar_position: 100
refarch_id: REFARCH-411
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-how-ecs-apps-are-deployed.md
---

# Decide on how ECS apps are deployed
We need to decide on what methodology to use when deploying applications to ECS.

Think of Helm Charts in Kubernetes as similar to using Terraform Modules for ECS Tasks

#### Deploy using Spacelift

- Github action that triggers Spacelift run which runs atmos and terraform

- Spacelift makes use of rego policies

- Optional manual confirmation

#### Deploy using Github Actions without Spacelift

- Github action runs atmos and terraform directly

- Auto deploy on merges

- Auto deploy on manual cut releases

