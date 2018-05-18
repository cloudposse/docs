---
title: "Prometheus, Alerts & Grafana"
description: "Prometheus is monitoring system and time-series database that works together with Grafana and Alert Manage to provide an end-to-end monitoring platform for Kubernetes."
---
 [Prometheus](https://prometheus.io) is at the heart of the monitoring infrastructure. It works in concert with [Alert Manager](https://prometheus.io/docs/alerting/alertmanager/), [Grafana](https://grafana.com/) and wide list of [Exporters](https://prometheus.io/docs/instrumenting/exporters/) that provide the metrics for instrumentation.

{{< img src="/assets/324asd-Prometheus_architecture.png" title="Prometheus Monitoring Architecture" >}}

# Prometheus

Prometheus is monitoring system and time-series database.

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

Othertimes, software exposes metrics in a prometheus-compatable format out-of-the-box. For a list of software the integrates natively with Prometheus, check out the [list of software exposing prometheus metrics](https://prometheus.io/docs/instrumenting/exporters/#software-exposing-prometheus-metrics)

## Collecting Custom Metrics

To collect custom metrics a few things need to happen:

* Create an exporter service to expose metrics to Prometheus
* Register the new Exporter service with Prometheus

### Check list

1. Check the [list of available exporters](https://prometheus.io/docs/instrumenting/exporters) to make sure there isn't already an Exporter that will meet your needs. For example, there are exporters that will work with [JMX](https://github.com/prometheus/jmx_exporter) out-of-the-box.
2. If there is no exporter, then you'll need to [write your own](https://prometheus.io/docs/instrumenting/writing_exporters/) exporter that will provide required [metrics in correct format](https://prometheus.io/docs/instrumenting/exposition_formats/)
3. Create a Kubernetes service that provides an [exporter http endpoint](https://kubernetes.io/docs/concepts/services-networking/service). We recommend then deploying this service using a Helm Chart.
4. Register the exporter for service discovery by creating a Kubernetes resource of type `ServiceMonitor` that points to the service created in step 3.

### Examples

* Running Exporters with [Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/user-guides/running-exporters.html)
* Custom configuration of [Service Monitor](https://coreos.com/operators/prometheus/docs/latest/custom-configuration.html)
* Helm chart that exposes [Etcd metrics](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-etcd)

# Grafana

[Grafana](http://docs.grafana.org/guides/basic_concepts/) is an Open Source tool for data visualization.

Read more about grafana [dashboards and panels](http://docs.grafana.org/features/panels/graph/)

## How to create dashboard or panel (high level)

1. Sign-in to the Kubernetes Portal. Then navigate to "Grafana".
2. Login to Grafana (default credentials are admin/admin)
2. Create dashboard
3. Export dashboard to JSON
4. Put exported content to a helm file values
5. Sync `helmfile` with cluster
