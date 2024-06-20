---
title: deploy-ecspresso
sidebar_label: deploy-ecspresso
sidebar_class_name: command
description: |-
  Deploy on ECS with [Escpresso](https://github.com/kayac/ecspresso)
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-deploy-ecspresso/blob/main/README.yaml
---

# GitHub Action: `deploy-ecspresso`
Deploy on ECS with [Escpresso](https://github.com/kayac/ecspresso)




## Introduction

This is template repository to create composite GitHub Actions. 
Feel free to use it as reference and starting point.



## Usage

```yaml
  name: github-action-deploy-ecspresso
  on:
    push:
      branches: [ 'main' ]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-deploy-ecspresso
          uses: cloudposse/example-github-action-deploy-ecspresso@main
          id: example
          with:
            image: 1111111111111.dkr.ecr.us-east-2.amazonaws.com/cloudposse/example-app-on-ecs
            image-tag: latest
            region: us-east-2
            operation: deploy
            cluster: acme-plat-ue2-sandbox
            application: acme-plat-ue2-sandbox-example-app-on-ecs
            taskdef-path: taskdef.json

      outputs:
        result: ${{ steps.example.outputs.webapp-url }}
```

## S3 Mirroring

This action supports synchronizing `taskDefinitions` to S3. It is designed to work in concert with Cloud Posse's [`ecs-service`](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/ecs-service) component, that will upload a task definition template to S3. This action will then pull that template from S3 and merge it with the local task definition from the repository. Finally, `ecspresso` will be called to deploy the merged task definition to ECS.

This action will then upload the `task-definition.json` that was rendered back to S3. The `ecs-service` component will use the `task-definition.json` file to deploy the application. This ensures future infrastructure deployments do not override application changes, such as image updates, environment variable changes, etc.

The Infrastructure repository then manages things like Volumes and EFS mounts, and the Application repository manages the application code and environment variables.

![S3 Mirroring](https://github.com/cloudposse/github-action-deploy-ecspresso/tree/main/docs/github-action-deploy-ecspresso_s3-mirroring.drawio.png)






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| application | Application name | N/A | true |
| cluster | Cluster name | N/A | true |
| debug | Debug mode | false | false |
| ecspresso-version | Ecspresso version | v2.1.0 | false |
| image | Docker image | N/A | true |
| image-tag | Docker image tag | N/A | true |
| mirror\_to\_s3\_bucket | Mirror task definition to s3 bucket | N/A | false |
| operation | Operation (valid options - `deploy`, `destroy`) | deploy | true |
| region | AWS Region | N/A | true |
| taskdef-path | Task definition path | N/A | true |
| timeout | Ecspresso timeout | 5m | false |


## Outputs

| Name | Description |
|------|-------------|
| webapp-url | Web Application url |
<!-- markdownlint-restore -->

