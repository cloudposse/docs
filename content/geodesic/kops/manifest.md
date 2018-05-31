---
title: "Kops Manifest"
description: ""
---
Geodesic uses a kops `manifest.yaml` file to define the topology of the kops clusters. The [default toplogy](https://github.com/cloudposse/geodesic/blob/master/rootfs/templates/kops/default.yaml) can be found in the [`geodesic`](https://github.com/cloudposse/geodesic/) repo. This topology is implemented as a [`gomplate`]({{< relref "tools/gomplate.md" >}}) template so it can be parameterized using environment variables defined in the `Dockerfile` of the geodesic module.

# Extend the Manifest

The default kops manifest that ships with geodesic is

# Usage

Run `build-manifest` to render the `gomplate` template. By default, it will write the manifest to `/conf/kops/manifest.yaml`

We recommend adding the following to the end of the geodesic module's `Dockerfile`:
```
RUN build-manifest
```

# Update the Cluster

After modifying the manifest, it will need to be applied to the cluster.

Follow the instructions for [updating a cluster]({{< relref "geodesic/kops/update-cluster.md" >}}).

# References
- <https://github.com/kubernetes/kops/blob/master/docs/manifests_and_customizing_via_api.md>
