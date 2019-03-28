---
title: "How does the ingress properly route"
description: "With ingress, all services share the same load balancer, which is what wildcard DNS is associated with."
tags:
- wildcard DNS
- ingress
- load balancer
---

## Question

If wildcard DNS is used, then how does the ingress properly route?


## Answer

With ingress, all services share the same load balancer, which is what wildcard DNS is associated with. The ingress routes traffic based on `Host+Path` (like Apache Name-based Virtual Hosts).

For more information, see [here.](https://github.com/cloudposse/charts/blob/master/incubator/monochart/templates/ingress.yaml#L24-L30)
