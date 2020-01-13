---
title: "How is DNS managed for short-lived environments?"
description: "The `external-dns` controller automatically setups DNS records for these environments."
tags:
- DNS
- feature environments
- unlimited-staging
- external-dns
- route53
- AWS
- ingress
- service
---

## Question

How will DNS be managed for short-lived environments (e.g. for feature branches and Pull Requests)?

## Answer

The `external-dns` controller manages the DNS for PRs. All we need to do is add an annotation to the `Ingress` or `Service` with the desired hostname and then the controller takes care of the rest. It supports AWS, GKE, Cloudflare, Digital Ocean, and Azure environments. 

Alternatlive, wildcard DNS records pointed at the Ingress Load Balancer. This may be used in place of `external-dns`, but that is less flexible because it only supports a flat hostname structure for a single domain.
