---
title: "Scale Kubernetes cluster vertically"
description: "Procedures to scale Kubernetes cluster vertically by changing EC2 instance types"
weight: 2
---

Kops cluster can be scaled vertically by changing EC2 instances type for worker nodes. 

Kops supports rolling cluster upgrades where the master and worker nodes are upgraded one by one.

First, in the solution `Dockerfile`, update `NODE_MACHINE_TYPE` to reflect the desired EC2 instance type of worker nodes

```dockerfile
# kops config
ENV NODE_MACHINE_TYPE="t2.2xlarge"
```

Then, ensure that the `kubectl` context has been set. In `geodesic` shell run:

```sh
kops export kubecfg $KOPS_CLUSTER_NAME
```

Check and apply the latest Kubernetes update

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
Using `--yes` updates all nodes in the cluster, first master and then worker.
There is a 5-minute delay between restarting master nodes, and a 2-minute delay between restarting nodes. 
These values can be altered using `--master-interval` and `--node-interval` options, respectively.
{{% /dialog %}}

{{% dialog type="info" icon="fa-info-circle" title="Note" %}}
Only the worker nodes may be updated by using the [`--instance-group`](https://github.com/kubernetes/kops/blob/master/docs/instance_groups.md) node option.
{{% /dialog %}}
