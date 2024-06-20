---
title: matrix-extended
sidebar_label: matrix-extended
sidebar_class_name: command
description: |-
  GitHub Action that when used together with reusable workflows makes it easier to workaround the limit of 256 jobs in a matrix.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-matrix-extended/blob/main/README.yaml
---

# GitHub Action: `matrix-extended`
GitHub Action that when used together with reusable workflows makes it easier to workaround the limit of 256 jobs in a matrix.




## Introduction

GitHub Actions matrix have [limit to 256 items](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs#using-a-matrix-strategy)
There is workaround to extend the limit with [reusable workflows](https://github.com/orgs/community/discussions/38704)
This GitHub Action outputs a JSON structure for up to 3 levels deep of nested matrixes.
In theory run 256 ^ 3 (i.e., 16 777 216) jobs per workflow run!

| Matrix max nested level | Total jobs count limit   |
|-------------------------|--------------------------|
|         1               |            256           |
|         2               |           65 536         | 
|         3               |         16 777 216       |

If `nested-matrices-count` input is `1`, the output `matrix` would be JSON formatted string with the following structure

```yaml
{
  "include": [matrix items]
}
```

If `nested-matrices-count` input is `2` output `matrix` whould be a JSON formatted string with the following structure

```yaml
{
  "include": [{
    "name": "group name",
    "items": {
      "include": [matrix items]
    } ## serialized as string
  }]
}
```

If `nested-matrices-count` input is `3` output `matrix` would be a JSON formatted string with the following structure

```yaml
{
  "include": [{
    "name": "group name",
    "items": [{
      "name": "chunk 256 range name",
      "include": [
        "items": {
          "include": [matrix items] ## serialized as string
        }
      ]
    }] ## serialized as string

    } ## serialized as string
  }]
}
```

> [!WARNING]  
> Make sure you [restrict the concurrency](https://docs.github.com/en/actions/using-jobs/using-concurrency) of your jobs to avoid DDOS'ing the GitHub Actions API, which might cause restrictions to be applied to your account.
>
>   | Matrix max nested level | First Matrix Concurrency | Second Matrix Concurrency | Third Matrix Concurrency |
>   |-------------------------|--------------------------|---------------------------|--------------------------|
>   |         1               |            x             |              -            |             -            |
>   |         2               |            1             |              x            |             -            | 
>   |         3               |            1             |              1            |             x            |
>



## Usage

The action have 3 modes depends of how many nested levels you want. 
The settings affect to reusable workflows count and usage pattern.

## 1 Level of nested matrices

`.github/workflows/matrices-1.yml`

```yaml
  name: github-action-matrix-extended
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    matrix-builder:
      runs-on: self-hosted
      name: github-action-matrix-extended
      outputs:
        matrix: ${{ steps.extend.outputs.matrix }}
      steps:
        - id: setup-matrix
          uses: druzsan/setup-matrix@v1
          with:
            matrix: |
              os: ubuntu-latest windows-latest macos-latest,
              python-version: 3.8 3.9 3.10
              arch: arm64 amd64

        - uses: cloudposse/github-action-matrix-extended@main
          id: extend
          with:
            matrix: ${{ steps.setup-matrix.outputs.matrix }}
            sort-by: '[.python-version, .os, .arch] | join("-")'
            group-by: '.arch'
            nested-matrices-count: '1'          

    operation:
      if: ${{ needs.matrix-builder.outputs.matrix != '{"include":[]}' }}
      needs:
        - matrix-builder
      strategy:
        max-parallel: 10
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(needs.matrix-builder.outputs.matrix) }}
      name: github-action-matrix-extended
      runs-on: self-hosted
      steps:
        - shell: bash
          run: |
            echo "Do real work - ${{ matrix.os }} - ${{ matrix.arch }} - ${{ matrix.python-version }}"
```

## 2 Level of nested matrices

`.github/workflows/matrices-1.yml`

```yaml
  name: github-action-matrix-extended
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    matrix-builder:
      runs-on: self-hosted
      name: github-action-matrix-extended
      outputs:
        matrix: ${{ steps.extend.outputs.matrix }}
      steps:
        - id: setup-matrix
          uses: druzsan/setup-matrix@v1
          with:
            matrix: |
              os: ubuntu-latest windows-latest macos-latest,
              python-version: 3.8 3.9 3.10
              arch: arm64 amd64

        - uses: cloudposse/github-action-matrix-extended@main
          id: extend
          with:
            sort-by: '[.python-version, .os, .arch] | join("-")'
            group-by: '.arch'
            nested-matrices-count: '1'          
            matrix: ${{ steps.setup-matrix.outputs.matrix }}

    operation:
      if: ${{ needs.matrix-builder.outputs.matrix != '{"include":[]}' }}
      uses: ./.github/workflows/matrices-2.yml
      needs:
        - matrix-builder
      strategy:
        max-parallel: 1 # This is important to avoid ddos GHA API
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(needs.matrix-builder.outputs.matrix) }}
      name: github-action-matrix-extended
      with:
        items: ${{ matrix.items }}
```

`.github/workflows/matrices-2.yml`

```yaml
  name: github-action-matrix-extended
  on:
    workflow_call:
      inputs:
        items:
          description: "Items"
          required: true
          type: string

  jobs:
    operation:
      if: ${{ inputs.items != '{"include":[]}' }}
      strategy:
        max-parallel: 10
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(inputs.items) }}
      name: github-action-matrix-extended
      runs-on: self-hosted
      steps:
        - shell: bash
          run: |
            echo "Do real work - ${{ matrix.os }} - ${{ matrix.arch }} - ${{ matrix.python-version }}"
```


## 3 Level of nested matrices

`.github/workflows/matrices-1.yml`

```yaml
  name: github-action-matrix-extended
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    matrix-builder:
      runs-on: self-hosted
      name: github-action-matrix-extended
      outputs:
        matrix: ${{ steps.extend.outputs.matrix }}
      steps:
        - id: setup-matrix
          uses: druzsan/setup-matrix@v1
          with:
            matrix: |
              os: ubuntu-latest windows-latest macos-latest,
              python-version: 3.8 3.9 3.10
              arch: arm64 amd64

        - uses: cloudposse/github-action-matrix-extended@main
          id: query
          with:
            sort-by: '[.python-version, .os, .arch] | join("-")'
            group-by: '.arch'
            nested-matrices-count: '1'          
            matrix: ${{ steps.setup-matrix.outputs.matrix }}

    operation:
      if: ${{ needs.matrix-builder.outputs.matrix != '{"include":[]}' }}
      uses: ./.github/workflows/matrices-2.yml
      needs:
        - matrix-builder
      strategy:
        max-parallel: 1 # This is important to avoid ddos GHA API
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(needs.matrix-builder.outputs.matrix) }}
      name: github-action-matrix-extended
      with:
        items: ${{ matrix.items }}
```

`.github/workflows/matrices-2.yml`

```yaml
  name: github-action-matrix-extended
  on:
    workflow_call:
      inputs:
        items:
          description: "Items"
          required: true
          type: string

  jobs:
    operation:
      if: ${{ inputs.items != '{"include":[]}' }}
      uses: ./.github/workflows/matrices-3.yml
      strategy:
        max-parallel: 1 # This is important to avoid ddos GHA API
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(inputs.items) }}
      name: github-action-matrix-extended
      with:
        items: ${{ matrix.items }}
```


`.github/workflows/matrices-3.yml`

```yaml
  name: github-action-matrix-extended
  on:
    workflow_call:
      inputs:
        items:
          description: "Items"
          required: true
          type: string

  jobs:
    operation:
      if: ${{ inputs.items != '{"include":[]}' }}
      strategy:
        max-parallel: 10
        fail-fast: false # Don't fail fast to avoid locking TF State
        matrix: ${{ fromJson(inputs.items) }}
      name: github-action-matrix-extended
      runs-on: self-hosted
      steps:
        - shell: bash
          run: |
            echo "Do real work - ${{ matrix.os }} - ${{ matrix.arch }} - ${{ matrix.python-version }}"
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| group-by | Group by query | empty | false |
| matrix | Matrix inputs (JSON array or object which includes property passed as string or file path) | N/A | true |
| nested-matrices-count | Number of nested matrices that should be returned as the output (from 1 to 3) | 1 | false |
| sort-by | Sort by query | empty | false |


## Outputs

| Name | Description |
|------|-------------|
| matrix | A matrix suitable for extending matrix size workaround (see README) |
<!-- markdownlint-restore -->

