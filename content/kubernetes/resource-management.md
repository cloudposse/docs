---
title: "Kubernetes Resource Management"
description: "Understanding Kubernetes Resource Limits, Requests and how to configure them."
---
# FAQ

## What's the difference between "Requests" and "Limits"?

Kubernetes provides excellent controls around hard and soft limits for resource consumption. The "requested" amount is generally how much of some resource a pod is expected to consume. Consider this the "soft limit"; it gives the scheduler a hint so it can best figure out where to place the pod. The "limit" is the actual "hard limit". This is the maximum amount of some resource that a pod can consume.

If a process consumes more than the "limit" of CPU, it will be throttled. If a process attempts to consume more memory than the "limit", it will get an OOM error.

```
Warning OOMKilling  Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```
This will show up in the `kubectl` status, like this:
```
NAME            READY     STATUS      RESTARTS   AGE
some-pod        0/1       OOMKilled   1          24s
```


## How can we tell if we're oversubscribed on CPU/Memory?

By inspecting a "Node" in the kubernetes dashboard, it's really easy to tell if a cluster is oversubscribed. In the example below, we can see that pods have requested 54% of available CPU, but the hard limit has been set to 100% of available CPU. This means, that nothing else should be scheduled to this node as 100% of total available capacity has been allocated.

In terms of memory, we see that all pods of a total memory limit of 4.3GB, which is 113% of available resources. This means the cluster is overcommitted in terms of the maximum permitted amount of memory. In terms of actually requested memory, we're still under the threshold.

![Kubernetes Allocated Resources](/assets/334a25e-Screen_Shot_2018-04-17_at_1.50.21_PM.png)

## How can we tell if we have enough CPU/Memory Allocated?

Navigate to the kubernetes dashboard. Click the "Cluster" menu option on the left (it's also the default view). At the top, it will show how much CPU and Memory is being consumed versus total available.

In the cluster below, you can see CPU is not constrained, but available memory is very low.
![Kubernetes Aggregate Cluster Utilization](/assets/e075391-Screen_Shot_2018-04-17_at_1.30.32_PM.png)

## What's the best way to view resources consumed by a namespace?

Navigate to the kubernetes dashboard. Click the "Overview" menu option on the left and then filter by the namespace. By default, the "default" namespace is selected. Generally, we don't use this namespace.

If everything is running smoothly, you should see "Deployments", "Pods" and "ReplicaSets" all at 100%, which means there are no failures.

![Kubernetes Deployment Resource Utilization](/assets/a701e1e-Screen_Shot_2018-04-17_at_1.25.03_PM.png)

Note, you can also select "All Namespaces" to view aggregate information for the cluster.

![Kubernetes Aggregate Cluster Status](/assets/edea654-Screen_Shot_2018-04-17_at_1.34.31_PM.png)

# How can we set resource requests & limits?

## Namespace Level

It's possible to restrict the total resources available to a namespace.
* Who is responsible for this? DevOps ADmin
* Who sets these limits?

## Deployment / Pod Level

* Who is responsible for this?
* How do you do it? Go to helmfile which is capable of overriding the limits. Redeploy?  Relationship to Codefresh
* We need docs on process for using `helmfile` (e.g.  `helmfile sync`)
