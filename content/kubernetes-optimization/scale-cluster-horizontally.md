---
title: "Scale Kubernetes Cluster Horizontally"
description: "Procedures to scale Kubernetes cluster horizontally by adding nodes"
weight: 1
tags:
- geodesic
- kops
- kubernetes
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage]({{< relref "geodesic/module/with-kops.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Kops cluster can be scaled horizontally by adding EC2 instances.

Kops supports rolling cluster upgrades where the master and worker nodes are upgraded one by one.

First, in the module's `Dockerfile`, increase `NODE_MAX_SIZE` and `NODE_MIN_SIZE` to reflect the desired number of the worker nodes:

{{% dialog type="code-block" icon="fa fa-code" title="Dockerfile Kops config" %}}
```dockerfile
ENV BASTION_MACHINE_TYPE="t2.medium"
ENV MASTER_MACHINE_TYPE="t2.large"
ENV NODE_MACHINE_TYPE="t2.large"
ENV NODE_MAX_SIZE="3"
ENV NODE_MIN_SIZE="3"
```
{{% /dialog %}}

Rebuild the `geodesic` shell by running:

```sh
make docker/build
```

Then, ensure that the `kubectl` context has been set.

In `geodesic` shell run:

```sh
kops export kubecfg
```

(Note, in older versions of `kops` you will need to pass the cluster name, so run `kops export kubecfg $KOPS_CLUSTER_NAME`)

Check and apply the latest Kubernetes update:

```sh
kops upgrade cluster --yes
```

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
The `--yes` option immediately applies the changes. Not specifying `--yes` works like `terraform plan` and shows the pending changes.
{{% /dialog %}}

Update the Kubernetes state store to match the cluster state. This can be done using the following command:

```sh
kops update cluster --yes
```

Lastly, perform a rolling update for all cluster nodes using the kops `rolling-update` command:

```sh
kops rolling-update cluster --yes
```

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Using `--yes` updates all nodes in the cluster, first master nodes and then worker nodes.
There is a 5-minute delay between restarting master nodes, and a 2-minute delay between restarting nodes.
These values can be altered using `--master-interval` and `--node-interval` options, respectively.

Only the worker nodes may be updated by using the [`--instance-group`](https://github.com/kubernetes/kops/blob/master/docs/instance_groups.md) node option.
{{% /dialog %}}

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
For more information, check out the following links:

* [Manage Kubernetes Clusters on AWS Using Kops](https://aws.amazon.com/blogs/compute/kubernetes-clusters-aws-kops/)

* [Kops Instance Groups](https://github.com/kubernetes/kops/blob/master/docs/instance_groups.md)

* [Installing Kubernetes on AWS with kops](https://kubernetes.io/docs/getting-started-guides/kops/)

* [Lessons learned scaling a cluster](https://medium.com/tailor-tech/production-grade-kubernetes-on-aws-3-lessons-learned-scaling-a-cluster-a421dfe786dd)
{{% /dialog %}}
