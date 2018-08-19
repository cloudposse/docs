---
title: "Scale Nginx Ingress Pods Horizontally"
description: "Procedures to scale Nginx Ingress pods horizontally by increasing the replica count"
weight: 5
tags:
- nginx
- ingress
- nginx-ingress
- helm
- chart
---

Kubernetes Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is built around the [Kubernetes Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/)
that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) to store the Nginx configuration.

Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is deployed by [`nginx-ingress`](https://github.com/kubernetes/charts/tree/master/stable/nginx-ingress) [Helm chart]({{< relref "helm-charts/quickstart.md" >}}).

The `nginx-ingress` chart itself is deployed from the `geodesic` shell using the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0320.nginx-ingress.yaml).

To scale Nginx Ingress pods horizontally, update the following settings for `nginx-ingress` in the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0320.nginx-ingress.yaml):

* `replicaCount`
* `nginx-default-backend.replicaCount`

Then follow the instructions to [`install using the Master Helmfile`]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md#install-using-master-helmfile" >}}) to update the cluster with the new settings.
