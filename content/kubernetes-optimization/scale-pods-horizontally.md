---
title: "Scale Kubernetes Pods Horizontally"
description: "Procedures to scale Kubernetes pods horizontally by modifying the replica count"
weight: 3
tags:
- deployment
- helm
- chart
- kubernetes
- pipeline
- replica set
- cpu
- memory
---

## Scale Manually Using Helm Charts and Helmfiles

We use [Helm charts]({{< relref "helm-charts/quickstart.md" >}}) to deploy applications via a CI/CD pipeline.

Helm charts themselves are deployed using `Helmfiles`.

To scale Kubernetes pods horizontally, update the `replicaCount` value in the application's `chart.yaml` file to reflect the desired replica count for the application pods.

Then start a CI/CD pipeline build to update the application with the new settings.

It will re-create the application pods with the requested replica count.


## Scale Automatically With Horizontal Pod Autoscaling

Another option to scale Kubernetes pods horizontally is to use [`Horizontal Pod Autoscaling`](https://github.com/kubernetes/kops/blob/master/docs/horizontal_pod_autoscaling.md).

It automatically scales the number of pods in a replication controller, deployment or replica set based on observed CPU utilization or on some other application-provided metrics.
