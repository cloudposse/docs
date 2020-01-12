---
title: "What's the relationship between `kube-dns` and `coredns`?"
description: "Both `kube-dns` and `coredns` do the same thing. Earlier versions of Kubernetes used `kube-dns`. "
tags:
- kube-dns
- coredns
- Kubernetes
---

## Question

What's the relationship between `kube-dns` and `coredns`?


## Answer

The `coredns` service went GA in Kubernetes 1.11. It just comes down to what version of k8s is running. Practically speaking, there’s no difference between them. We might refer to `kube-dns` in our documentation, but what we mean to say is the dns controller that ships with the Kubernetes version.
