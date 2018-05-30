---
title: "Scale Nginx Ingress Pods Vertically"
description: "Procedures to scale Nginx Ingress pods vertically by increasing CPU and memory limits"
weight: 6
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage]({{< relref "geodesic/module/with-kops.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Kubernetes Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is built around the [Kubernetes Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/) 
that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) to store the Nginx configuration.

Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is deployed by [`nginx-ingress`](https://github.com/kubernetes/charts/tree/master/stable/nginx-ingress) [Helm chart]({{< relref "helm-charts/quickstart.md" >}}).

The `nginx-ingress` chart itself is deployed from the `geodesic` shell using the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml).

To scale Nginx Ingress pods vertically, update the following settings for `nginx-ingress` in the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml):

* `resources.limits.cpu`
* `resources.limits.memory`
* `resources.requests.cpu`
* `resources.requests.memory`
* `nginx-default-backend.resources.limits.cpu`
* `nginx-default-backend.resources.limits.memory`
* `nginx-default-backend.resources.requests.cpu`
* `nginx-default-backend.resources.requests.memory`

Then follow [`Install with Master Helmfile`]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md" >}}) instructions to update the cluster with the new settings.
