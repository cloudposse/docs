---
title: "Kube Lego (Let's Encrypt)"
description: ""
---

# Dependencies

The way `kube-lego` works is by looking for annotations on `Ingress` and `Service` resources. Thus to use `kube-lego`, it's necessary to first install an [ingress controller]({{< relref "kubernetes-backing-services/ingress/_index.md" >}}).

Out of the box, `kube-lego` support 2 types of [ingress controllers](https://github.com/jetstack/kube-lego#ingress-controllers)
* GCE Load Balancers
* Nginx Ingress Controller

# Install

You can install `kube-lego` in a few different ways, but we recommend to use the [Helmfile](https://github.com/cloudposse/helmfiles/blob/master/helmfile.d/0110.kube-lego.yaml).

## Install with Master Helmfile

1. Set the `KUBE_LEGO_EMAIL` secret with chamber
2. Run then install `kube-lego` using `helmfile sync`.

{{% dialog type="code-block" icon="fa fa-code" title="Install kube-lego" %}}
```
chamber write kops KUBE_LEGO_EMAIL devops@example.com
chamber exec kops --selector chart=kube-lego sync
```
{{% /dialog %}}

These are some of the environment variables you may want to configure:

* `KUBE_LEGO_REPLICA_COUNT` - Count of `kube-lego` pods
* `KUBE_LEGO_IMAGE_TAG` - Version of [`kube-lego` image](https://hub.docker.com/r/jetstack/kube-lego/)
* `KUBE_LEGO_DEBUG` - Boolean to enabled debug mode. Defaults `false`
* `KUBE_LEGO_PROD` - Boolean to enabled prod/stage mode. Defaults `true`

Environment variables can be specified in the Geodesic Module's `Dockerfile` or using [Chamber]({{< relref "tools/chamber.md" >}}) storage, which is recommended for all secrets.

## Install with Custom Helmfile

Add to your [Kubernetes Backing Services](/kubernetes-backing-services) Helmfile this code

{{% include-code-block  title="helmfile" file="kubernetes-backing-services/tls-management/examples/kube-lego-helmfile.yaml" language="yaml" %}}

Then follow the instructions for running [`helmfile sync`]({{< relref "tools/helmfile.md" >}}).

# Usage

To leverage `kube-lego`, you will need to add an annotations (e.g. `kubernetes.io/tls-acme: "true"`) to the `Ingress` resource.

With these in place, then `kube-lego` will handle all e2e TLS certificate issueing and save the certificate from Let's Encrypt to a secret specificied by the `tls` config.

Here are some examples:

{{% include-code-block title="ingress.yaml" file="kubernetes-backing-services/tls-management/examples/kube-lego-usage-ingress.yaml" language="yaml" %}}

{{% include-code-block title="values.yaml" file="kubernetes-backing-services/tls-management/examples/kube-lego-usage-values.yaml" language="yaml" %}}

{{% include-code-block title="helmfile" file="kubernetes-backing-services/tls-management/examples/kube-lego-usage-helmfile.yaml" language="yaml" %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
There is no unified specification for helm chart values structure. Different charts may have very different structures to values. The only way to know for sure what is supported is to refer to the chart manifests.

The examples provided here are based on the `stable/chartmuseum` chart https://github.com/kubernetes/charts/blob/master/stable/chartmuseum
{{% /dialog %}}
