---
title: "Scale Kubernetes Pods Vertically"
description: "Procedures to scale Kubernetes cluster vertically by modifying the CPU and memory limits"
weight: 4
tags:
- helm
- chart
- kubernetes
- pipeline
---

We use [Helm charts]({{< relref "helm-charts/quickstart.md" >}}) to deploy applications via a CI/CD pipeline.

Helm charts themselves are deployed using `Helmfiles`.

To scale Kubernetes pods vertically, update the following settings in the application's `chart.yaml` file:

```yaml
  resources:
    limits:
      cpu: "500m"
      memory: "512Mi"
    requests:
      cpu: "50m"
      memory: "128Mi"

```

Then start a CI/CD pipeline build to update the application with the new settings.

It will re-create the application pods with the requested CPU and memory limits.
