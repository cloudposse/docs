---
title: "Should we spin up a VPN?"
description: "If absolutely necessary, we provide a robust chart for OpenVPN with SSO integration and short-lived client certificates."
tags:
- VPN
- Identity-Aware Proxy
- OpenVPN
- OAuth 2
- Cloudflare
- Argo
---

## Question

Should we spin up a VPN or rely solely on the Identity-Aware Proxy?

## Answer

Previously, we would spin up OpenVPN + OAuth 2 to grant remote access. However, this method is no longer recommended with the advent of Identity-Aware Proxies (IAPs). We've been using the Bitly OAuth2 proxy. However as of [August 2018](https://github.com/bitly/oauth2_proxy/issues/628), this is EOL and no longer maintained by Bitly.


We're now embracing Cloudflare Access (aka Argo) IAP, which works by installing an ingress in your cluster that punctures out through the firewall to the Cloudflare edge. Cloudflare can then route traffic back to your cluster. This is an incredibly secure strategy where the cluster never requires direct exposure. Cloudflare supports multiple means of authentication, including SAML.

That said, if a VPN is absolutely necessary, we provide a [robust helm chart](https://github.com/cloudposse/charts/tree/master/incubator/openvpn) for OpenVPN with SSO integration and short-lived client certificates.
