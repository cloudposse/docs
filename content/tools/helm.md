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

To install the `tiller`, just run `helm init` from the Geodesic shell after assumming-role and running `kops export kubecfg`.

```
assume-role
kops export kubecfg
helm init
```

(Note, in older versions of `kops` you will need to pass the cluster name, so run `kops export kubecfg $KOPS_CLUSTER_NAME`)

# Delete All Releases in Namespace

To delete all helm releases in `NAMESPACE`, run the following command:
```
helm list --namespace $NAMESPACE --short | xargs helm delete --purge
```

{{% dialog type="info" icon="fa fa-info-circle" title="Note" %}}
Deleting releases will not delete the namespace itself. This is because there may be other artifacts. For a more detailed discussion on the pros & cons of this, check out the [GitHub issue](https://github.com/kubernetes/helm/issues/1464) tracking this topic.
{{% /dialog %}}

Then after running this command, to delete the namespace, run:

```
kubectl delete namespace $NAMESPACE
```
