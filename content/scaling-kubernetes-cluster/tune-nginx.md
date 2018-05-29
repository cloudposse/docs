---
title: "Tuning Nginx parameters"
description: "Procedures and resources for tuning Nginx parameters"
weight: 7
---

Kubernetes Nginx [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller is built around the [Kubernetes Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/) 
that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) to store the Nginx configuration.

We optimized Nginx configuration settings to fine-tune Nginx performance in a Kubernetes cluster:

{{% include-code-block  title="nginx.conf" file="scaling-kubernetes-cluster/examples/nginx.conf" language="nginx" %}}

As mentioned above, these settings are stored in the Kubernetes cluster as [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/),
and get deployed via [`nginx-ingress`](https://github.com/kubernetes/charts/tree/master/stable/nginx-ingress#configuration) [Helm chart]({{< relref "helm-charts/quickstart.md" >}}).

The `nginx-ingress` chart is deployed from the `geodesic` shell using the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L496).

To apply the new Nginx parameters, modify `controller.config` settings in the [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml#L496) 
and then follow [`Install with Master Helmfile`]({{< relref "kubernetes-backing-services/nginx-ingress-controller.md" >}}) instructions to update the cluster with the new Nginx settings.


{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
For more information, check out the following links:

* https://www.nginx.com/blog/performance-tuning-tips-tricks/

* https://www.nginx.com/blog/tuning-nginx/

* https://blog.codeship.com/tuning-nginx/

* https://www.revsys.com/12days/nginx-tuning/

* https://github.com/kubernetes/ingress-nginx

{{% /dialog %}}
