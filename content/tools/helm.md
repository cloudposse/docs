---
title: Helm
description: 'Helm is package manager for Kubernetes.'
tags:
- tools
---

{{< img src="/assets/helm-d7685fec.png" title="Helm Logo" class="logo" >}}

Helm makes it easy to install `charts` (an application) on kubernetes clusters. Just like `npm` or `apt` make it easy to install NodeJS modules and Debian packages, `helm` makes it easy to deploy a full-fledged application with all of its dependencies on kubernetes.

# Install Tiller

The helm `tiller` is the server-side component of Helm. It's used to cordinate with the kubernetes cluster in order to deploy resources (E.g. `Services`, `Deployments`, `StatefulSets`, etc.)

To install the `tiller`, just run `helm init` from the Geodesic Shell after assumming-role and running `kops export kubecfg $CLUSTER_NAME`.
