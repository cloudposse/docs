---
title: run-ecspresso
sidebar_label: run-ecspresso
sidebar_class_name: command
description: |-
  Run ECS task with [Escpresso](https://github.com/kayac/ecspresso)
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-run-ecspresso/blob/main/README.yaml
---

# GitHub Action: `run-ecspresso`
Run ECS task with [Escpresso](https://github.com/kayac/ecspresso)




## Introduction

This is template repository to create composite GitHub Actions. 
Feel free to use it as reference and starting point.



## Usage

```yaml
  name: github-action-run-ecspresso
  on:
    push:
      branches: [ 'main' ]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-run-ecspresso
          uses: cloudposse/example-github-action-run-ecspresso@main
          id: example
          with:
            image: 1111111111111.dkr.ecr.us-east-2.amazonaws.com/cloudposse/example-app-on-ecs
            image-tag: latest
            region: us-east-2
            operation: deploy
            cluster: acme-plat-ue2-sandbox
            application: acme-plat-ue2-sandbox-example-app-on-ecs
            taskdef-path: taskdef.json
            overrides: |-
              {
                "containerOverrides":[
                  {
                    "name": "app",
                    "command": ["/db-migrate.sh"]
                  }
                ]
              }            

      outputs:
        result: ${{ steps.example.outputs.webapp-url }}
```






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
| overrides | A list of container overrides in JSON format that specify the name of a container in the specified task definition and the overrides it should receive. | {} | false |
| region | AWS Region | N/A | true |
| taskdef-path | Task definition path | N/A | true |
| timeout | Ecspresso timeout | 5m | false |


## Outputs

| Name | Description |
|------|-------------|
| webapp-url | Web Application url |
<!-- markdownlint-restore -->

