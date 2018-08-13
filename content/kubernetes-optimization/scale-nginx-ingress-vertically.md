---
title: "Scale Nginx Ingress Pods Vertically"
description: "Procedures to scale Nginx Ingress pods vertically by increasing CPU and memory limits"
weight: 6
tags:
- nginx
- ingress
- nginx-ingress
- helm
- chart
---

To scale Nginx Ingress pods vertically, update the following settings for `nginx-ingress` in the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0320.nginx-ingress.yaml):

* `resources.limits.cpu`
* `resources.limits.memory`
* `resources.requests.cpu`
* `resources.requests.memory`
* `nginx-default-backend.resources.limits.cpu`
* `nginx-default-backend.resources.limits.memory`
* `nginx-default-backend.resources.requests.cpu`
* `nginx-default-backend.resources.requests.memory`

Then follow [`Install with Master Helmfile`]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md#install-using-master-helmfile" >}}) instructions to update the cluster with the new settings.
