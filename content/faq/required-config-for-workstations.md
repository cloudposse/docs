---
title: "How much configuration is required for setting up OpenVPN?"
description: "We provide a robust Helm chart to deploy OpenVPN with SSO integration and short-lived client certificates. After installing a VPN client like Viscosity, a user only needs to log in with their SSO credentials and download the VPN configuration."
tags:
- workstation
- proxy
- VPN
- OpenVPN
- SSO
- Viscosity
---

## Question

How much configuration is required to use OpenVPN?

## Answer

If a VPN is absolutely necessary, then we provide a [robust chart](https://github.com/cloudposse/charts/tree/master/incubator/openvpn) to deploy OpenVPN with SSO integration and short-lived client certificates. This requires almost no local workstation configuration. Simply install the OpenVPN client of your choice (we prefer Viscosity), and visit the SSO login page for the VPN to obtain your short-lived credentials as a .ovpn file that will be automatically imported when downloaded by the user.

**NOTE** We recommend using an Identity Aware Proxy instead of a traditional VPN.
