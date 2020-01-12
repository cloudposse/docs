---
title: "How are PR environments cleaned up?"
description: "We create a pipeline and associate it with the closed action of a PR."
tags:
- PR
- namespace
- Codefresh
- Helm
---

## Question

How are PR environments cleaned up?


## Answer

We create one namespace per PR. Codefresh intercepts all webhook actions for a PR. We create a pipeline and associate it with the closed action of a PR. This causes the pipeline to execute, which runs a step that deletes all Helm releases for the PR namespace and then deletes the namespace itself.
