---
title: "How can we swap out machine images?"
description: "The base images are parameterized inside the `kops` manifest."
tags:
- kops
- manifest
- images
---

## Question

How can we swap out machine images (e.g. tweak an AMI)?

## Answer

Inside the `kops` manifest, the base images are parameterized with an environment variable `KOPS_BASE_IMAGE`.

One example is provided [here](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml#L150).

Additional information is available [here](https://github.com/kubernetes/kops/blob/master/docs/images.md).
