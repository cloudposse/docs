---
title: "Decide on Kubernetes Ingress Controller(s)"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176372152
sidebar_position: 100
refarch_id: REFARCH-300
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-kubernetes-ingress-controller-s.md
---

# Decide on Kubernetes Ingress Controller(s)

## Considerations

Kubernetes supports any number of ingress controllers deployed multiple times. The choice of Ingress controller will
determine which AWS features we can natively support (e.g. WAF requires an ALB).

Our recommendation is to use the `aws-loadbalancer-controller` (aka `aws-alb-ingress-controller` v2) with ACM
certificates provisioned by terraform.

:::caution TLS terminates at the ALB. It’s then _optionally_ unencrypted if the downstream services support it, such as
with self-signed certificates and a TLS sidecar like Envoy or Nginx. Without this, traffic is in clear-text between the
ALB and the downstream service or pod.

:::

Historically, we’ve recommended `ingress-nginx` (formerly `nginx-ingress`), but prefer to use the AWS load balancer
controller due to it’s native support by AWS.
