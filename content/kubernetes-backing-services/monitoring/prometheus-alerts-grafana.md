---
title: "Prometheus, Alerts & Grafana"
excerpt: ""
---
 [Prometheus](https://prometheus.io) is the heart of monitoring backing service. The other parts are [Alert Manager](https://prometheus.io/docs/alerting/alertmanager/), [Grafana](https://grafana.com/) and wide list of [exporters](https://prometheus.io/docs/instrumenting/exporters/) that are source of metric.

{{< img src="/assets/324asd-Prometheus_architecture.png" title="Architecture" >}}

# Prometheus

Prometheus - is monitoring system and time-series database.

It is responsible for

* Scrapping metrics data
* Store metrics data
* Fire alerts
* Response to queries

Prometheus pull metrics data from different exporters and put that data to the storage.
To get list of available exporters Prometheus use discovery service where available exporters should be registred.

It have list of registred alerts. [Alert](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) is a rule with describes alert conditions based on Prometheus expression language expressions.
When alert conditions became true Prometheus sends alert notification to Alert Manager.

Also Prometheus provide endpoint to query requests for metrics data. Grafana use this endpoint to get data for charts.

# Prometheus Exporter (aka Exporter)

Exporter is http service that provide metrics for Prometheus in correct format.

Sometimes this is single service like
[Node exporter](https://github.com/prometheus/node_exporter) that provide some base server metrics (CPU/Memory/etc..)

Sometimes software expose it's metrics in prometheus compateble format. For example you can check this [list](https://prometheus.io/docs/instrumenting/exporters/#software-exposing-prometheus-metrics)

## How to collect metric

To collecting custom metrics:

* Need an exporter service to expose metrics
* Register the exporter in discovery service

## Check list

1. Check [list of available exporters](https://prometheus.io/docs/instrumenting/exporters)
2. If there is no exporter that you need, feel free to [write your own](https://prometheus.io/docs/instrumenting/writing_exporters/) exporter that will provide required [metric in correct format](https://prometheus.io/docs/instrumenting/exposition_formats/)
3. Create Kubernetes service that will expose [exporter http endpoint](https://kubernetes.io/docs/concepts/services-networking/service) 4. Register exporter in discovery service by creating Kubernetes resource `ServiceMonitor` point to the service created on step 3

Examples:

* [Running Exporters with Prometheus Operatort](https://coreos.com/operators/prometheus/docs/latest/user-guides/running-exporters.html)
* [Custom configuration of Service Monitor](https://coreos.com/operators/prometheus/docs/latest/custom-configuration.html)
* [Helm chart that expose etcd metrics](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-etcd)


# Grafana

[Grafana](http://docs.grafana.org/guides/basic_concepts/) - is tool for visialization data

[Read more about grafana dashboards and panels](http://docs.grafana.org/features/panels/graph/)

## How to create dashboard or panel

1. [Sign-in](https://grafana.ui.staging.aws.popchest.io/login?redirect=%2Fdashboards) Login/Password = admin/admin
2. [Create dashboard](https://grafana.ui.staging.aws.popchest.io/dashboard/new?orgId=1)
3. Export dashboard to json
4. Put exported content to helm file values
5. Sync helmfile
