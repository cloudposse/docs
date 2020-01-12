---
title: "Can this infrastructure autoscale at the node (VM) level?"
description: "Yes, node autoscaling is using the Kubernetes cluster autoscaler as well as SpotInst.com."
tags:
- infrastructure
- autoscale
- node
- VM
---

## Question

In what ways can this infrastructure autoscale at the node (VM) level?

## Answer

We've implementeded support for the Kubernetes cluster autoscaler. The trick is always when to scale. This will be business specific based on the workloads. Sometimes you scale based on queue size, memory, CPU, or network throughput. Scaling on all dimensions simultaneously is not recommended. Scaling on request latency is also not recommended as it will often overload upstream resources like databases.
