---
title: "Upgrading Kops Clusters"
---
# Upgrading `kops`

To upgrade the `kops` release, there are a couple of options. First check to [see if there a new release of `geodesic`](https://github.com/cloudposse/geodesic/releases) with an upgraded version of `kops`. If there is one and this is the desired release, update the `FROM` image tag in the geodesic module to point to this release.

To explictly upgrade `kops`, add this to the `Dockerfile`.

```
RUN make -C /packages/install kops KOPS_VERSION=1.9.0
```

Find the latest release of kops [here](https://github.com/kubernetes/kops/releases).

Then follow the instructions below for upgrading Kubernetes.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
<https://github.com/kubernetes/kops/blob/master/docs/releases.md>
{{% /dialog %}}

# Upgrading Kubernetes Release

Upgrading `kops` cluster to a new release of kubernetes requires that we upgrade the `kubectl` client in `geodesic` as well as select a kubernetes release that is compatible with kops. Note, `kops` usually lags behind in support for the latest release of Kubernetes. If the latest release of `kops` is `v1.9`, then that means it supports up to kubernetes `v1.9` and will not be compatible with `v1.10` or newer.

To explictly upgrade `kubectl`, add this to the `Dockerfile`

```
RUN make -C /packages/install kubectl KUBECTL_VERSION=1.10.0
```

The `kubectl` release version corresponds to the kubernetes release. Find the latest release of kubernetes [here](https://github.com/kubernetes/kubernetes/releases).

Then follow the [official instructions](https://github.com/kubernetes/kops/blob/master/docs/upgrade.md) for upgrading kops.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
<https://github.com/kubernetes/kops/blob/master/docs/tutorial/upgrading-kubernetes.md>
{{% /dialog %}}

Set the `KUBERNETES_VERSION` in the `Dockerfile`

Then follow the instructions to update the manifest and update the cluster.

# Upgrading EC2 Image for Nodes

Identify the AMI that should be used by following the [official documentation](https://github.com/kubernetes/kops/blob/master/docs/images.md). The latest AMI is published in the [stable channel manifest](https://github.com/kubernetes/kops/blob/master/channels/stable).

The AMI will look something like this:
```
kope.io/k8s-1.7-debian-jessie-amd64-hvm-ebs-2017-07-28
```

Set the `KOPS_BASE_IMAGE` to the latest release AMI in the Geodesic Module's `Dockerfile` and rebuild the container.

Then [rebuild the manifest and update the cluster]({{< relref "geodesic/kops/manifest.md" >}})

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
<https://github.com/kubernetes/kops/blob/master/docs/tutorial/working-with-instancegroups.md#changing-the-image>
{{% /dialog %}}


# Update Manifest

The [`build-kops-manifest`](https://github.com/cloudposse/geodesic/blob/master/rootfs/usr/local/bin/build-kops-manifest) command will regenerate the `/conf/kops/manifest.yaml` file.

```
build-kops-manifest
```

Login to AWS by running `assume-role` and following the prompts.

```
assume-role
```

Update the cluster configuration.

```
kops replace -f /conf/kops/manifest.yaml
```

Apply the configuration changes. Note, this does not update any nodes.

```
kops update cluster --yes
```

Some changes will require rebuilding the nodes (for example, resizing nodes or changing the AMI).

To do this, you'll need to run:

```
kops rolling-update cluster --yes
```

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
* [Scale Cluster Horizontally]({{< relref "kubernetes-optimization/scale-cluster-horizontally.md" >}}) - Scale Kubernetes cluster horizontally by adding nodes
* [Scale Cluster Vertically]({{< relref "kubernetes-optimization/scale-cluster-vertically.md" >}}) - Scale Kubernetes cluster vertically by using different types of EC2 instances
{{% /dialog %}}
