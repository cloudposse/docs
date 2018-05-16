---
title: "Ingress Controller"
description: "An Ingress Controller is a native resource type in Kubernetes that functions like a Layer 7 Load Balancer (e.g. HTTP Load Balancer) to route requests to various backend services based on incoming hostname (e.g. `Host` header) and request path (e.g. `/foo`)."
terms:
- Ingress
- Ingress Controller
tags:
- kubernetes
---
The Kubernetes Ingress Controller is a native resource type in Kubernetes that functions like a Layer 7 Load Balancer (e.g. HTTP Load Balancer) to route requests to various backend services based on incoming hostname (e.g. `Host` header) and request path (e.g. `/foo`).

The default Ingress Controller in Kubernetes is powered by Nginx, but this is an implementation detail that is entirely abstracted away from the end user. There are many vendors, in addition to Nginx providing alternative implementations.
