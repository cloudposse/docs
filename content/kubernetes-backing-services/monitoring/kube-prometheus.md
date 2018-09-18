---
title: "Kube Prometheus"
description: "Kube Prometheus provides an easy-to-operate end-to-end Kubernetes cluster monitoring solution using Prometheus together with `PrometheusOperator`."
tags:
- "grafana"
- "prometheus"
- "alert-manager"
---

[Kube Prometheus](https://github.com/coreos/prometheus-operator/tree/master/helm/kube-prometheus) provides an easy-to-operate end-to-end Kubernetes cluster monitoring solution using Prometheus together with `PrometheusOperator`.

Kube Prometheus includes the following packages:

* [Prometheus](https://github.com/coreos/prometheus-operator/tree/master/helm/prometheus)
* [Grafana](https://github.com/coreos/prometheus-operator/tree/master/helm/grafana)
* [Alert Manager](https://github.com/coreos/prometheus-operator/tree/master/helm/alertmanager)
* [Kube Controller Manager Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-controller-manager)
* [Kube DNS Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-dns)
* [Kube Etcd Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-etcd)
* [Kube Scheduler Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-scheduler)
* [Kube State Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-state)
* [Kubelets Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kubelets)
* [Kubernetes Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kubernetes)
* [Node Exporter](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-node)

# Dependencies

[Prometheus Operator]({{< relref "kubernetes-backing-services/monitoring/prometheus-operator.md" >}})

# Install

You can install `kube-prometheus` in a few different ways, but we recommend to use the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0400.kube-prometheus.yaml).

## Install using Helmfile

To install `kube-prometheus` run:

{{% dialog type="code-block" icon="fa fa-code" title="Install kube-prometheus" %}}
```
helmfile --selector chart=kube-prometheus sync
```
{{% /dialog %}}

These are some of the environment variables you may want to configure:

* `KUBE_PROMETHEUS_REPLICA_COUNT` - `Prometheus` pod replica count
* `KUBE_PROMETHEUS_IMAGE_TAG` -Version of [`prometheus` image](https://quay.io/repository/prometheus/prometheus)
* `KUBE_PROMETHEUS_ALERT_MANAGER_REPLICA_COUNT` - `Alertmanager` pod replica count
* `KUBE_PROMETHEUS_ALERT_MANAGER_IMAGE_TAG` - Version of [`alert manager` image](https://quay.io/repository/prometheus/alertmanager)
* `KUBE_PROMETHEUS_ALERT_MANAGER_SLACK_WEBHOOK_URL` - [Slack webhook url](https://api.slack.com/incoming-webhooks) that would be triggered on alert
* `KUBE_PROMETHEUS_ALERT_MANAGER_SLACK_CHANNEL` - [Slack channel](https://get.slack.help/hc/en-us/articles/201402297-Create-a-channel) where alerts would be posted

Environment variables can be specified in the Geodesic Module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage, which is recommended for all secrets.

## Install using Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile" file="kubernetes-backing-services/monitoring/examples/prometheus-operator-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Extending Functionality

You can extend the default functionality of `kube-prometheus` to collect custom
metrics and send alerts based on the metrics, and display the metric in Grafana charts.

## Custom Metrics Collection

1. Check the [list of available exporters](https://prometheus.io/docs/instrumenting/exporters) to make sure there isn't already an Exporter that will meet your needs. For example, there are exporters that will work with [JMX](https://github.com/prometheus/jmx_exporter) out-of-the-box.
2. If there is no exporter, then you'll need to [write your own](https://prometheus.io/docs/instrumenting/writing_exporters/) exporter that will provide required [metrics in correct format](https://prometheus.io/docs/instrumenting/exposition_formats/)
3. Create a Kubernetes service that provides an [exporter http endpoint](https://kubernetes.io/docs/concepts/services-networking/service). We recommend then deploying this service using a Helm Chart.
4. Register the exporter for service discovery by creating a Kubernetes resource of type `ServiceMonitor` that points to the service created in step 3.

### Examples

* Running Exporters with [Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/user-guides/running-exporters.html)
* Custom configuration of [Service Monitor](https://coreos.com/operators/prometheus/docs/latest/custom-configuration.html)
* Helm chart that exposes [Etcd metrics](https://github.com/coreos/prometheus-operator/tree/master/helm/exporter-kube-etcd)

## Custom Dashboards using Grafana

Before you start, read the basic introduction about grafana [dashboards and panels](http://docs.grafana.org/features/panels/graph/)

* Sign-in to the Kubernetes Portal. Then navigate to "Grafana".
{{< img src="/assets/kube-prometheus-4f06031c.png" title="https://grafana.portal.us-west-2.staging.example.com" >}}
* Login to Grafana (default credentials are `admin/admin`)
{{< img src="/assets/kube-prometheus-f5f4472c.png" title="https://grafana.portal.us-west-2.staging.example.com/login?redirect=%2F" >}}
{{< img src="/assets/kube-prometheus-d0d17131.png" title="Grafana homepage authentificated user" >}}
* Create dashboard
{{< img src="/assets/kube-prometheus-ce3e9690.png" title="https://grafana.portal.us-west-2.staging.example.com/dashboard/new?orgId=1" >}}
Follow [Grafana dashboards documentations](http://docs.grafana.org/reference/templating/), read nice post [How to Create Your Own Grafana Dashboards](https://mapr.com/support/s/article/How-to-Create-Your-Own-Grafana-Dashboards?language=en_US) or watch
[Beginners guide to building dashboards](https://www.youtube.com/watch?v=&index=7&list=PLDGkOdUX1Ujo3wHw9-z5Vo12YLqXRjzg2)
{{< youtube sKNZMtoSHN4 >}}

* [Export dashboard to JSON](http://docs.grafana.org/reference/export_import/#exporting-a-dashboard)

The next steps depend on the way you installed `kube-prometheus`

### Installation using Master Helmfile

* Put the exported content into the `/conf/kops/values/kube-prometheus.grafana.dashboards.yaml`
in format

```yaml
grafana:
  serverDashboardFiles:
    dashboard_unique_file_name.json: |-
      EXPORTED CONTENT GOES HERE
```
* [Rebuild the Geodesic Module]({{< relref "geodesic/module/quickstart.md#build-install" >}})
* [Run into the Geodesic Module shell]({{< relref "geodesic/module/quickstart.md#run-the-shell" >}})
* Proceed to [install using the Master Helmfile]({{< relref "#install-using-helmfile" >}})

### Installation using Custom Helmfile

* Put the exported content into the `value.yaml` file in this format

```yaml
grafana:
  serverDashboardFiles:
    dashboard_unique_file_name.json: |-
      EXPORTED CONTENT GOES HERE
```

* Make sure to use the `value.yaml` file in the custom `helmfile`

```yaml
values:
  - "value.yaml"
```

* Proceed to [Install using Custom Helmfile]({{< relref "#install-using-custom-helmfile" >}})
