---
title: "Decide on ArgoCD Deployment Repo Architecture"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171947862/REFARCH-405+-+Decide+on+ArgoCD+Deployment+Repo+Architecture
sidebar_position: 100
refarch_id: REFARCH-405
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-release-engineering/decide-on-argocd-deployment-repo-architecture.md
---

# Decide on ArgoCD Deployment Repo Architecture

### Context

ArgoCD synchronizes the state of Kubernetes with some repo/branch/directory in your VCS system. There’s no canonical way to do it. There are many variations as well.

## Examples

- 1 repo per cluster

- 1 repo for multiple clusters, multiple repos for multiple groups of clusters

- 1 branch per cluster

- 1 directory per cluster

## Considerations

The more repos, the harder to update multiple clusters at a time

The more clusters in one repo, the larger the git commit history

With one repo per cluster, every time a new clsuter is created, a new repo needs to be created as well.

With fewer repos, the more contention working with Git. Git sucks for high throughput.

## Recommendation

Our recommendation is ~3 repos, with multiple clusters in each:

- prod (all production clusters)

- use main branch to represent deployed state for all clusters

- use one directory per cluster, namespace

- use branch protections to restrict commits

- non-prod (all non-production clusters)

- use main branch to represent deployed state for all clusters

- use one directory per cluster, namespace

- use branch protections to restrict commits

- preview (all preview environments)

- avoid polluting the git history

- no branch protections

## Related

- [Decide on ArgoCD Architecture](/reference-architecture/fundamentals/design-decisions/foundational-release-engineering/decide-on-argocd-architecture)

