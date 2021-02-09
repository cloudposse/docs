---
title: Docker Best Practices
description: "Collection of some of our docker-specific best practices."
---

# Inheritance

Inheritance is when you use `FROM some-image:1.2.3` (vs `FROM scratch`) in a `Dockerfile`. We recommend to leverage lean base images (E.g. `alpine` or `busybox`).

Try to leverage the same base image in as many of your images as possible for faster `docker pulls`.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
- <https://docs.docker.com/engine/reference/builder/#from>
{{% /dialog %}}

# Multi-stage Builds

There are two ways to leverage multi-stage builds.

1. *Build-time Environments* The most common application of multi-stage builds is for using a build-time environment for compiling apps, and then a minimal image (E.g. `alpine` or `scratch`) for distributing the resultant artifacts (e.g. statically-linked go binaries).
2. *Multiple-Inheritance* We like to think of "multi-stage builds" as a mechanism for "multiple inheritance" as it relates to docker images. While not technically the same thing, using mult-stage images, it's possible `COPY --from=other-image` to keep things very DRY.

{{% dialog type="info" icon="fa fa-book" title="Read More" %}}
- <https://docs.docker.com/develop/develop-images/multistage-build/>
- <https://blog.alexellis.io/mutli-stage-docker-builds/>
{{% /dialog %}}

# Use Scratch Base Image

One often overlooked, ultimately lean base-image is the `scratch` image. This is an empty filesystem which allows one to copy/distribute the minimal set of artifacts. For languages that can compile statically linked binaries, using the `scratch` base image (e.g. `FROM scratch`) is the most secure way as there will be no other exploitable packages bundled in the image.

We use this pattern for our [`terraform-root-modules`](https://github.com/cloudposse/terraform-root-modules) distribution of terraform reference architectures.
