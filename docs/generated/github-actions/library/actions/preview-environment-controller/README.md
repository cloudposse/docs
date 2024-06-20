---
title: preview-environment-controller
sidebar_label: preview-environment-controller
sidebar_class_name: command
description: |-
  Action to manage to deploy and purge preview environments depends on PR labels
tags:
  - github-action
  - continous-delivery
  - preview-environments

custom_edit_url: https://github.com/cloudposse/github-action-preview-environment-controller/blob/main/README.yaml
---

# GitHub Action: `preview-environment-controller`
Action to manage to deploy and purge preview environments depends on PR labels




## Introduction

Testing Pull Request changes usually lead to having it deployed on a preview environment.
The environment can be ephemeral or pre-provisioned. In the last case, there is a countable number of preview environments.
This GitHub Action follows a pattern when the developer set PR label to specify a preview environment to deploy.
`github-action-preview-environment-controller` allow to define map of `environment => label`.
Depending on current PR labels the action outputs a list of deploy and destroy environments.
So it performs a `controller` role and does not limit deployment methods or tools.



## Usage

Use `github-action-preview-environment-controller` in Pull Request triggered pipeline, and use it's outputs to determinate
what environments should be deployed and what cleaned up.

```yaml
  name: github-action-preview-environment-controller
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-preview-environment-controller
          uses: cloudposse/github-action-preview-environment-controller@main
          id: controller
          with:
            labels: ${{ toJSON(github.event.pull_request.labels.*.name) }}
            open: ${{ github.event.pull_request.state == 'open' }}
            env-label: |
              preview: deploy
              qa1: deploy/qa1
              qa2: deploy/qa2

      outputs:
        labels_env: ${{ steps.controller.outputs.labels_env }}
        deploy_envs: ${{ steps.controller.outputs.deploy_envs }}
        destroy_envs: ${{ steps.controller.outputs.destroy_envs }}

    deploy:
      runs-on: ubuntu-latest
      if: ${{ needs.context.outputs.deploy_envs != '[]'  }}
      strategy:
        matrix:
          env: ${{ fromJson(needs.context.outputs.deploy_envs) }}
      environment:
        name: github-action-preview-environment-controller
      needs: [ context ]
      steps:
        - name: github-action-preview-environment-controller
          uses: example/deploy@main
          id: deploy
          with:
            environment: ${{ matrix.env }}
            operation: deploy

    destroy:
      runs-on: ubuntu-latest
      if: ${{ needs.context.outputs.destroy_envs != '[]'  }}
      strategy:
        matrix:
          env: ${{ fromJson(needs.context.outputs.destroy_envs) }}
      needs: [ context ]
      steps:
        - name: github-action-preview-environment-controller
          uses: example/deploy@main
          id: deploy
          with:
            environment: ${{ matrix.env }}
            operation: destroy
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| env-label | YAML formatted {environment}: {label} map  | preview: deploy<br/> | true |
| labels | Existing PR labels | [] | true |
| open | Is PR open? | true | true |


## Outputs

| Name | Description |
|------|-------------|
| deploy\_envs | Environments that need to be deployed |
| destroy\_envs | Environments that need to be destroyed |
| labels\_env | JSON formatted {label}: {environment} map |
<!-- markdownlint-restore -->

