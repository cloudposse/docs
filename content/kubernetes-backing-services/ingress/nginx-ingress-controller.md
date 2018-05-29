---
title: "Nginx Ingress Controller"
description: ""
---
Nginx Ingress Controller is a type of [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-controllers) that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap) to store the nginx configuration.

# Dependencies

None

# Install

You can install `nginx-ingress` in different ways, we recommend to use [Master Helmfile](https://github.com/cloudposse/geodesic/blob/master/rootfs/conf/kops/helmfile.yaml).

## Install with Master Helmfile

Run following command
```
helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=nginx-ingress sync
```

These environment variables are used to configure Nginx Ingress:

* `NGINX_INGRESS_REPLICA_COUNT` - Nginx Ingress pod replica count
* `NGINX_INGRESS_IMAGE_TAG` - version of [nginx ingress image](https://quay.io/kubernetes-ingress-controller/nginx-ingress-controller)
* `NGINX_INGRESS_BACKEND_REPLICA_COUNT` - Nginx Ingress default backend pod replica count
* `NGINX_INGRESS_HOSTNAME` - Ingress hostname required by [external dns]({{< relref "kubernetes-backing-services/external-dns/external-dns.md" >}})

Environment variables can be specified in Geodesic Module `Dockerfile` or in [Chamber]({{< relref "tools/chamber.md" >}}) storage.

## Install with custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-backing-services/ingress/examples/nginx-ingress-helmfile.yaml" language="yaml" %}}

Then do [Helmfile]({{< relref "tools/helmfile.md" >}}) sync follow instructions

# Usage

After uou install the ingress controller, you can create [Ingress Resources](/kubernetes-backing-services/ingress/) with [kubectl]({{< relref "kubernetes/kubectl.md" >}}) or specifying them in [Helm Chart](/helm-charts) values directly or with [Helmfile]({{< relref "tools/helmfile.md" >}}).

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/ingress/examples/nginx-ingress-usage-kubectl-resource.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/ingress/examples/nginx-ingress-usage-helm-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile.yaml" file="kubernetes-backing-services/ingress/examples/nginx-ingress-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart manifests.

Provided examples are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
