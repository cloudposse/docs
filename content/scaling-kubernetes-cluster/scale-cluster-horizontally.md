---
title: "Scale Kubernetes cluster horizontally"
description: "Procedures to scale Kubernetes cluster horizontally by adding nodes"
weight: 1
---

Kops cluster can be scaled horizontally by adding EC2 instances for worker nodes. 

Kops supports rolling cluster upgrades where the master and worker nodes are upgraded one by one.

First, in the solution `Dockerfile`, increase `NODE_MAX_SIZE` and `NODE_MIN_SIZE` to reflect the desired number of worker nodes

```dockerfile
# kops config
ENV BASTION_MACHINE_TYPE="t2.medium"
ENV MASTER_MACHINE_TYPE="t2.large"
ENV NODE_MACHINE_TYPE="t2.large"
ENV NODE_MAX_SIZE="3"
ENV NODE_MIN_SIZE="3"
```

Rebuild the `geodesic` shell by running

```sh
make docker/build
```

Then, ensure that the `kubectl` context has been set. In `geodesic` shell run

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

Update the Kubernetes state store to match the cluster state. This can be done using the following command

```sh
kops update cluster --yes
```

Lastly, perform a rolling update for all cluster nodes using the kops `rolling-update` command

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

Further reading:

* https://aws.amazon.com/blogs/compute/kubernetes-clusters-aws-kops/
* https://github.com/kubernetes/kops/blob/master/docs/instance_groups.md
* https://kubernetes.io/docs/getting-started-guides/kops/
* https://kubernetes.io/docs/tasks/administer-cluster/dns-horizontal-autoscaling/
* https://medium.com/tailor-tech/production-grade-kubernetes-on-aws-3-lessons-learned-scaling-a-cluster-a421dfe786dd
