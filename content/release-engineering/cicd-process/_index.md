---
title: "Codefresh CI/CD Process"
description: "This is our process for automating docker builds and deploying helm charts to kubernetes clusters."
tags:
- cicd
- codefresh
---

# Unlimited Staging Environments

We use the following CI/CD process to implement "Unlimited Staging Environments".

1. [**Initialize Variables**]({{< relref "release-engineering/cicd-process/init-variables.md" >}}) used by all build steps
2. [**Generate Semantic Versions**]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}}) used to tag all docker images and helm charts.
3. [**Build Docker Image**]({{< relref "release-engineering/cicd-process/build-image.md" >}}) from the `Dockerfile`
4. [**Build Helm Charts**]({{< relref "release-engineering/cicd-process/build-charts.md" >}}) pinned to version of docker image
5. [**Push Docker Images**]({{< relref "release-engineering/cicd-process/push-image.md" >}}) to the docker registry
6. [**Deploy Helm Charts**]({{< relref "release-engineering/cicd-process/deploy.md" >}}) to the clusters
7. [**Send Slack Notification**]({{< relref "release-engineering/cicd-process/slack-notification.md" >}}) upon success

# Demo

In a collaboration with Codefresh, we presented a demo of how we implemented it. Our strategy is still largely the same, however, since this demo we've added suport for `chamber` to manage secrets and `helmfile` for deploying collections of charts.

{{< youtube id="HJ7HkiGTQ48" >}}
