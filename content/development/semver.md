---
title: Semantic Versioning
description: "Software versioning is the most widely adopted scheme for assigning unique version version numbers to software releases."
tags:
- semver
---

We practice [Semantic Versioning](https://semver.org/) for all projects (e.g. GitHub Tags/Releases, Helm Charts, Terraform Modules, Docker Images). Using this versioning standard helps to reduce the entropy related to [Dependency Hell](https://en.wikipedia.org/wiki/Dependency_hell).

![Image credit: [Gopher Academy](https://blog.gopheracademy.com/advent-2015/semver/)](/assets/aa35c54-semver.png)Image credit: [Gopher Academy](https://blog.gopheracademy.com/advent-2015/semver/)

# Semantics

Generally, all of our versions follow this convention: `X.Y.Z` (e.g. `1.2.3`). Sometimes, we'll use this format: `X.Y.Z-branch` when we need to disambiguate between versions existing in multiple branches.

- **Major Releases** - These are releases when `X` changes. These releases will typically have major changes in the interface. These releases may not be backward-compatible.
- **Minor Releases** - These are releases when `Y` changes. These releases bundle new features, but the interface should be largely the same. Minor releases should be backward-compatible.
- **Patch Releases** - These are releases when `Z` changes. These releases are typically bug fixes which do not introduce new features. These releases are backward-compatible.

We use GitHub tags & releases for all versioning. All docker images follow the same convention.

# Versioning

## 0.X.Y

We always start projects off at `0.1.0`. This is our first release of any project. While we try to keep our interfaces stable, as long as `X=0`, it indicates that our code does not yet have a stable API and may vary radically between minor releases.

## 1.X.Y+

As soon as our code reaches `1.X.Y`, the interface should be relatively stable - that is not changing much between minor releases.

# Implementation

Managing semantic versions should be automated just like everything else in our infrastructure. The [`build-harness`]({{< relref "release-engineering/build-harness.md" >}}) is used by our [Codefresh CI/CD process]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}}) to automatically generate versions based on git history.
