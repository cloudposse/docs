---
title: "Step 3: Build Docker Image"
description: "Build docker image from `Dockerfile`"
weight: 3
tags:
- cicd
- codefresh
- Docker
- docker image
---

A [docker image](https://docs.docker.com/engine/reference/commandline/images/) is one of the two main artifacts
that result from the CI/CD build process (the other one is a [helm chart]({{< relref "release-engineering/cicd-process/build-charts.md" >}})). The docker image incapsulates all application software dependencies.

To build Docker image you can use the [build-harness]({{< relref "release-engineering/build-harness.md" >}}) or native tools of the CI/CD platform.

# Dependency

None

# Examples

{{% include-code-block title="Build Docker Image with Codefresh" file="release-engineering/cicd-process/examples/build-image-codefresh.yaml" language="yaml" %}}
