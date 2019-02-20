---
title: "How do we achieve image updates with zero downtime?"
description: "his is similar to scaling a cluster vertically."
tags:
- VM
- image
- kops
- updates
---

## Question

How do we achieve zero-downtime deploys of VM image updates?


## Answer

This is similar to scaling a cluster vertically. This can be done with zero downtime.

Basically, it requires setting the `KOPS_BASE_IMAGE` env to the new value, rebuilding the `kops` manifest, then redeploying by running the `kops rolling-update` command. See [here.](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml#L171)

Our instructions are [here.](https://docs.cloudposse.com/kubernetes-optimization/scale-cluster-vertically/)

We don’t presently build the `kops` images. Using Packer would be the strategy we would take.
