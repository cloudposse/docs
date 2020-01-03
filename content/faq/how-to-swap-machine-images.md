---
title: "How can we swap out machine images?"
description: "The base images are parameterized inside the kops manifest."
tags:
- kops
- Kubernetes
- manifest
- clusters
- AMI
---

## Question

How can we swap out machine images (e.g. tweak an AMI)?

## Answer

Inside the `kops` manifest,  the base images are parameterized with an environment variable `KOPS_BASE_IMAGE`.

An example is provided [here](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml#L150).

More information is provided [here](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md).
