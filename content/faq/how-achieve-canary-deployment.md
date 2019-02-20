---
title: "How do we achieve canary deployments?"
description: "The “canary deployment” strategy means different things to different people. There are different kinds of implementations that vary in complexity."
tags:
- canary
- deployment
- Kubernetes
---

## Question

How do we achieve canary deployments on Kubernetes?


## Answer

The “canary deployment” strategy means different things to different people. There are different kinds of implementations that vary in complexity.

By default, Kubernetes does a hybrid of canary and rolling updates. That is, it creates a new replica set without destroying the old one. It then spins up one pod and waits for health checks to complete. If it looks good, then it proceeds to the next one and starts shutting down an old one. If the canaries start dying, then  the rollout is suspended.

Then there is the send "20% of people to the new release" type of canary deployments. We can share strategies for implementing this, but there’s no canonical “best practice” for how to achieve this with Kubernetes. It comes down to business requirements and expectations for how it should work.
