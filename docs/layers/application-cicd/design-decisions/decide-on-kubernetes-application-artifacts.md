---
title: "Decide on Kubernetes Application Artifacts"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171980462/REFARCH-427+-+Decide+on+Kubernetes+Application+Artifacts
sidebar_position: 100
refarch_id: REFARCH-427
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-kubernetes-application-artifacts.md
---

# Decide on Kubernetes Application Artifacts
We prefer strategies that ship the Application code (e.g. docker images) with the Application configuration (E.g. everything needed to run the application on the platform, such as manifests, IAM roles, etc.)

**Application-specific Infrastructure Considerations**

- IAM roles, SNS topics,

- Does the terraform code live alongside the apps or in the infrastructure mono repo (our preference is alongside the apps).

- When should these infrastructure changes rollout? e.g. before or after application changes.

- If the resources will be shared amongst services, then we should probably not do this for those dependencies and instead move them to shared infrastructure since their lifecycle is not coupled to one application.

**Application Configuration Considerations**

- Raw manifests

- Helm charts

- Kustomize

