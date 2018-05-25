---
title: "Kubernetes UI Dashboard"
description: "The Kubernetes Dashboard is a web-based UI for managing Kubernetes clusters that allows users to manage applications running in the cluster and troubleshoot them."
---

# Dependencies

* None

# Installation

You can install the `kubernetes-dashboard` in a few different ways, but we recommend to use the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml).

The Kubernetes dashboard requires [heapster](https://github.com/kubernetes/heapster) to collect and interpret various signals like compute and memory resource usage and lifecycle events.

You can skip install `heapster`, if there is no need to monitor resources.

## Install with Master Helmfile

Run following command:
```
helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=kubernetes-dashboard sync
helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=heapster sync
```

These environment variables are used to configure the service:

* `KUBERNETES_DASHBOARD_IMAGE_TAG` - Version of [kubernetes dashboard image](https://github.com/kubernetes/dashboard/releases)
* `HEAPSTER_REPLICA_COUNT` - Count of `heapster` pods
* `HEAPSTER_IMAGE_TAG` - Version of [heapster](https://github.com/kubernetes/heapster/releases)

Environment variables can be specified in either the Geodesic Module's `Dockerfile` or with [Chamber]({{< relref "tools/chamber.md" >}}) storage.

## Install with Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-platform-services/dashboard/examples/kubernetes-dashboard-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage
* [Cluster Portal]({{< relref "kubernetes-platform-services/dashboard/cluster-portal.md" >}}) for exposing this service publicly
