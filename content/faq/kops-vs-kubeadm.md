---
title: "Why the kops approach?"
description: "kops handles everything (top to bottom), so that the output is a Kubernetes cluster and a tool to easily manage the lifecycle of the cluster."
tags:
- kops
- kubeadm
- EKS
- Terraform
---

## Question

Why the `kops` approach vs `kubeadm` or EKS?


## Answer

`kubeadm` only addresses bootstrapping. Something else needs to orchestrate the instance creation and zero-downtime upgrade process (e.g. `drain+cordon`). For the same reason, EKS is less than ideal. Terraform is great at basic CRUD (we have the Terraform modules to do it). However, if you need to coordinate upgrades, then Terraform is not the right tool. Therefore, custom scripting is necessary. Terraform likes to destroy and create resources, not perform some elaborate and coordinated process. `kops` handles everything (top to bottom), so that the output is a Kubernetes cluster and a tool to easily manage the lifecycle of the cluster. Once AWS Fargate supports Kubernetes, then we think EKS is worth reevaluating. Terraform would then be adequate. `kubeadm` was born after `kops`. Our guess is that if `kops` was started today, then `kubeadm` would be incorporated into the mix.
