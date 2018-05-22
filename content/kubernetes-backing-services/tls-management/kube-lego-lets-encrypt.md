---
title: "Kube Lego (Let's Encrypt)"
description: ""
---

# Dependencies

Kubelego use ingress so required [ingress controller]({{< relref "kubernetes-backing-services/ingress/_index.md" >}}) to be installed.

Kubelego support 2 types of [ingress controllers](https://github.com/jetstack/kube-lego#ingress-controllers)
* `GCE Loadbalancers`
* `Nginx Ingress Controller`

# Install

You can install `kubelego` in different ways, we recomend
to use Master Helmfile.

## Install with Master Helmfile

Set `KUBE_LEGO_EMAIL` secret with chamber and run then install kubelego.

{{% dialog type="code-block" icon="fa fa-code" title="Install kubelego" %}}
```
chamber write kops KUBE_LEGO_EMAIL devops@example.com
chamber exec kops -- helmfile -f /conf/kops/helmfile.yaml --selector namespace=kube-system,chart=kube-lego sync
```
{{% /dialog %}}

This environment variables can be useful for configure:

* `KUBE_LEGO_REPLICA_COUNT` - Count of kubelego pods
* `KUBE_LEGO_IMAGE_TAG` - Version of [kube lego image](https://hub.docker.com/r/jetstack/kube-lego/)
* `KUBE_LEGO_DEBUG` - Boolean to enabled debug mode. Defaults `false`
* `KUBE_LEGO_PROD` - Boolean to enabled prod\\stage mode. Defaults `true`

Environment variables can be specified in Geodesic Module `Dockerfile` or in [Chamber]({{< relref "tools/chamber.md" >}}) storage.

## Install with custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile.yaml" file="kubernetes-backing-services/tls-management/examples/kube-lego-helmfile.yaml" language="yaml" %}}

Then do [Helmfile]({{< relref "tools/helmfile.md" >}}) sync follow instructions

# Usage

Add annotation `kubernetes.io/tls-acme: "true"` and `tls` config to ingress resource.
Kube lego will handle TLS certificate issueing and save certificate to secret setted in `tls` config.

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/tls-management/examples/kube-lego-usage-ingress.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/tls-management/examples/kube-lego-usage-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile.yaml" file="kubernetes-backing-services/tls-management/examples/kube-lego-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart manifests.

Provided examples are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
