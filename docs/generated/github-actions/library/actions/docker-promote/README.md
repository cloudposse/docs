---
title: docker-promote
sidebar_label: docker-promote
sidebar_class_name: command
description: |-
  Promote docker image
tags:
  - github-action
  - docker

custom_edit_url: https://github.com/cloudposse/github-action-docker-promote/blob/main/README.yaml
---

# GitHub Action: `docker-promote`
Promote docker image




## Introduction

Promote Docker image to specific tags provided explicitly or implicitly with 
[Docker Metadata action](https://github.com/marketplace/actions/docker-metadata-action)  



## Usage

### Promote a docker image to specific tag

```yaml
  name: github-action-docker-promote
  on:
    release:
      types: [published]
  
  permissions:
    id-token: write
    contents: write
  
  jobs:
    promote:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-docker-promote
          uses: cloudposse/github-action-docker-promote@main
          id: promote
          with:
            registry: registry.hub.docker.com
            organization: ${{ github.event.repository.owner.login }}
            repository: ${{ github.event.repository.name }}
            login: ${{ secrets.DOCKERHUB_USERNAME }}
            password: ${{ secrets.DOCKERHUB_PASSWORD }}
            from: sha-${{ github.sha }}
            to: ${{ github.event.release.tag_name }}
            use_metadata: false

      outputs:
        image: ${{ steps.promote.outputs.image }}
        tag: ${{ steps.promote.outputs.tag }}  
```
  
### Promote a docker image to tags detected from metadata

Promote action use [Docker Metadata action](https://github.com/marketplace/actions/docker-metadata-action) under the 
hood and can detect `to` tags based on Git reference and GitHub events. 

```yaml
  name: github-action-docker-promote
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:

        - name: github-action-docker-promote
          uses: actions/checkout@v3
          with:
            fetch-depth: 2

        - name: github-action-docker-promote
          id: prev-commit
          run: echo "sha=$(git rev-parse --verify HEAD^1)" >> $GITHUB_OUTPUT

        - name: github-action-docker-promote
          uses: cloudposse/github-action-docker-promote@main
          id: promote
          with:
            registry: registry.hub.docker.com
            organization: ${{ github.event.repository.owner.login }}
            repository: ${{ github.event.repository.name }}
            login: ${{ secrets.DOCKERHUB_USERNAME }}
            password: ${{ secrets.DOCKERHUB_PASSWORD }}
            from: sha-${{ steps.prev-commit.outputs.sha }}
            use_metadata: true

      outputs:
        image: ${{ steps.promote.outputs.image }}
        tag: ${{ steps.promote.outputs.tag }}  
```

### Promote a docker image with `from` fetched from metadata

If you skip `from` tag then it would be populated as SHA of the current commit in long format.

```yaml
  name: github-action-docker-promote
  on:
    release:
      types: [published]

  permissions:
    id-token: write
    contents: write

  jobs:
    promote:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-docker-promote
          uses: actions/checkout@v3

        - name: github-action-docker-promote
          uses: cloudposse/github-action-docker-promote@main
          id: promote
          with:
            registry: registry.hub.docker.com
            organization: ${{ github.event.repository.owner.login }}
            repository: ${{ github.event.repository.name }}
            login: ${{ secrets.DOCKERHUB_USERNAME }}
            password: ${{ secrets.DOCKERHUB_PASSWORD }}
            ## `from` is long SHA
            to: ${{ github.event.release.tag_name }}
            use_metadata: true

      outputs:
        image: ${{ steps.promote.outputs.image }}
        tag: ${{ steps.promote.outputs.tag }}  
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| from | Source tag | N/A | false |
| image\_name | Image name (excluding registry). Defaults to {{$organization/$repository}}. |  | false |
| login | Docker login |  | false |
| organization | Organization | N/A | true |
| password | Docker password |  | false |
| registry | Docker registry | N/A | true |
| repository | Repository | N/A | true |
| to | Target tags | N/A | false |
| use\_metadata | Extract target tags from Git reference and GitHub events | true | false |


## Outputs

| Name | Description |
|------|-------------|
| image | Docker image name |
| tag | Docker image tag |
<!-- markdownlint-restore -->

