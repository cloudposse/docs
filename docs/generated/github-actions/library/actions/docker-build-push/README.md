---
title: docker-build-push
sidebar_label: docker-build-push
sidebar_class_name: command
description: |-
  Build Docker image and push it
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-docker-build-push/blob/main/README.yaml
---

# GitHub Action: `docker-build-push`
Build Docker image and push it




## Introduction

Build Docker image and push it. 



## Usage

```yaml
  name: github-action-docker-build-push
  on:
    push:
      branches: [ master ]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
      - name: github-action-docker-build-push
        uses: actions/checkout@v3

      - name: github-action-docker-build-push
        id: build
        uses: cloudposse/github-action-docker-build-push@main
        with:
          registry: registry.hub.docker.com
          organization: "${{ github.event.repository.owner.login }}"
          repository: "${{ github.event.repository.name }}"
          login: "${{ secrets.DOCKERHUB_USERNAME }}"
          password: "${{ secrets.DOCKERHUB_PASSWORD }}"
          platforms: linux/amd64,linux/arm64

    outputs:
      image: ${{ steps.build.outputs.image }}
      tag: ${{ steps.build.outputs.tag }}
```
> [!TIP]
> If omitted, `cache-from` and `cache-to` will default to `gha`.
> In an AWS environment, we recommend using [ECR as a remote cache](https://aws.amazon.com/blogs/containers/announcing-remote-cache-support-in-amazon-ecr-for-buildkit-clients/).

```diff
     - name: github-action-docker-build-push
       id: build
       uses: cloudposse/github-action-docker-build-push@main
       with:
        registry: registry.hub.docker.com
        organization: "${{ github.event.repository.owner.login }}"
        repository: "${{ github.event.repository.name }}"
+       cache-from: "type=registry,ref=registry.hub.docker.com/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:cache"
+       cache-to: "mode=max,image-manifest=true,oci-mediatypes=true,type=registry,ref=registry.hub.docker.com/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:cache"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| build-args | List of build-time variables | N/A | false |
| cache-from | List of external cache sources for buildx (e.g., user/app:cache, type=local,src=path/to/dir) | type=gha | false |
| cache-to | List of cache export destinations for buildx (e.g., user/app:cache, type=local,dest=path/to/dir) | type=gha,mode=max | false |
| docker-metadata-pr-head-sha | Set to `true` to tag images with the PR HEAD SHA instead of the merge commit SHA within pull requests. | false | false |
| file | Dockerfile name | Dockerfile | false |
| image\_name | Image name (excluding registry). Defaults to {{$organization/$repository}}. |  | false |
| login | Docker login |  | false |
| no-cache | Send the --no-cache flag to the docker build process | false | false |
| organization | Organization | N/A | true |
| password | Docker password |  | false |
| platforms | List of target platforms for build (e.g. linux/amd64,linux/arm64,linux/riscv64,linux/ppc64le,linux/s390x,etc) | linux/amd64 | false |
| provenance | Generate provenance attestation for the build | N/A | false |
| registry | Docker registry | N/A | true |
| repository | Repository | N/A | true |
| secret-files | List of secret files to expose to the build (e.g., key=filename, MY\_SECRET=./secret.txt) | N/A | false |
| secrets | List of secrets to expose to the build (e.g., key=string, GIT\_AUTH\_TOKEN=mytoken) | N/A | false |
| ssh | List of SSH agent socket or keys to expose to the build | N/A | false |
| tags | List of tags (supports https://github.com/docker/metadata-action#tags-input) | N/A | false |
| target | Sets the target stage to build |  | false |
| workdir | Working directory | ./ | false |


## Outputs

| Name | Description |
|------|-------------|
| image | Docker image name |
| metadata | Docker image metadata |
| tag | Docker image tag |
<!-- markdownlint-restore -->

