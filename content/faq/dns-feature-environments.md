---
title: "How will DNS be managed?"
description: "The external-dns controller manages the DNS for PRs."
tags:
- DNS
- feature environments
- PRs
- AWS
---

## Question

How will DNS be managed for feature/PR environments?


## Answer

The `external-dns` controller manages the DNS for PRs. It supports AWS and GKE environments. Wildcard DNS is sometimes used instead. That’s also cool, but less dynamic.
