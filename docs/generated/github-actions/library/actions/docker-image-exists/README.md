---
title: docker-image-exists
sidebar_label: docker-image-exists
sidebar_class_name: command
description: |-
  Check if docker image exists by pulling it
tags:
  - github-action
  - docker

custom_edit_url: https://github.com/cloudposse/github-action-docker-image-exists/blob/main/README.yaml
---

# GitHub Action: `docker-image-exists`
Check if docker image exists by pulling it






## Usage

```yaml
  name: github-action-docker-image-exists
  on:
    push:
      branches: [ master ]

  jobs:
    context:
      runs-on: ubuntu-latest
      continue-on-error: true  
      steps:  
        - name: github-action-docker-image-exists
          id: image_exists
          uses: cloudposse/github-action-docker-image-exists@main
          with:
            registry: registry.hub.docker.com
            organization: "${{ github.event.repository.owner.login }}"
            repository: "${{ github.event.repository.name }}"
            login: "${{ secrets.DOCKERHUB_USERNAME }}"
            password: "${{ secrets.DOCKERHUB_PASSWORD }}"
            tag: latest

    outputs:
      result: ${{ steps.image_exists.conclusion }}  
      image: ${{ steps.image_exists.outputs.image }}
      tag: ${{ steps.image_exists.outputs.tag }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| image\_name | Image name (excluding registry). Defaults to {{$organization/$repository}}. |  | false |
| login | Docker login |  | false |
| organization | Organization | N/A | true |
| password | Docker password |  | false |
| registry | Docker registry | N/A | true |
| repository | Repository | N/A | true |
| tag | Tag | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| image | Docker image name |
| tag | Docker image tag |
<!-- markdownlint-restore -->

