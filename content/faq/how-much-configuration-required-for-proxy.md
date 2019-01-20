---
title: "How much configuration is required to use the proxy?"
description: "If a VPN is absolutely necessary, then we provide a robust chart to deploy OpenVPN with SSO integration and short-lived client certificates."
tags:
- workstation
- proxy
- VPN
- OpenVPN
---

## Question

How much configuration is required for workstations to use the proxy?

## Answer

If a VPN is absolutely necessary, then we provide a [robust chart](https://github.com/cloudposse/charts/tree/master/incubator/openvpn) to deploy OpenVPN with SSO integration and short-lived client certificates. This requires almost no local workstation configuration. Simply install the OpenVPN client of your choice (we prefer Viscosity), and visit the SSO login page for the VPN to obtain your short-lived credentials as a .ovpn file that will be automatically imported when downloaded by the user.
