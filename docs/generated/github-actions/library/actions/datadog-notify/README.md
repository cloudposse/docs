---
title: datadog-notify
sidebar_label: datadog-notify
sidebar_class_name: command
description: |-
  Create Datadog Notify Event
tags:
  - github-action
  - datadog

custom_edit_url: https://github.com/cloudposse/github-action-datadog-notify/blob/main/README.yaml
---

# GitHub Action: `datadog-notify`
Create Datadog Notify Event




## Introduction

This repository contains the action for sending an event to datadog.



## Usage


Minimal Usage:
```yaml
- name: github-action-datadog-notify
  uses: cloudposse/github-action-datadog-notify@main
  with:
    api_key: ## ${{ env.DATADOG_API_KEY }} ## ${{secrets.DATADOG_API_KEY}}
    title: "GitHub Action: ${{ github.event_name }}"
    text: "GitHub Action: ${{ github.event_name }}"
    tags: "source:github,repo:${{ github.repository }},event:${{ github.event_name }}"
    alert_type: "info"
```

Below is a snippet that will send an event to datadog when a pull request is sync'd.
Below uses the `dkershner6/aws-ssm-getparameters-action` to get the datadog api key from ssm.

```yaml
name: github-action-datadog-notify
on:
  workflow_dispatch:
  pull_request:
    branches:
      - 'main'

permissions:
  contents: read
  pull-requests: write
  id-token: write

jobs:
  datadog-notify:
    runs-on: ["self-hosted"]
    steps:
      - uses: actions/checkout@v3

      - name: github-action-datadog-notify
        id: aws-credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume:  ${{ secrets.AWS_ROLE_TO_ASSUME }}
          role-session-name: github-action-datadog-notify
          aws-region: "us-east-1"

      - uses: dkershner6/aws-ssm-getparameters-action@v1
        with:
          parameterPairs: "/datadog/datadog_api_key = DATADOG_API_KEY"

      - name: github-action-datadog-notify
        uses: cloudposse/github-action-datadog-notify@main
        with:
          api_key: ${{ env.DATADOG_API_KEY }}
          title: "GitHub Action: ${{ github.event_name }}"
          text: "GitHub Action: ${{ github.event_name }}"
          tags: "source:github,repo:${{ github.repository }},event:${{ github.event_name }}"
          alert_type: "info"
```






<!-- markdownlint-disable -->
## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| alert\_type | Type of the event, one of: error,warning,info,success,user\_update,recommendation,snapshot | info | true |
| api\_key | Datadog API Key | N/A | true |
| append\_hostname\_tag | Should we append the hostname as a tag to the event, set this to the key of the tag |  | false |
| tags | Space separated list of Tags for the event | N/A | true |
| text | Description of the event | N/A | true |
| title | Title of the event | N/A | true |

## Outputs

| Name | Description |
|------|-------------|
<!-- markdownlint-restore -->

