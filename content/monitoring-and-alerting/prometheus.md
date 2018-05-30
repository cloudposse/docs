---
title: "Prometheus"
description: "Prometheus is a monitoring system and time-series database that works together with Grafana and Alert Manager to provide an end-to-end monitoring platform for Kubernetes."
---

[Prometheus](https://prometheus.io) is a monitoring system and time-series database.

Prometheus is at the heart of the monitoring infrastructure. It works in concert with [Alert Manager](https://prometheus.io/docs/alerting/alertmanager/), [Grafana](https://grafana.com/) and wide list of [Exporters](https://prometheus.io/docs/instrumenting/exporters/) that provide the metrics for instrumentation.

{{< img src="/assets/324asd-Prometheus_architecture.png" title="Prometheus Monitoring Architecture" >}}

It is responsible for many things:

* Scrapping metrics data from exporters
* Storing metrics data
* Firing off alert notifications
* Returning metrics in response to API requests

Prometheus harvests metrics by polling all available exporters that have registered with its service discovery API. Every time it polls an exporter, it pulls down metrics which it then stores in a local time series database.

Prometheus has a primitive alert system. It's primitive in the sense that it cannot throttle or aggregate alerts, which is why another system like Alert Manager is needed to properly handle escalations to services like Slack or PagerDuty. An [Alert](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) is a rule which describes alert conditions using the Prometheus expression language.
When alert conditions are satisfied, Prometheus passes alert notifications to [Alert Manager](https://prometheus.io/docs/alerting/alertmanager/) which is responsible for escalating the alerts.

The Prometheus API service is used by other services to query for metrics data. For example, Grafana uses this endpoint to fetch the data needed by charts.

# Prometheus Exporter (aka Exporter)

The Prometheus Exporter is an http service that exposes metrics in a format suitable for Prometheus consumption.

Sometimes this will be a simple service like the
[Node exporter](https://github.com/prometheus/node_exporter) which provides some basic server metrics (e.g. CPU/Memory/etc...)

Othertimes, software exposes metrics in a prometheus-compatable format out-of-the-box. For a list of software that integrates natively with Prometheus, check out the [list of software exposing prometheus metrics](https://prometheus.io/docs/instrumenting/exporters/#software-exposing-prometheus-metrics)

## Collecting Custom Metrics

To collect custom metrics a few things need to happen:

* Create an exporter service to expose metrics to Prometheus
* Register the new Exporter service with Prometheus

In practice we use [Prometheus Operator]({{< relref "kubernetes-backing-services/monitoring/prometheus-operator.md" >}}) to run and configure Prometheus, so follow this [documentation]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}}) to get practical
examples collecting custom mertics.
