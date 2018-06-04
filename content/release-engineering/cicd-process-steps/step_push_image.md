---
title: "Push docker image"
description: ""
weight: 3
---

[Docker Image](https://docs.docker.com/engine/reference/commandline/images/) stored
in [Docker registry](https://docs.docker.com/registry).

Examples of Docker registry:
* [Docker Hub](https://hub.docker.com/)
* [Codefresh Registry](https://codefresh.io/docs/docs/docker-registries/codefresh-registry/)
* [AWS Docker Registry](https://aws.amazon.com/ecr/)

To push Docker image you can use [Build Harness]({{< relref "release-engineering/build-harness.md" >}})
or native tools of CI/CD tool.

# Dependency

* [Versioning step]({{< relref "release-engineering/cicd-process-steps/step_versioning.md" >}})
* [Build Docker image step]({{< relref "release-engineering/cicd-process-steps/step_build_image.md" >}})

# Examples

{{% include-code-block title="Push Docker image with Codefresh" file="release-engineering/cicd-process-steps/examples/push-image-codefresh.yaml" language="yaml" %}}
