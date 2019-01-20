---
title: "Does an IAP handle non-HTTP traffic?"
description: "IAP does not handle non-HTTP traffic because it’s designed to work with OAuth 2."
tags:
- Identity-Aware Proxy
- non-HTTP traffic
- OAuth 2
---

## Question

If we use an Identity-Aware Proxy (IAP), how does it handle non-HTTP traffic?

## Answer

IAP does not handle non-HTTP traffic because it’s designed to work with OAuth 2, which is strictly an HTTP-based authentication scheme. Non-HTTP traffic must flow over SSH tunnels or via a VPN (e.g. OpenVPN).
