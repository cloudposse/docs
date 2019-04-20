---
title: "Why use `kops` instead of `kubeadm`?"
description: "`kops` handles everything (top to bottom), so that the output is a Kubernetes cluster and a tool to easily manage the lifecycle of the cluster."
tags:
- kops
- kubeadm
- EKS
- Terraform
---

## Question

Why the `kops` approach vs `kubeadm` or EKS?


## Answer

The `kubeadm` tool only addresses bootstrapping the initialization of the Kubernetes configuration on running nodes. Something else needs to orchestrate the instance creation and zero-downtime upgrade process (e.g. `drain+cordon`).

For the same reason, EKS is less than ideal when managed with `terraform`. Terraform is great at basic CRUD (we have the [Terraform modules to do it](https://github.com/cloudposse/terraform-aws-eks-cluster)). However, if you need to coordinate upgrades as a "human operator", then Terraform is not the right tool. Therefore, custom scripting is necessary. Terraform likes to destroy and create resources, not perform some elaborate and coordinated process. On the other hand, the `kops` tool handles everything (top to bottom), so that the output is a Kubernetes cluster and a tool to easily manage the lifecycle of the cluster. Once AWS Fargate supports Kubernetes, then we think EKS is worth reevaluating. Terraform would then be adequate. The `kubeadm` tool was born after `kops` tool; our guess is that if `kops` was started today, then `kubeadm` would be incorporated into the mix.
