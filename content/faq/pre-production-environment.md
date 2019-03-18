---
title: "What is a pre-production environment?"
description: "Pre-production is for tagged release candidates and runs the same technologies as production, but not on the same scale."
tags:
- pre-production
- staging
- cluster
---

## Question

What does a pre-production environment look like?


## Answer

Pre-production runs in the staging account on the staging cluster. The staging cluster will also run a traditional staging environment, which is pinned to `master`. Pre-production is for tagged release candidates and runs the same technologies as production, but not on the same scale (e.g. RDS and ElastiCache,  not containers for those). It lets you deploy a production release without shipping it to production in an environment that most developers have access to.
