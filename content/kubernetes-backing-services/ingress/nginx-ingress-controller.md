---
title: "Nginx Ingress Controller"
description: "Nginx Ingress Controller is a type of [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-controllers) that uses [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap) to store the Nginx configuration."
---

The Nginx Ingress Controller is a type of [Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-controllers) (think "Load Balancer") that uses a [ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-a-configmap) to store the Nginx configuration.

# Dependencies

None

# Install

You can install the `nginx-ingress` controller in few different ways, but we recommend to use the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0320.nginx-ingress.yaml).

## Install using Master Helmfile

Follow these instructions:

* If you're going to use [External DNS]({{< relref "kubernetes-backing-services/external-dns/external-dns.md" >}}), then set the `NGINX_INGRESS_HOSTNAME` environment variable to domain that will be used with [external-dns]({{< relref "kubernetes-backing-services/external-dns/external-dns.md#usage" >}})
* Run `helmfile sync` with appropriate arguments to apply changes.

{{% dialog type="code-block" icon="fa fa-code" title="Install Ingress" %}}
```
chamber write kops NGINX_INGRESS_HOSTNAME ingress.us-west-2.staging.example.com
chamber exec kops -- helmfile --selector chart=nginx-ingress,repo=stable sync
```
{{% /dialog %}}

These environment variables are supported by the Nginx Ingress in the Master Helmfile:

* `NGINX_INGRESS_REPLICA_COUNT` - Nginx Ingress pod replica count
* `NGINX_INGRESS_IMAGE_TAG` - Version of [`nginx-ingress` image](https://quay.io/kubernetes-ingress-controller/nginx-ingress-controller)
* `NGINX_INGRESS_BACKEND_REPLICA_COUNT` - Nginx default backend pod replica count
* `NGINX_INGRESS_HOSTNAME` - Ingress hostname required by [external dns]({{< relref "kubernetes-backing-services/external-dns/external-dns.md" >}})

Environment variables can be specified in Geodesic Module `Dockerfile` or in [Chamber]({{< relref "tools/chamber.md" >}}) storage.

## Install with custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile" file="kubernetes-backing-services/ingress/examples/nginx-ingress-helmfile.yaml" language="yaml" %}}

Then do [Helmfile]({{< relref "tools/helmfile.md" >}}) sync follow instructions

# Usage

After the ingress controller is installed, you can create [Ingress Resources](/kubernetes-backing-services/ingress/) with [kubectl]({{< relref "kubernetes/kubectl.md" >}}) or specifying them in [Helm Chart](/helm-charts) values directly or with [Helmfile]({{< relref "tools/helmfile.md" >}}).

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/ingress/examples/nginx-ingress-usage-kubectl-resource.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/ingress/examples/nginx-ingress-usage-helm-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile" file="kubernetes-backing-services/ingress/examples/nginx-ingress-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart manifests.

The examples provided here are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
