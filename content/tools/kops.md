---
title: Kops
excerpt: ''
---

# Quick Start

These instructions are based on [Geodesic](/geodesic), which is a cluster shell that contains a mashup of tools like `kops`, `terraform`, `kubectl`.

## Building Cluster

Start a [Geodesic](/geodesic) cluster shell.

```
assume-role
kops create -f /conf/kops/manifest.yml
```

## Provision Backing Service VPC

## VPC peering

# Helpful Terraform Modules

- [terraform-aws-kops-route53]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-route53.md" >}})
- [terraform-aws-kops-external-dns]({{< relref "terraform-modules/kops-kubernetes/terraform-aws-kops-external-dns.md" >}})

## init.sh

```text
```
