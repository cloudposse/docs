---
title: "Scale Nginx Ingress pods vertically"
description: "Procedures to scale Nginx Ingress pods vertically by increasing CPU and memory limits"
weight: 6
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage]({{< relref "geodesic/module/with-kops.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Kubernetes Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is built around the [Kubernetes Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/) 
that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) to store the Nginx configuration.

Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is deployed by [`nginx-ingress`](https://github.com/kubernetes/charts/tree/master/stable/nginx-ingress) [Helm chart]({{< relref "helm-charts/quickstart.md" >}}).

The `nginx-ingress` chart itself is deployed from the `geodesic` shell using the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L496).

To scale Nginx Ingress pods vertically, update the following settings in the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L543):

* [`resources.limits.cpu`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L530)
* [`resources.limits.memory`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L533)
* [`resources.requests.cpu`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L536)
* [`resources.requests.memory`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L539)
* [`nginx-default-backend.resources.limits.cpu`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L546)
* [`nginx-default-backend.resources.limits.memory`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L549)
* [`nginx-default-backend.resources.requests.cpu`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L552)
* [`nginx-default-backend.resources.requests.memory`](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L555)

Then follow [`Install with Master Helmfile`]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md" >}}) instructions to update the cluster with the new settings.
