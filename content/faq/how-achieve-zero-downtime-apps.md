---
title: "How do we achieve app updates with zero downtime?"
description: "Kubernetes out-of-the-box supports zero-downtime updates."
tags:
- zero downtime
- Kubernetes
- apps
- updates
---

## Question

How do we achieve zero-downtime deploys of app updates?


## Answer

Kubernetes out-of-the-box supports zero-downtime rolling updates. The key is to set the `StrategyType` of the deployment to `RollingUpdate` (which is the default). Additionally, setting `maxUnavailable` to a small number ensures that updates will stop if pods stop dropping offline due to failed health or readiness probes.

Note: This requires applications to implement proper readiness and liveness probes so Kubernetes is able to assess availability. Additionally, the more an application has support for the notion of health, the more reliable it will be. We recommend splitting liveness from readiness probes, so they respond appropriately.
