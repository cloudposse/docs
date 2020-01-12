---
title: "How can we implement multiple Kubernetes worker pools with `kops`?"
description: "Mulitple Kubernetes Node pools can be defined in the `kops` manifests (YAML)."
tags:
- kops
- Kubernetes
- manifest
- clusters
---

## Question

How can we implement multiple worker pools within our `kops` Kubernetes clusters?

## Answer

We define multiple node pools in the `kops` manifest (YAML) to define imperative Kubernetes architectures.

Inside the manifest, which looks like a standard Kubernetes resource, is a section for `kind: InstanceGroup` that allows for the definition of any number of node pools, each with its own characteristics like instance type.

An example manifest is provided [here](https://github.com/cloudposse/reference-architectures/tree/master/templates/kops).

An example of a project with the [Van Valen Research Lab at Caltech](https://github.com/vanvalenlab/kiosk/blob/master/conf/patches/gpu-nodes.yaml) demonstrates where a GPU node pool was added that is scaled down to zero by default.

Using the cluster autoscaler, when a pod is scheduled with the proper labels, the node pool is automatically scaled up.
