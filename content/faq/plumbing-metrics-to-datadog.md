---
title: "How do we ship Kubernetes cluster metrics and logs to Datadog?"
description: "We provide a helmfile to deploy the datadog monitoring agent on Kubernetes."
tags:
- Datadog
- metrics
- Prometheus
- Grafana
- Helmfile
---

## Question

How do we ship Kubernetes cluster metrics and logs to Datadog?

## Answer

We provide a [helmfile](https://github.com/cloudposse/helmfiles) to setup Datadog metrics and log forwarding. 

That said, we have not fine-tuned Datadog for operational intelligence. We invest heavily in Prometheus and Grafana because that has the most community adoption.

We are able to funnel Prometheus metrics to Datadog to enable compatibility with existing workflows. We recommend deploying both Datadog in addtion to Prometheus. The fact is that most Open Source tools that support monitoring out-of-the-box will support Prometheus, not Datadog. Also, we find the community dashboards for Grafana to be more insightful than those provided by Datadog.
