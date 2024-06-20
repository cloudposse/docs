---
title: sync-docker-repos
sidebar_label: sync-docker-repos
sidebar_class_name: command
description: |-
  GitHub Action to sync two docker repositories.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-sync-docker-repos/blob/main/README.yaml
---

# GitHub Action: `sync-docker-repos`
GitHub Action to sync two docker repositories.




## Introduction

GitHub Action to sync two docker repositories



## Usage


Below is an example workflow that uses the `github-action-sync-docker-repos` action to sync a Docker Hub repository
with an AWS ECR repository.

```yaml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: github-action-sync-docker-repos
        id: login-aws
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-region: us-east-1
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: github-action-sync-docker-repos
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
        with:
          mask-password: "true"

      - name: github-action-sync-docker-repos
        uses: cloudposse/github-action-sync-docker-repos@main
        with:
          src: busybox
          dest: 111111111111.dkr.ecr.us-east-1.amazonaws.com
          dest-credentials: "${{ steps.login-ecr.outputs.docker_username_111111111111_dkr_ecr_us_east_1_amazonaws_com }}:${{ steps.login-ecr.outputs.docker_password_111111111111_dkr_ecr_us_east_1_amazonaws_com }}"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| dest | The destination repository to sync to. | N/A | true |
| dest-credentials | The destination repository credentials. | N/A | false |
| override-arch | Override the architecture of the src image. | N/A | false |
| override-multi-arch | If one of the images in src refers to a list of images, instead of copying just the image which matches the<br/>current OS and architecture, attempt to copy all of the images in the list, and the list itself.<br/> | true | false |
| override-os | Override the operating system of the src image. | N/A | false |
| src | The source repository to sync from. | N/A | true |
| src-credentials | The source repository credentials. | N/A | false |


<!-- markdownlint-restore -->

