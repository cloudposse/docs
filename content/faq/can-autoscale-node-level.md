---
title: "Can this infrastructure autoscale at the node (VM) level?"
description: "Yes, using the cluster autoscaler."
tags:
- infrastructure
- autoscale
- node
- VM
---

## Question

In what ways can this infrastructure autoscale at the node (VM) level?

## Answer

Yes, using the cluster autoscaler. An example of this is our Van Valen Research Lab project. The trick is always when to scale. This will be business specific. Sometimes you scale based on queue size, memory, CPU, or network throughput. Scaling on all dimensions simultaneously is not recommended.
