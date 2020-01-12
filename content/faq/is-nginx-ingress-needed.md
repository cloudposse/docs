---
title: "Is the NGINX Ingress Controller needed for internal routing?"
description: "The NGINX Ingress Controller is the de facto open-source ingress for Kubernetes."
tags:
- NGINX
- Kubernetes
- GKE
- ingress
---

## Question

Is the NGINX Ingress Controller needed for internal routing?


## Answer

The NGINX Ingress Controller is the de facto open-source ingress for Kubernetes. It handles all inbound HTTP routing to services based on host and path. There are a number of other ingress controllers, including one that supports the new NLB offering by AWS.

On GKE, deploying an NGINX Ingress Controller is not required, as GKE ties in directly with GCP load balancers. On AWS, the NGINX Ingress Controller is currently (2018) the de facto standard on AWS. However, there are up and coming contenders.

That said, the NGINX Ingress Controller is not uncommon in GKE as well. It operates in tandem with the platform-provided load balancer to route traffic within the cluster. The benefits of using the NGINX Ingress Controller is that you get all the features of NGINX (e.g. lua). The downside is that for very large clusters running thousands of pods, the Community Edition (CE) ingress reloads might be disruptive (which is why there's an enterprise offering by NGINX that supports real-time updates). A cluster can run multiple Ingress Controller deployments—even one per namespace. This can get expensive though, since each NGINX Ingress Controller ships with its own load balancer. An ingress resource then uses an annotation to select an Ingress Controller.
