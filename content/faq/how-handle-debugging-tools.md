---
title: "How do you handle debugging tools?"
description: "What we’ve done in the past for `phpmyadmin` is to roll it out behind an IAP. In this case, we deployed one per cluster using Helm."
tags:
- debugging
- SSH
- Helm
- VPN
- IAP
---

## Question

How do you handle debugging tools like PgHero?

## Answer

Disclaimer: We do not recommend enabling these tools to connect to production environments. This radically complicates security compliance.

We have a customer that creates SSH tunnels via Teleport (and previously regular SSH) as a generalized, ad hoc VPN-over-SSH solution. We think a proper VPN-style solution (if absolutely necessary) would be cleaner. What we’ve done in the past for `phpmyadmin` is to roll it out behind an IAP. In this case, we deployed one per cluster using Helm.
