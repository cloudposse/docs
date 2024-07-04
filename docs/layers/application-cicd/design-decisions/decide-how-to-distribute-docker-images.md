---
title: "Decide How to distribute Docker Images"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175847134/REFARCH-91+-+Decide+How+to+distribute+Docker+Images
sidebar_position: 100
refarch_id: REFARCH-91
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-how-to-distribute-docker-images.md
---

# Decide How to distribute Docker Images

#### Use AWS ECR

This is by far the most common approach we see taken. Our typical implementation includes a single ECR in the corp account. Read-only access granted to other accounts as necessary. Push images with commit sha’s and stage tag. Use lifecycle rules on stage tag to avoid eviction. The main downside with ECR, is each image repository needs to be explicitly registered. If we decide to go with ECR, we’ll also want to [Decide on ECR Strategy](/reference-architecture/fundamentals/design-decisions/foundational-platform/decide-on-ecr-strategy) .

#### Use Dockerhub

DockerHub is ideally suited for public images because it’s the default registry. But as a private registry, it’s a bit dated. The nice thing dockerhub is repositories do not need to be explicitly created.

#### Use Artifactory/Nexus/etc

This is more common for traditional artifact storage in Java shops. We don’t see this typically used with Docker, but it is supported.

#### Use Github

[https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-docker-registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-docker-registry)

#### Self-hosted Registries (e.g. Quay, Docker Registry, etc)

We don’t recommend this approach because, at the very least, we’ll need to use something else like ECR for bootstrapping.

