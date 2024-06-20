---
title: matrix-outputs-read
sidebar_label: matrix-outputs-read
sidebar_class_name: command
description: |-
  [Workaround implementation](https://github.com/community/community/discussions/17245#discussioncomment-3814009) - Read matrix jobs outputs

tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-matrix-outputs-read/blob/main/README.yaml
---

# GitHub Action: `matrix-outputs-read`
[Workaround implementation](https://github.com/community/community/discussions/17245#discussioncomment-3814009) - Read matrix jobs outputs





## Introduction

GitHub actions have an [Jobs need a way to reference all outputs of matrix jobs](https://github.com/community/community/discussions/17245) issue.
If there is a job that runs multiple times with `strategy.matrix` only the latest iteration's output availiable for 
reference in other jobs.

There is a [workaround](https://github.com/community/community/discussions/17245#discussioncomment-3814009) to address the limitation.
We implement the workaround with two GitHub Actions:
* [Matrix Outputs Write](https://github.com/cloudposse/github-action-matrix-outputs-write)
* [Matrix Outputs Read](https://github.com/cloudposse/github-action-matrix-outputs-read)

## v1 - What's new

> [!IMPORTANT]
> cloudposse/github-action-matrix-outputs-read@v1+ is not currently supported on GHES yet. If you are on GHES, you 
> must use [v0](https://github.com/cloudposse/github-action-matrix-outputs-read/releases/tag/0.1.2).

The release of `cloudposse/github-action-matrix-outputs-write@v1` and `cloudposse/github-action-matrix-outputs-read@v1` 
are major changes to the backend architecture of Artifacts. They have numerous performance and behavioral improvements.

For more information, see the [`@actions/artifact`](https://github.com/actions/toolkit/tree/main/packages/artifact) documentation.

### Breaking Changes

1. On self hosted runners, additional [firewall rules](https://github.com/actions/toolkit/tree/main/packages/artifact#breaking-changes) may be required.
2. `cloudposse/github-action-matrix-outputs-read@v1` can not be read outputs writen by `cloudposse/github-action-matrix-outputs-write@v0`.



## Usage

Example how you can use workaround to reference matrix job outputs.

```yaml
  name: github-action-matrix-outputs-read
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    build:
      runs-on: ubuntu-latest
      strategy:
        matrix:
          platform: ["i386", "arm64v8"]
      steps:
        - name: github-action-matrix-outputs-read
          uses: actions/checkout@v3

        - name: github-action-matrix-outputs-read
          id: build
          uses: cloudposse/github-action-docker-build-push@1.9.0
          with:
            registry: registry.hub.docker.com
            organization: "${{ github.event.repository.owner.login }}"
            repository: "${{ github.event.repository.name }}"
            build-args: |-
              PLATFORM=${{ matrix.platform }}

        ## Write for matrix outputs workaround 
        - uses: cloudposse/github-action-matrix-outputs-write@v1
          id: out
          with:
            matrix-step-name: github-action-matrix-outputs-read
            matrix-key: ${{ matrix.platform }}
            outputs: |-
              image: ${{ steps.build.outputs.image }}:${{ steps.build.outputs.tag }}

    ## Read matrix outputs 
    read:
      runs-on: ubuntu-latest
      needs: [build]
      steps:
        - uses: cloudposse/github-action-matrix-outputs-read@v1
          id: read
          with:
            matrix-step-name: github-action-matrix-outputs-read

      outputs:
        result: "${{ steps.read.outputs.result }}"

    ## This how you can reference matrix output
    assert:
      runs-on: ubuntu-latest
      needs: [read]
      steps:
        - uses: nick-fields/assert-action@v1
          with:
            expected: ${{ registry.hub.docker.com }}/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:i386
            ## This how you can reference matrix output
            actual: ${{ fromJson(needs.read.outputs.result).image.i386 }}

        - uses: nick-fields/assert-action@v1
          with:
            expected: ${{ registry.hub.docker.com }}/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:arm64v8
            ## This how you can reference matrix output
            actual: ${{ fromJson(needs.read.outputs.result).image.arm64v8 }}
```

### Reusable workflow example 

Reusable workflow that support matrix outputs

`./.github/workflow/build-reusabled.yaml`

```yaml
name: github-action-matrix-outputs-read
on:
  workflow_call:
    inputs:
      registry:
        required: true
        type: string
      organization:
        required: true
        type: string
      repository:
        required: true
        type: string
      platform:
        required: true
        type: string
      matrix-step-name:
        required: false
        type: string
      matrix-key:
        required: false
        type: string
    outputs:
      image:
        description: "Image"
        value: ${{ jobs.write.outputs.image }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: github-action-matrix-outputs-read
        uses: actions/checkout@v3

      - name: github-action-matrix-outputs-read
        id: build
        uses: cloudposse/github-action-docker-build-push@1.9.0
        with:
          registry: ${{ inputs.registry }}
          organization: ${{ inputs.organization }}
          repository: ${{ inputs.repository }}
          build-args: |-
            PLATFORM=${{ inputs.platform }}
    outputs:
      image: ${{ needs.build.outputs.image }}:${{ needs.build.outputs.tag }}

  write:
    runs-on: ubuntu-latest
    needs: [build]
    steps:        
      ## Write for matrix outputs workaround 
      - uses: cloudposse/github-action-matrix-outputs-write@v1
        id: out
        with:
          matrix-step-name: github-action-matrix-outputs-read
          matrix-key: ${{ inputs.matrix-key }}
          outputs: |-
            image: ${{ needs.build.outputs.image }}

    outputs:
      image: ${{ fromJson(steps.out.outputs.result).image }}
```

Then you can use the workflow with matrix

```yaml
name: github-action-matrix-outputs-read
on:
  pull_request:
    branches: [ 'main' ]
    types: [opened, synchronize, reopened, closed, labeled, unlabeled]

jobs:
  build:
    usage: ./.github/workflow/build-reusabled.yaml
    strategy:
      matrix:
        platform: ["i386", "arm64v8"]
    with:
      registry: registry.hub.docker.com
      organization: "${{ github.event.repository.owner.login }}"
      repository: "${{ github.event.repository.name }}"
      platform: ${{ matrix.platform }}
      matrix-step-name: github-action-matrix-outputs-read
      matrix-key: ${{ matrix.platform }}

  ## Read matrix outputs 
  read:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: cloudposse/github-action-matrix-outputs-read@v1
        id: read
        with:
          matrix-step-name: github-action-matrix-outputs-read

    outputs:
      result: "${{ steps.read.outputs.result }}"

  ## This how you can reference matrix output
  assert:
    runs-on: ubuntu-latest
    needs: [read]
    steps:
      - uses: nick-fields/assert-action@v1
        with:
          expected: ${{ registry.hub.docker.com }}/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:i386
          ## This how you can reference matrix output
          actual: ${{ fromJson(needs.read.outputs.result).image.i386 }}

      - uses: nick-fields/assert-action@v1
        with:
          expected: ${{ registry.hub.docker.com }}/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:arm64v8
          ## This how you can reference matrix output
          actual: ${{ fromJson(needs.read.outputs.result).image.arm64v8 }}
```

or as a simple job

```yaml
name: github-action-matrix-outputs-read
on:
  pull_request:
    branches: [ 'main' ]
    types: [opened, synchronize, reopened, closed, labeled, unlabeled]

jobs:
  build:
    usage: ./.github/workflow/build-reusabled.yaml
    with:
      registry: registry.hub.docker.com
      organization: "${{ github.event.repository.owner.login }}"
      repository: "${{ github.event.repository.name }}"
      platform: "i386"

  ## This how you can reference single job output
  assert:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: nick-fields/assert-action@v1
        with:
          expected: ${{ registry.hub.docker.com }}/${{ github.event.repository.owner.login }}/${{ github.event.repository.name }}:i386
          ## This how you can reference matrix output
          actual: ${{ needs.build.outputs.image }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| matrix-step-name | Matrix step name | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| result | Outputs result |
<!-- markdownlint-restore -->

