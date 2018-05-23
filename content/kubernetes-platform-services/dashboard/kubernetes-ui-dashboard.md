---
title: "Kubernetes UI Dashboard"
description: ""
---

# Dependencies

* None

# Install

You can install `kubernetes-dashboard` in a few different ways, but we recomend to use the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml).

Kubernetes dashboard required `heapster` to show `cpu` and `memory` charts on dashboard.
You can skip install `heapster` if there is no need in resources chart.

## Install with Master Helmfile

Run following command
```
helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=kubernetes-dashboard sync
helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=heapster sync
```
This environment variables can be useful for configure:

* `KUBERNETES_DASHBOARD_IMAGE_TAG` - Version of [kubernetes dashboard image](https://github.com/kubernetes/dashboard/releases)
* `HEAPSTER_REPLICA_COUNT` - Count of `heapster` pods
* `HEAPSTER_IMAGE_TAG` - Version of [heapster](https://github.com/kubernetes/heapster/releases)

Environment variables can be specified in Geodesic Module `Dockerfile` or in [Chamber]({{< relref "tools/chamber.md" >}}) storage.

## Install with Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-platform-services/dashboard/examples/kubernetes-dashboard-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage
* [Cluster Portal]({{< relref "kubernetes-platform-services/dashboard/cluster-portal.md" >}}) for exposing this publicly
