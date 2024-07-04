---
title: "Decide on Release Promotion Strategy"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171750987/REFARCH-419+-+Decide+on+Release+Promotion+Strategy
sidebar_position: 100
refarch_id: REFARCH-419
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-release-promotion-strategy.md
---

# Decide on Release Promotion Strategy

### Problem and Context
We need to control when a release is deployed to a given stage (E.g. dev, staging, production).

We must decide how releases will be promoted from staging to production.

How that will be accomplished will depend on whether or not GitHub Enterprise features are available and whether or not it’s possible to use semantic versioning or not.

### Assumptions
- Auto deployment to the `dev` stage will be triggered upon every commit to the default branch (e.g. `main`)

### Options

#### Option A: Automatically Deploy to Staging on Every Release, Use GitHub Approval Steps for Production

##### Pros
- Natively supported by GitHub

- Environment protection rules ensure RBAC restricts who can approve deployments

##### Cons
- Requires GitHub Enterprise, as GitHub Approvals, GitHub Environment protection rules (and Environment Secrets) are only available in GitHub Enterprise.

#### Option B: Automatically Deploy to Staging on Every Release, Use Manual GitHub Action Workflow to Production Deployments

##### Pros
- Does not require GitHub Enterprise

- Staging always represents the latest release

##### Cons
- No environment protection rules; anyone who can run the workflow can deploy. Mitigated by customizing the workflow with business logic to restrict it, but not supported by Cloud Posse today.

#### Option C: Use Manual GitHub Action Workflow for Staging and Production Deployments

##### Pros

- Does not require GitHub Enterprise

- Full control over when every stage is updated

##### Cons

- More manual operations to promote a release

- No environment protection rules; anyone who can run the workflow can deploy. Mitigated by customizing the workflow with business logic to restrict it, but not supported by Cloud Posse today.

### Out of Scope

- Tightly coupled multi-service application deployments

### Related Design Decisions

- [Decide on Database Schema Migration Strategy](/reference-architecture/fundamentals/design-decisions/foundational-platform/decide-on-database-schema-migration-strategy)

### Change History

