---
title: "Build Docker Image Step"
description: ""
weight: 3
---

[Docker Image](https://docs.docker.com/engine/reference/commandline/images/) is one of two artifacts
that are the result of CI/CD build. Docker image incapsulate application and all software dependencies.

To build Docker image you can use [Build Harness]({{< relref "release-engineering/build-harness.md" >}})
or native tools of CI/CD tool.

# Dependency

None

# Examples

{{% include-code-block title="Build image with Codefresh" file="release-engineering/cicd-process-steps/examples/build-image-codefresh.yaml" language="yaml" %}}
