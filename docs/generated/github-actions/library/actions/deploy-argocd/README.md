---
title: deploy-argocd
sidebar_label: deploy-argocd
sidebar_class_name: command
description: |-
  Deploy on Kubernetes with ArgoCD
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-deploy-argocd/blob/main/README.yaml
---

# GitHub Action: `deploy-argocd`
Deploy on Kubernetes with ArgoCD




## Introduction

Deploy on Kubernetes with Helm/HelmFile and ArgoCD. 



## Usage

Deploy environment
```yaml
  name: github-action-deploy-argocd
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      environment:
        name: github-action-deploy-argocd
        url: ${{ steps.deploy.outputs.webapp-url }}  
      steps:
        
        - name: github-action-deploy-argocd
          uses: aws-actions/configure-aws-credentials@v1.7.0
          with:
            aws-region: us-west-2
            role-to-assume: arn:aws:iam::111111111111:role/preview
            role-session-name: github-action-deploy-argocd
      
        - name: github-action-deploy-argocd
          uses: cloudposse/github-action-deploy-argocd@main
          id: deploy
          with:
            cluster: https://github.com/cloudposse/argocd-deploy-non-prod-test/blob/main/plat/ue2-sandbox/apps
            toolchain: helmfile
            environment: preview
            namespace: preview
            application: test-app
            github-pat: ${{ secrets.GITHUB_AUTH_PAT }}
            repository: ${{ github.repository }}
            ref: ${{ github.event.pull_request.head.ref  }}
            image: nginx
            image-tag: latest
            operation: deploy
            debug: false
            synchronously: true
  ```


Destroy environment
```yaml
  name: github-action-deploy-argocd
  on:
    pull_request:
      branches: [ 'main' ]
      types: [closed]

  jobs:
    destroy:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-deploy-argocd
          uses: aws-actions/configure-aws-credentials@v1.7.0
          with:
            aws-region: us-west-2
            role-to-assume: arn:aws:iam::111111111111:role/preview
            role-session-name: github-action-deploy-argocd
      
        - name: github-action-deploy-argocd
          uses: cloudposse/github-action-deploy-helmfile@main
          id: destroy
          with:
            cluster: https://github.com/cloudposse/argocd-deploy-non-prod-test/blob/main/plat/ue2-sandbox/apps
            toolchain: helmfile
            environment: preview
            namespace: preview
            application: test-app
            github-pat: ${{ secrets.GITHUB_AUTH_PAT }}
            repository: ${{ github.repository }}
            ref: ${{ github.event.pull_request.head.ref }}  
            image: "<none>"
            image-tag: "<none>"
            operation: destroy
            debug: false
  ```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| application | Application name | N/A | true |
| aws-region | AWS region | us-east-1 | false |
| check-retry-count | Check retry count (for synchronously mode) | 5 | false |
| check-retry-interval | Check retry interval (in seconds) (for synchronously mode) | 10 | false |
| cluster | Cluster name | N/A | true |
| debug | Debug mode | false | false |
| environment | Helmfile environment | preview | false |
| github-pat | Github PAT to access argocd configuration repository | N/A | true |
| gitref-sha | Git SHA (Depricated. Use `ref` instead) |  | false |
| image | Docker image | N/A | true |
| image-tag | Docker image tag | N/A | true |
| namespace | Kubernetes namespace | N/A | true |
| operation | Operation with helmfiles. (valid options - `deploy`, `destroy`) | deploy | true |
| path | The path where lives the helmfile or helm chart. | N/A | true |
| ref | Git ref | N/A | true |
| release\_label\_name | The name of the label used to describe the helm release | release | false |
| repository | Application GitHub repository full name | N/A | true |
| ssm-path | SSM path to read environment secrets | N/A | true |
| synchronously | Wait until ArgoCD successfully apply the changes | false | false |
| toolchain | Toolchain ('helm', 'helmfile') | helmfile | false |
| values\_file | Helmfile values file |  | false |


## Outputs

| Name | Description |
|------|-------------|
| sha | Git commit SHA into argocd repo |
| webapp-url | Web Application url |
<!-- markdownlint-restore -->

