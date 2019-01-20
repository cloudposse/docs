---
title: "How can we implement multiple `kubernetes` worker pools?"
description: "We use kops manifests (YAML) to define imperative Kubernetes architectures."
tags:
- kops
- Kubernetes
- manifest
- clusters
- AMI
---

## Question

How can we implement multiple worker pools within our Kubernetes clusters?

## Answer

We use `kops` manifests (YAML) to define imperative Kubernetes architectures.

Inside the manifest (which looks like a standard Kubernetes resource) is a section for `kind: InstanceGroup` that allows for the definition of any number of node pools.

An example manifest is provided [here](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml).

An example of a project with the [Van Valen Research Lab at Caltech](https://github.com/vanvalenlab/kiosk/blob/master/conf/patches/gpu-nodes.yaml) demonstrates where a GPU node pool was added that is scaled down to zero by default.

Using the cluster autoscaler, when a pod is scheduled with the proper labels, the node pool is automatically scaled up.
