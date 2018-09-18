---
title: "Prometheus Operator"
description: ""
---
[PrometheusOperator](https://github.com/coreos/prometheus-operator) provides
[CRUD](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
that simplifies creation/configuration/management of [Prometheus]({{< relref "monitoring-and-alerting/prometheus.md" >}}) and [AlertManager]({{< relref "monitoring-and-alerting/alert-manager.md" >}}).

# Dependencies

None

# Install

You can install `prometheus-operator` in a few different ways, but we recommend to use the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0000.prometheus-operator.yaml).

## Install using Helmfile

To install `prometheus-operator` run

{{% dialog type="code-block" icon="fa fa-code" title="Install prometheus-operator" %}}
```
helmfile --selector chart=prometheus-operator sync
```
{{% /dialog %}}

These are some of the environment variables you may want to configure:

* `PROMETHEUS_OPERATOR_IMAGE_TAG` - Version of [`prometheus-operator` image](https://quay.io/repository/coreos/prometheus-operator)
* `PROMETHEUS_OPERATOR_GLOBAL_HYPERKUBE_IMAGE_TAG` - Version of [`hyperkube` image](https://quay.io/repository/coreos/hyperkube)
* `PROMETHEUS_OPERATOR_PROMETHEUS_CONFIG_RELOADER_IMAGE_TAG` - Version of [`prometheus-config-reloader` image](https://quay.io/repository/coreos/prometheus-config-reloader)
* `PROMETHEUS_OPERATOR_CONFIGMAP_RELOAD_IMAGE_TAG` - Version of [`configmap-reload` image](https://quay.io/repository/coreos/configmap-reload)

Environment variables can be specified in the Geodesic Module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage, which is recommended for all secrets.

## Install using Custom Helmfile

Add this code to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile:

{{% include-code-block  title="helmfile" file="kubernetes-backing-services/monitoring/examples/prometheus-operator-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage

Prometheus operator provides these new Kubernetes resources:

* Prometheus
* ServiceMonitor
* Alertmanager

These resources can be configured to interact with each other.

{{% dialog type="tip" icon="fa fa-hand-o-right" title="Tip" %}}
We recommend to install [kube-prometheus]({{< relref "kubernetes-backing-services/monitoring/kube-prometheus.md" >}})
that installs Prometheus, AlertManager and ServiceMonitors+Exporters to collect all required metrics from Kubernetes cluster.
{{% /dialog %}}

## Prometheus

[Read More](https://github.com/coreos/prometheus-operator/blob/master/Documentation/design.md#prometheus) about the Prometheus design.

## Alertmanager

[Read More](https://github.com/coreos/prometheus-operator/blob/master/Documentation/design.md#alertmanager) about the Alertmanager design.

## ServiceMonitor

[Read More](https://github.com/coreos/prometheus-operator/blob/master/Documentation/design.md#servicemonitor) about the ServiceMonitor design.
