---
title: deploy-helmfile
sidebar_label: deploy-helmfile
sidebar_class_name: command
description: |-
  Deploy on Kubernetes with HelmFile
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-deploy-helmfile/blob/main/README.yaml
---

# GitHub Action: `deploy-helmfile`
Deploy on Kubernetes with HelmFile




## Introduction

Deploy on Kubernetes with HelmFile. 



## Usage

Deploy environment
```yaml
  name: github-action-deploy-helmfile
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      environment:
        name: github-action-deploy-helmfile
        url: ${{ steps.deploy.outputs.webapp-url }}  
      steps:
        
        - name: github-action-deploy-helmfile
          uses: aws-actions/configure-aws-credentials@v1.7.0
          with:
            aws-region: us-west-2
            role-to-assume: arn:aws:iam::111111111111:role/preview
            role-session-name: github-action-deploy-helmfile
      
        - name: github-action-deploy-helmfile
          uses: cloudposse/github-action-deploy-helmfile@main
          id: deploy
          with:
            aws-region: us-west-2
            cluster: preview-eks
            environment: preview
            namespace: preview
            image: nginx
            image-tag: latest
            operation: deploy
            debug: false
  ```


Destroy environment
```yaml
  name: github-action-deploy-helmfile
  on:
    pull_request:
      branches: [ 'main' ]
      types: [closed]

  jobs:
    destroy:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-deploy-helmfile
          uses: aws-actions/configure-aws-credentials@v1.7.0
          with:
            aws-region: us-west-2
            role-to-assume: arn:aws:iam::111111111111:role/preview
            role-session-name: github-action-deploy-helmfile
      
        - name: github-action-deploy-helmfile
          uses: cloudposse/github-action-deploy-helmfile@main
          id: destroy
          with:
            aws-region: us-west-2
            cluster: preview-eks
            environment: preview
            namespace: preview
            image: "<none>"
            image-tag: "<none>"
            operation: destroy
            debug: false
  ```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| aws-region | AWS region | us-east-1 | false |
| chamber\_version | Kubectl version | 2.11.1 | false |
| cluster | Cluster name | N/A | true |
| debug | Debug mode | false | false |
| environment | Helmfile environment | preview | false |
| gitref-sha | Git SHA |  | false |
| helm\_version | Helm version | 3.11.1 | false |
| helmfile | Helmfile name | helmfile.yaml | false |
| helmfile-path | The path where lives the helmfile. | deploy | false |
| helmfile\_version | Helmfile version | 0.143.5 | false |
| image | Docker image | N/A | true |
| image-tag | Docker image tag | N/A | true |
| kubectl\_version | Kubectl version | 1.26.3 | false |
| namespace | Kubernetes namespace | N/A | true |
| operation | Operation with helmfiles. (valid options - `deploy`, `destroy`) | deploy | true |
| release\_label\_name | The name of the label used to describe the helm release | release | false |
| values\_yaml | YAML string with extra values to use in a helmfile deploy | N/A | false |


## Outputs

| Name | Description |
|------|-------------|
| webapp-url | Web Application url |
<!-- markdownlint-restore -->

