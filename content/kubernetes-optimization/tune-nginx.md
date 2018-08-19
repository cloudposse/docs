---
title: "Tune Nginx Parameters"
description: "Procedures and recommendations for tuning Nginx parameters"
weight: 7
tags:
- nginx
- geodesic
- nginx-ingress
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage]({{< relref "geodesic/module/with-kops.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Kubernetes Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is built around the [Kubernetes Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/) 
that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) to store the Nginx configuration.

We optimized Nginx configuration settings to fine-tune Nginx performance in a Kubernetes cluster:

{{% include-code-block  title="nginx.conf" file="kubernetes-optimization/examples/nginx.conf" language="nginx" %}}

As mentioned above, these settings are stored in the Kubernetes cluster as [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/),
and get deployed by [`nginx-ingress`](https://github.com/kubernetes/charts/tree/master/stable/nginx-ingress#configuration) [Helm chart]({{< relref "helm-charts/quickstart.md" >}}).

The `nginx-ingress` chart is deployed from the `geodesic` shell using the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0320.nginx-ingress.yaml).

To apply the new Nginx parameters, modify `controller.config` settings in the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0320.nginx-ingress.yaml) 
and then follow [`Install with Master Helmfile`]({{< relref "kubernetes-backing-services/ingress/nginx-ingress-controller.md" >}}) instructions to update the cluster with the new Nginx settings.


{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
For more information, check out the following links:

* [Performance Tuning Tips and Tricks](https://www.nginx.com/blog/performance-tuning-tips-tricks/)

* [Tuning Nginx](https://www.nginx.com/blog/tuning-nginx/)

* [Nginx Tuning](https://www.revsys.com/12days/nginx-tuning/)

* [Ingress Nginx](https://github.com/kubernetes/ingress-nginx)

{{% /dialog %}}
