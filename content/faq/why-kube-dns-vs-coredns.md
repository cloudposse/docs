---
title: "Why do you refer to kube-dns?"
description: "It just comes down to what version of k8s we’re running."
tags:
- kube-dns
- coredns
- Kubernetes
---

## Question

Why do you refer to `kube-dns` instead of `coredns`?


## Answer

The `coredns` service went GA in Kubernetes 1.11. It just comes down to what version of k8s we’re running. Practically speaking, there’s no difference between them. When we refer to `kube-dns`, just think that it’s the "dns provider" that ships with the Kubernetes version.
