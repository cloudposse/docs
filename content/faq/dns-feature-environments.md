---
title: "How is DNS managed for short-lived environments?"
description: "The `external-dns` controller automatically setups DNS records for these environments."
tags:
- DNS
- feature environments
- unlimited-staging
- AWS
---

## Question

How will DNS be managed for short-lived environments (e.g. for feature branches and Pull Requests)?

## Answer

The `external-dns` controller manages the DNS for PRs. It supports AWS and GKE environments. Wildcard DNS records pointed at the Ingress Load Balancer can be used in place of `external-dns`, but that is less flexible.
