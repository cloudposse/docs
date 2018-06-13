---
title: "Build Harness"
description: "A build-harness is like a \"[test harness](https://en.wikipedia.org/wiki/Test_harness)\". It provides reusable methods for building and deploying software."
terms:
- build-harness
- build harness
tags:
- best-practice
---
The primary benefit of using a [`build-harness`]({{< relref "release-engineering/build-harness.md" >}}) is it allows for the consolidation of business logic related to building software. This allows to keep things DRY. Using a centralized repo that can be versioned and shared across multiple projects reduces long-term technical debt associated with building and releasing software by reducing maintenance effort.

We provide one that we use in nearly all of our projects. It's available here: <https://github.com/cloudposse/build-harness>
