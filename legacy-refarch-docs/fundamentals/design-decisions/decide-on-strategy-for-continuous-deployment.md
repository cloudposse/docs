---
title: "Decide on Strategy for Continuous Deployment"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1413611568/REFARCH-536+-+Decide+on+Strategy+for+Continuous+Deployment
sidebar_position: 100
refarch_id: REFARCH-536
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/decide-on-strategy-for-continuous-deployment.md
---

# Decide on Strategy for Continuous Deployment

## Context and Problem Statement

Describe why we are making this decision or what problem we are solving.

## Considered Options
- Synchronous (push)

- Depends on platform (e.g. ECS, EKS) or target (e.g. S3, Lambda, CloudFront, CloudFormation)

- Depends on tool (e.g. helm, helmfile, kubectl/kustomize, terraform)

- Asynchronous (pull)

- Depends on platform (e.g. ECS, EKS); we don’t have solutions for targets like (S3, Lambda, CloudFront, CloudFormation) with exception of Spacelift+Terraform

- ArgoCD, FluxCD, Spacelift

### Option 1  (Recommended)

:::tip
Our Recommendation is to use Option 1 because....

:::

#### Pros
-

#### Cons
-

### Option 2

#### Pros
-

#### Cons
-

### Option 3

#### Pros
-

#### Cons
-

## References
- Links to any research, ADRs or related Jiras


