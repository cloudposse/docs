---
title: "Step 5: Tag & Push Docker Image"
description: "Push docker image along with all tags up to docker registry."
weight: 5
tags:
- cicd
- codefresh
---

To push the Docker image to the registry, we use the `docker/push` target of the [build-harness]({{< relref "release-engineering/build-harness.md" >}}).

# Dependencies

* [Generate Semantic Versions]({{< relref "release-engineering/cicd-process/semantic-versioning.md" >}})
* [Build Docker Image]({{< relref "release-engineering/cicd-process/build-image.md" >}})

# Examples

{{% include-code-block title="Push Docker image with Codefresh" file="release-engineering/cicd-process/examples/push-image-codefresh.yaml" language="yaml" %}}
