---
title: monorepo-random-controller
sidebar_label: monorepo-random-controller
sidebar_class_name: command
description: |-
  Monorepo random controller used for demo
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-monorepo-random-controller/blob/main/README.yaml
---

# GitHub Action: `monorepo-random-controller`
Monorepo random controller used for demo




## Introduction

Monorepo pattern for CI/CD use this action as controller to detect list of applications, applications with changes.
The GitHub action detects as applications directories from specified path and use random to separate them into 
changed and unchanged lists.



## Usage

```yaml
  name: github-action-monorepo-random-controller
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    monorepo:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-monorepo-random-controller
          uses: actions/checkout@v3
  
        - name: github-action-monorepo-random-controller
          id: controller
          uses: cloudposse/github-action-monorepo-random-controller@0.1.1
          with:
            dir: ./applications/
  
      outputs:
        applications: ${{ steps.controller.outputs.apps }}
        changes: ${{ steps.controller.outputs.changes }}
        no-changes: ${{ steps.controller.outputs.no-changes }}

    ci:
      runs-on: ubuntu-latest
      needs: [monorepo]
      if: ${{ needs.monorepo.outputs.applications != '[]'  }}
      strategy:
        matrix:
          application: ${{ fromJson(needs.monorepo.outputs.applications) }}
      steps:
        - name: github-action-monorepo-random-controller
          uses: actions/checkout@v3

        - name: github-action-monorepo-random-controller
          id: build
          uses: cloudposse/github-action-docker-build-push@1.9.0
          with:
            registry: registry.hub.docker.com
            organization: ${{ github.event.repository.owner.login }}
            repository: ${{ github.event.repository.name }}/${{ matrix.application }}
            workdir: ./applications/${{ matrix.application }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| dir | Applications dir | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| apps | Applications list |
| changes | Applications that have changes |
| no-changes | Applications that have no changes |
<!-- markdownlint-restore -->

