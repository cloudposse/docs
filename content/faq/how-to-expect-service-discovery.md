---
title: "How do we expect to accomplish service discovery?"
description: "Yes, cluster DNS of services."
tags:
- service discovery
- Kubernetes
- DNS
---

## Question

How do we expect to accomplish service discovery? Simple DNS-based using Kubernetes registry?


## Answer

Yes, in Kubernetes, most often service discovery is performed using DNS, which is what Kubernetes ships with out of the box (e.g. `coredns` and `kubedns`).
