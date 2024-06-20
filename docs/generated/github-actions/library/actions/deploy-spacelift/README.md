---
title: deploy-spacelift
sidebar_label: deploy-spacelift
sidebar_class_name: command
description: |-
  Opinionated way to deploy Docker image app with Spacelift
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-deploy-spacelift/blob/main/README.yaml
---

# GitHub Action: `deploy-spacelift`
Opinionated way to deploy Docker image app with Spacelift




## Introduction

Set Docker image uri into SSM parameter store and trigger Spacelift stack that should handle deployment.



## Usage

```yaml
  name: github-action-deploy-spacelift
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      environment:
        name: github-action-deploy-spacelift
        url: ${{ steps.deploy.outputs.webapp-url }}
      steps:
        - name: github-action-deploy-spacelift
          uses: aws-actions/configure-aws-credentials@v1.7.0
          with:
            aws-region: us-west-2
            role-to-assume: arn:aws:iam::123456789012:role/AllowWriteSSM
  
        - name: github-action-deploy-spacelift
          uses: cloudposse/github-action-deploy-spacelift@main
          id: deploy
          with:
            stack: ecs-service-production
            region: us-west-2
            ssm-path: /ecs-service/image
            image: nginx
            image-tag: latest
            operation: deploy
            debug: false
            github_token: ${{ secrets.GITHUB_TOKEN }}
            organization: acme
            api_key_id: ${{ secrets.SPACELIFT_API_KEY_ID }}
            api_key_secret: ${{ secrets.SPACELIFT_API_KEY_SECRET }}

      outputs:
        url: ${{ steps.deploy.outputs.webapp-url }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| api\_key\_id | Spacelift API Key ID | N/A | true |
| api\_key\_secret | Spacelift API Key Secret | N/A | true |
| debug | Debug mode | false | false |
| github\_token | GitHub Token | N/A | true |
| image | Docker image | N/A | true |
| image-tag | Docker image tag | N/A | true |
| namespace | Namespace | N/A | false |
| operation | Operation (valid options - `deploy`, `destroy`) | deploy | true |
| organization | Spacelift organization name | N/A | true |
| region | AWS Region | N/A | true |
| ssm-path | SSM path for Docker image | N/A | false |
| stack | Spacelift stack name | N/A | true |
| webapp-output-name | Spacelist stack output field contains webapp host name | full\_domain | false |


## Outputs

| Name | Description |
|------|-------------|
| webapp-url | Web Application url |
<!-- markdownlint-restore -->

