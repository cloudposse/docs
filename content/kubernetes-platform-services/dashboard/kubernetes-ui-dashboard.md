---
title: "Kubernetes UI Dashboard"
description: "The Kubernetes Dashboard is a web-based UI for managing Kubernetes clusters and allows users to manage and troubleshoot applications running on Kubernetes"
weight: 1
---

# Dependencies

* None

# Installation

You can install `kubernetes-dashboard` in a few different ways, but we recommend to use the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0610.dashboard.yaml).

The Kubernetes dashboard requires [heapster](https://github.com/kubernetes/heapster) to collect and interpret various signals like compute and memory resource usage and lifecycle events.

You can skip `heapster` installation if there is no need to monitor resources.

## Install with Master Helmfile

Run the following commands:
```bash
helmfile --selector chart=heapster sync

helmfile --selector chart=kubernetes-dashboard sync
```

These environment variables are used to configure the service:

* `KUBERNETES_DASHBOARD_IMAGE_TAG` - version of [kubernetes dashboard image](https://github.com/kubernetes/dashboard/releases)
* `HEAPSTER_REPLICA_COUNT` - `heapster` replica count
* `HEAPSTER_IMAGE_TAG` - version of [heapster](https://github.com/kubernetes/heapster/releases)

Environment variables can be specified in either the Geodesic module's `Dockerfile` or with [chamber]({{< relref "tools/chamber.md" >}}).

## Install with Custom Helmfile

Add this code to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile

{{% include-code-block  title="helmfile" file="kubernetes-platform-services/dashboard/examples/kubernetes-dashboard-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage

* [Cluster Portal]({{< relref "kubernetes-platform-services/dashboard/cluster-portal.md" >}}) describes usage and how to expose Kubernetes UI Dashboard publicly
