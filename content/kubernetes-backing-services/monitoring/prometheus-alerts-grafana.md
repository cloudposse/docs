---
title: "Prometheus, Alerts & Grafana"
description: "Prometheus is monitoring system and time-series database that works together with Grafana and Alert Manage to provide an end-to-end monitoring platform for Kubernetes."
---
 [Prometheus](https://prometheus.io) is at the heart of the monitoring infrastructure. It works in tandem with [Alert Manager](https://prometheus.io/docs/alerting/alertmanager/), [Grafana](https://grafana.com/) and wide list of [Exporters](https://prometheus.io/docs/instrumenting/exporters/) that provide the metrics for instrumentation.

{{< img src="/assets/324asd-Prometheus_architecture.png" title="Prometheus Monitoring Architecture" >}}

# Prometheus

Prometheus is monitoring system and time-series database.

It is responsible for several things:
* Scrapping metrics data from exporters
* Storing metrics data
* Firing alerts
* Response to queries

Prometheus pulls all metrics from different exporters in the cluster and put that data to the storage.
To get list of available exporters Prometheus use discovery service where available exporters should be registred.

It have list of registred alerts. [Alert](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) is a rule with describes alert conditions based on Prometheus expression language expressions.
When alert conditions became true Prometheus sends alert notification to Alert Manager.

Also Prometheus provide endpoint to query requests for metrics data. Grafana use this endpoint to get data for charts.

# Exporter

Exporter is http service that provide metrics for Prometheus in correct format.

Sometimes this is single service like
[Node exporter](https://github.com/prometheus/node_exporter) that provide some base server metrics (CPU/Memory/etc..)

Sometimes software expose it's metrics in prometheus compateble format. For example you can check this [list](https://prometheus.io/docs/instrumenting/exporters/#software-exposing-prometheus-metrics)

## Collecting Custom Metrics

To collect custom metrics a few things need to happen:
* Need an exporter service to expose metrics to Prometheus
* Need to register the new Exporter service with Prometheus

### Check list

1. Check [list of available exporters](https://prometheus.io/docs/instrumenting/exporters) to make sure there isn't already an Exporter that will meet your needs. For example, there are exporters that will work with [JMX](https://github.com/prometheus/jmx_exporter) out-of-the-box.
2. If there is no exporter, then you'll need to [write your own](https://prometheus.io/docs/instrumenting/writing_exporters/) exporter that will provide required [metrics in correct format](https://prometheus.io/docs/instrumenting/exposition_formats/)
3. Create Kubernetes service that will expose [exporter http endpoint](https://kubernetes.io/docs/concepts/services-networking/service). We recommend then deploying this service using a Helm Chart.
4. Register the exporter for service discovery by creating a Kubernetes resource of type `ServiceMonitor` that points to the service created in step 3.

### Examples

* [Running Exporters with Prometheus Operatort](https://coreos.com/operators/prometheus/docs/latest/user-guides/running-exporters.html)
* [Custom configuration of Service Monitor](https://coreos.com/operators/prometheus/docs/latest/custom-configuration.html)
* [Helm chart that expose etcd metrics](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-etcd)

# Grafana

[Grafana](http://docs.grafana.org/guides/basic_concepts/) is an Open Source tool for data visualization.

[Read more about grafana dashboards and panels](http://docs.grafana.org/features/panels/graph/)

## How to create dashboard or panel

1. Sign-in to the Kubernetes Portal. Then navigate to "Grafana"
2. Login to Grafana (default credentials are admin/admin)
2. Create dashboard
3. Export dashboard to json
4. Put exported content to helm file values
5. Sync helmfile
