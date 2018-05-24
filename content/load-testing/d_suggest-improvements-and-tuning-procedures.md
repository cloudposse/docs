---
title: "Suggest improvements and tuning procedures for the infrastructure and application under test"
---

Here are some optimization steps that we usually perform after running load tests:

* Put all static assets behind a CDN (e.g. AWS CloudFront), do not overload the Kubernetes pods with serving the static assets (in may cases, this is one of the main reasons of poor website performance)
* Scale Kubernetes cluster (horizontally by adding nodes or vertically by using different types of EC2 instances)
* Scale Kubernetes pods (horizontally by increasing the replica count)
* Scale pods Memory
* Scale pods CPU
* Scale Nginx Ingress pods (horizontally by increasing the replica count)
* Scale Nginx Ingress CPU and Memory
* Tune Nginx paramaters (e.g timeouts, queues)
* Optimize application/web server parameters (e.g. concurrency, threads and processes, thread pools, timeouts, memory limits)
* Optimize database queries and indexes
