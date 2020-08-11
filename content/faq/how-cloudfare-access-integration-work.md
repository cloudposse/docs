---
title: "How does Cloudflare integration work?"
description: "To deploy Argo, we simply deploy it as a second type of ingress in the cluster."
tags:
- cloudflare
- Access
- Argo
- Kubernetes
---

## Question

How does Cloudflare Access/Argo integration work with Kubernetes Ingress?

## Answer

In a Kubernetes cluster, we can run any number of ingress controllers. So to deploy Argo, we simply deploy it as a second type of ingress in the cluster. When a service wants to be public and behind an Identity-Aware Gateway, it sets the `ingress.kubernetes.io` annotation to use the Argo ingress. This will then negotiate with Cloudflare to set up the external DNS and automatically configure the proxy tunnel with signed TLS certificates for HTTPS.

See [here](https://www.cloudflare.com/teams-access/) for more information.
