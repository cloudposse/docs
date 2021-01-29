---
title: "Scale Kubernetes Cluster Vertically"
description: "Procedures to scale Kubernetes cluster vertically by modifying EC2 instance types"
weight: 2
tags:
- geodesic
- kops
- kubernetes
---

{{% dialog type="warning" icon="fa-info-circle" title="Prerequisites" %}}
This assumes you've followed the [Geodesic Module Usage]({{< relref "geodesic/module/with-kops.md" >}}) guide which covers all the scaffolding necessary to get started.
{{% /dialog %}}

Kops cluster can be scaled vertically by modifying EC2 instance types. 

Kops supports rolling cluster upgrades where the master and worker nodes are upgraded one by one.

First, in the module's `Dockerfile`, update `NODE_MACHINE_TYPE` to reflect the desired EC2 instance type of the worker nodes:

{{% dialog type="code-block" icon="fa fa-code" title="Dockerfile Kops config" %}}
```dockerfile
ENV NODE_MACHINE_TYPE="c4.2xlarge"
```
{{% /dialog %}}

Rebuild the `geodesic` shell by running:

```sh
make docker/build
```

Then, ensure that the `kubectl` context has been set.

In `geodesic` shell run:

```sh
kops export kubecfg $KOPS_CLUSTER_NAME
```

Check and apply the latest Kubernetes update:

```sh
kops upgrade cluster --yes
```

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
The `--yes` option immediately applies the changes. Not specifying the `--yes` option shows only the changes that are applied.
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
There is a configurable 5-minute delay between restarting master nodes, and a 2-minute delay between restarting nodes. 
These values can be altered using `--master-interval` and `--node-interval` options, respectively.

Only the worker nodes may be updated by using the [`--instance-group`](https://github.com/kubernetes/kops/blob/master/docs/instance_groups.md) node option.
{{% /dialog %}}
