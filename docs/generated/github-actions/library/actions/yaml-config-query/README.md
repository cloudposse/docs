---
title: yaml-config-query
sidebar_label: yaml-config-query
sidebar_class_name: command
description: |-
  Define YAML document, filter it with JSON query and get result as outputs
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-yaml-config-query/blob/main/README.yaml
---

# GitHub Action: `yaml-config-query`
Define YAML document, filter it with JSON query and get result as outputs




## Introduction

Utility action allow to declare YAML structured document as an input and get it's part as the action outputs 
referenced using JQ.

This action is useful in simplifing complext GitHub action workflows in different ways. 
For examples follow [usage](#usage) section. 



## Usage

### Define constants 
```yaml
  name: github-action-yaml-config-query
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    demo:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-yaml-config-query
          id: context
          uses: cloudposse/github-action-yaml-config-query@main
          with:
            config: |
              image: acme/example
              tag: sha-${{ github.sha }}

        - run: |
          docker run ${{ steps.context.outputs.image }}:${{ steps.context.outputs.tag }}
```

### Implement if/else
```yaml
  name: github-action-yaml-config-query
  on:
    workflow_call:
      inputs:
        from:
          required: false
          type: string

  jobs:
    demo:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-yaml-config-query
          id: from
          uses: cloudposse/github-action-yaml-config-query@main      
          with:
            query: .${{ inputs.from == '' }}
            config: |-
              true: 
                tag: ${{ github.sha }}
              false:
                tag: ${{ inputs.from }}

        - run: |
          docker tag acme/example:${{ steps.context.outputs.tag }}
```

### Implement switch
```yaml
  name: github-action-yaml-config-query
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened]
    push:
      branches: [ main ]
    release:
      types: [published]
    
  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-yaml-config-query
          id: controller
          uses: cloudposse/github-action-yaml-config-query@main      
          with:
            query: .${{ github.event_name }}
            config: |-
              pull_request: 
                build: true
                promote: false
                test: true
                deploy: ["preview"]
              push:
                build: true
                promote: false  
                test: true
                deploy: ["dev"]
              release:
                build: false
                promote: true
                test: false
                deploy: ["staging", "production"]
      outputs:
        build: ${{ steps.controlle.outputs.build }}
        promote: ${{ steps.controlle.outputs.promote }}
        test: ${{ steps.controlle.outputs.test }}
        deploy: ${{ steps.controlle.outputs.deploy }}
    
    build:
      needs: [context]
      if: ${{ needs.context.outputs.build }}
      uses: ./.github/workflows/reusable-build.yaml

    test:
      needs: [context, test]
      if: ${{ needs.context.outputs.test }}
      uses: ./.github/workflows/reusable-test.yaml

    promote:
      needs: [context]
      if: ${{ needs.context.outputs.promote }}
      uses: ./.github/workflows/reusable-promote.yaml

    deploy:
      needs: [context]
      if: ${{ needs.context.outputs.deploy != '[]' }}
      strategy:
        matrix:
          environment: ${{ fromJson(needs.context.outputs.deploy) }}        
      uses: ./.github/workflows/reusable-deploy.yaml
      with:
        environment: ${{ matrix.environment }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| config | YAML config | N/A | true |
| query | JQ Query | . | true |


<!-- markdownlint-restore -->

