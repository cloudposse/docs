---
title: "No nodes are available that match all of the predicates: NoVolumeZoneConflict (4)"
description: "Fix is to most likely increase the number of worker nodes so they are evenly spread across all availability zones."
tags:
- kubernetes
- kops
- multi-az
---

# Question

When trying to deploy a stateful service (e.g. postgres, mongodb, redis), I get the following error:

```
  Type     Reason            Age                From               Message
  ----     ------            ----               ----               -------
  Warning  FailedScheduling  5m (x91 over 30m)  default-scheduler  No nodes are available that match all of the predicates: NoVolumeZoneConflict (4), PodToleratesNodeTaints (3).
```

# Answer

This is likely caused by having an uneven distribution of worker nodes in availability zones. In small clusters (e.g. test clusters), this may happen if the number of workers nodes is less than the number of masters.
Basically, if nodes don't exist in the same availability zones as masters, there's a risk that volumes get provisioned in an availaiblity-zone where there are no worker nodes. When this happens, 
the creation of pods gets stuck.

In your Geodesic Module, ensure that `NODE_MIN_SIZE` is greater or equal to the number of `KOPS_AVAILABILITY_ZONES` in the `ENV` settings of your `Dockerfile`.


# References

- https://github.com/kubernetes/kubernetes/issues/39178#issuecomment-269872832
