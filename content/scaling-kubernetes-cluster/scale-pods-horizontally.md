---
title: "Scale Kubernetes pods horizontally"
description: "Procedures to scale Kubernetes pods horizontally by modifying the replica count"
weight: 3
---

We use [Helm charts]({{< relref "helm-charts/quickstart.md" >}}) to deploy applications via a CI/CD pipeline.

Helm charts themselves are deployed using `Helmfiles`.

To scale Kubernetes pods horizontally, update the `replicaCount` value in the application's `chart.yaml` file to reflect the desired replica count for the application pods.

Then start a CI/CD pipeline build to update the application with the new settings.

It will re-create the application pods with the requested replica count.
