---
title: "Step 3: Push Docker Image"
description: ""
weight: 3
tags:
- cicd
- codefresh
---

[Docker Image](https://docs.docker.com/engine/reference/commandline/images/) stored
in [Docker registry](https://docs.docker.com/registry).


To push the Docker image you can use the [build-harness]({{< relref "release-engineering/build-harness.md" >}})
or native tools of the CI/CD platform.

# Dependencies

* [Generate Semantic Versions]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}})
* [Build Docker Image]({{< relref "release-engineering/cicd-process/build-image.md" >}})

# Examples

{{% include-code-block title="Push Docker image with Codefresh" file="release-engineering/cicd-process/examples/push-image-codefresh.yaml" language="yaml" %}}
