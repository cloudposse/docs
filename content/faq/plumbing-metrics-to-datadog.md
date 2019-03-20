---
title: "How are we plumbing metrics to Datadog?"
description: "To date, we setup Datadog metrics and log forwarding."
tags:
- Datadog
- metrics
- Prometheus
- Grafana
---

## Question

How are we plumbing metrics to Datadog to support our existing monitors/alerts?

## Answer

To date, we setup Datadog metrics and log forwarding. We've not fine-tuned Datadog for operational intelligence. We're banking mostly on Prometheus and Grafana, since that seems to be where most momentum is in the community.

We are able to funnel Prometheus metrics to Datadog to enable compatibility with existing workflows. We recommend deploying both; that will provide a point of comparison. There are some canned dashboards in Datadog for Kubernetes. However, they are pretty weak when compared to the ones provided by the community for Grafana.
