---
title: "How should we monitor our applications running under Kubernetes?"
description: "We recommend using a combination of Prometheus and Grafana custom dashboards."
tags:
- Grafana
- Prometheus
- Kubernetes
- metrics
- logs
- Datadog
- CloudWatch
- Sumologic
- ELK
- EFK
---

## Question

How should we monitor our applications running under Kubernetes? Our internal applications generate logs and export metrics. Is it possible to provide a dashboard where these are displayed?

## Answer

In the past, we've used Sumologic, CloudWatch Logs and Datadog Logs to aggregate logs from all Kubernetes pods. For self-hosted alternatives, we would rollout EFK (ElasticSearch, [Fluentd](https://github.com/kubernetes/charts/tree/master/incubator/fluentd-elasticsearch) and [Kibana](https://github.com/kubernetes/charts/tree/master/stable/kibana)) to aggregate logs.

We do not recommend using a log aggregation framework in place of a metrics framework. While some systems try to do this (e.g. Sumologic), we prefer purpose-built tools. So we recommend running both a metrics-based platform in addition to a text/log based platform.

For metrics, we suggest using [Prometheus](https://prometheus.io/) combined with [Grafana](https://grafana.com/) for visualization.
