---
title: kubernetes-environment
sidebar_label: kubernetes-environment
sidebar_class_name: command
description: |-
  This repository wraps the environment information action, allowing it to be used as a replacement in support of various string functions and namespace standardization.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-kubernetes-environment/blob/main/README.yaml
---

# GitHub Action: `kubernetes-environment`
This repository wraps the environment information action, allowing it to be used as a replacement in support of various string functions and namespace standardization.




## Introduction

We often find when deploying with various environments that we need to standardize the namespace names. This repository wraps the environment information action, allowing it to be used as a replacement in support of various string functions and namespace standardization.

With this action, you can use pipe functions to standardize the namespace names, for example, to lowercase, or to replace a dash with an underscore you can use ` | kebabcase` or `| toLower`



## Usage


To use this action, you'll want to create a workflow and argocd repository.
This action is intended to replace cloudposse/github-action-yaml-config-query by wrapping it with helper actions.

With this action your `config` input can have several helper functions.

* `reformat` this replaces the namespace with a flavor of your choice. this is a key added to an environments configuration. See snipped below for example
  * `branch-name` will use the branch name as the namespace
  * `pr-number` will use the PR number as the namespace
* `| functions`: you can now perform simple string operations on keys in your environment configuration. This can help prevent dns invalid characters from becoming your namespace based on the branch name.
  * `| kebabcase` will convert the string to kebabcase (alternatively you can use `| toKebab` or `| kebab`)
  * `| lowercase` will convert the string to lowercase (alternatively you can use `| toLower` or `| lower`)
  * `| uppercase` will convert the string to uppercase (alternatively you can use `| toUpper` or `| upper`) Though this is perhaps less helpful as it is not valid in kubernetes nor dns.

```yaml
- name: github-action-kubernetes-environment
  # We recommend pinning this action to a specific release or version range to ensure stability
  uses: cloudposse/github-action-kubernetes-environment@main
  id: result
  with:
    environment: ${{ inputs.environment }}
    namespace: ${{ inputs.namespace }}
    application: ${{ inputs.application }}
    config: |
      preview:
        cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-dev/apps
        cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
        namespace: ${{ inputs.namespace }}
        reformat: branch-name # reformats namespace to be branch name as kebabcase, alternatively use `pr-number` here for `pr-123` as your namespace
        ssm-path: platform/dev-cluster
      qa1:
        cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-staging/apps
        cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
        namespace: QA1/MY-APP | kebabcase
        # output namespace will become qa1-my-app
        ssm-path: platform/staging-cluster
  ```

* To get custom key value pairs you can query the selected environment with a follow up step:
      
```yaml
- name: github-action-kubernetes-environment
uses: cloudposse/github-action-yaml-config-query@0.1.0
id: environment-info
with:
  query: .
  config: ${{ steps.result.outputs.environment-config }}
```

<details><summary>  Full Workflow example:</summary>

```yaml
name: github-action-kubernetes-environment
description: 'Get information about environment'
inputs:
  environment:
    description: "Environment name"
    required: true
  application:
    description: "The application name"
    required: false
  namespace:
    description: "Namespace name"
    required: true
outputs:
  name:
    description: "Environment name"
    value: ${{ inputs.environment }}
  region:
    description: "Default AWS Region"
    value: us-east-2
  role:
    description: "Environments that need to be deployed"
    value: ${{ steps.result.outputs.role }}
  cluster:
    description: "Environments that need to be destroyed"
    value: ${{ steps.result.outputs.cluster }}
  namespace:
    description: "Namespace"
    value: ${{ steps.result.outputs.namespace }}
  ssm-path:
    description: "Path to ssm secrets"
    value: ${{ steps.result.outputs.ssm-path }}

runs:
  using: "composite"
  steps:
    - name: github-action-kubernetes-environment
      # We recommend pinning this action to a specific release or version range to ensure stability
      uses: cloudposse/github-action-kubernetes-environment@main
      id: result
      with:
        environment: ${{ inputs.environment }}
        namespace: ${{ inputs.namespace }}
        application: ${{ inputs.application }}
        config: |
          preview:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-dev/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: ${{ inputs.namespace }}
            ssm-path: platform/dev-cluster
            reformat: branch-name
          qa1:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-staging/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: qa1
            ssm-path: platform/staging-cluster
          qa2:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-staging/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: qa2
            ssm-path: platform/staging-cluster
          qa3:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-staging/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: qa3
            ssm-path: platform/staging-cluster
          qa4:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-staging/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: qa4
            ssm-path: platform/staging-cluster
          
          production:
            cluster: https://github.com/athoteldev/argocd-deploy-prod/blob/main/plat/ue2-prod/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: production
            ssm-path: platform/prod-cluster
          
          staging:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-staging/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: staging
            ssm-path: platform/staging-cluster
          
          sandbox:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-sandbox/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: sandbox
            ssm-path: platform/sandbox-cluster

          dev:
            cluster: https://github.com/cloudposse/argocd-repo/blob/main/plat/ue2-dev/apps
            cluster-role: arn:aws:iam::123456789012:role/my-gha-cluster-role
            namespace: dev  
            ssm-path: platform/dev-cluster
```

</details>






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| application | The application name | N/A | false |
| config | configuration | N/A | true |
| environment | Environment | N/A | true |
| namespace | Kubernetes namespace | N/A | true |
| namespace-deny-list | Kubernetes namespace deny list, generated names cannot contain this comma separated list. | kube-system,kube-public,default | false |
| namespace-prefix | Kubernetes namespace prefix |  | false |
| namespace-suffix | Kubernetes namespace suffix |  | false |


## Outputs

| Name | Description |
|------|-------------|
| cluster | Environments that need to be destroyed |
| environment-config | Environment configuration |
| name | Environment name |
| namespace | Namespace |
| role | Environments that need to be deployed |
| ssm-path | Path to ssm secrets |
<!-- markdownlint-restore -->

