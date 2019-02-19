---
title: "Can this infrastructure autoscale at the service/pod level?"
description: "There’s a horizontal pod autoscaler that will grow the number of pods in a deployment."
tags:
- infrastructure
- autoscale
- service
- pod
---

## Question

In what ways can this infrastructure autoscale at the service/pod level?

## Answer

There’s a horizontal pod autoscaler that will grow the number of pods in a deployment. It's also possible to write your own pod scaler. For example, on our Caltech project, a pod autoscaler was written to grow a deployment size based on the size of a Redis-backed queue.
