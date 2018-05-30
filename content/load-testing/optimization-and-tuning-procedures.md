---
title: "Optimization and Tuning Procedures"
description: "Infrastructure and application optimization and tuning after running load tests"
weight: 4
---

Here are some optimization and tuning steps that we usually perform after running load tests:

* Put all static assets behind a CDN (e.g. AWS CloudFront). Do not overload the Kubernetes pods with serving the static assets
* [Scale Cluster Horizontally]({{< relref "kubernetes-optimization/scale-cluster-horizontally.md" >}}) - Scale Kubernetes cluster horizontally by adding nodes
* [Scale Cluster Vertically]({{< relref "kubernetes-optimization/scale-cluster-vertically.md" >}}) - Scale Kubernetes cluster vertically by using different types of EC2 instances
* [Scale Pods Horizontally]({{< relref "kubernetes-optimization/scale-pods-horizontally.md" >}}) - Scale Kubernetes pods horizontally by increasing the replica count
* [Scale Pods Vertically]({{< relref "kubernetes-optimization/scale-pods-vertically.md" >}}) - Scale Kubernetes pods vertically by increasing CPU and Memory limits
* [Scale Nginx Ingress Horizontally]({{< relref "kubernetes-optimization/scale-nginx-ingress-horizontally.md" >}}) - Scale Nginx Ingress pods horizontally by increasing the replica count
* [Scale Nginx Ingress Vertically]({{< relref "kubernetes-optimization/scale-nginx-ingress-vertically.md" >}}) - Scale Nginx Ingress vertically by increasing CPU and Memory limits
* [Tune Nginx]({{< relref "kubernetes-optimization/tune-nginx.md" >}}) - Tune Nginx parameters (timeouts, worker processes, logs, http)
* Optimize application and web servers' parameters (e.g. concurrency, threads and processes, thread pools, timeouts, memory limits)
* [Optimize databases]({{< relref "kubernetes-optimization/optimize-database-indexes.md" >}}) - Optimize database queries and indexes
