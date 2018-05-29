---
title: "Optimization and Tuning Procedures"
description: "Infrastructure and application optimization and tuning after running load tests"
weight: 4
---

Here are some optimization and tuning steps that we usually perform after running load tests:

* Put all static assets behind a CDN (e.g. AWS CloudFront), do not overload the Kubernetes pods with serving the static assets (in many cases, this is one of the main reasons of poor website performance)
* [Scale Kubernetes cluster horizontally by adding nodes]({{< relref "scaling-kubernetes-cluster/scale-cluster-horizontally.md" >}})
* [Scale Kubernetes cluster vertically by using different types of EC2 instances]({{< relref "scaling-kubernetes-cluster/scale-cluster-vertically.md" >}})
* [Scale Kubernetes pods horizontally by increasing the replica count]({{< relref "scaling-kubernetes-cluster/scale-pods-horizontally.md" >}})
* [Scale Kubernetes pods vertically by increasing CPU and Memory limits]({{< relref "scaling-kubernetes-cluster/scale-pods-vertically.md" >}})
* [Scale Nginx Ingress pods horizontally by increasing the replica count]({{< relref "scaling-kubernetes-cluster/scale-nginx-ingress-horizontally.md" >}})
* [Scale Nginx Ingress vertically by increasing CPU and Memory limits]({{< relref "scaling-kubernetes-cluster/scale-nginx-ingress-vertically.md" >}})
* [Tune Nginx parameters (e.g timeouts, queues)]({{< relref "scaling-kubernetes-cluster/tune-nginx.md" >}})
* Optimize application and web servers' parameters (e.g. concurrency, threads and processes, thread pools, timeouts, memory limits)
* [Optimize database queries and indexes]({{< relref "scaling-kubernetes-cluster/optimize-database-indexes.md" >}})
