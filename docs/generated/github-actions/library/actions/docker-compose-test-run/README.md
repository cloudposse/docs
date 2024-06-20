---
title: docker-compose-test-run
sidebar_label: docker-compose-test-run
sidebar_class_name: command
description: |-
  Up docker compose and run tests in specific container
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-docker-compose-test-run/blob/main/README.yaml
---

# GitHub Action: `docker-compose-test-run`
Up docker compose and run tests in specific container




## Introduction

Run tests in enviroment defined with Docker Compose



## Usage

```yaml
  name: github-action-docker-compose-test-run
  on:
    push:
      branches: [ master ]

  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-docker-compose-test-run
          uses: actions/checkout@v3
  
        - name: github-action-docker-compose-test-run
          uses: cloudposse/github-action-docker-compose-test-run@main
          with:
            file: test/docker-compose.yml
            service: app
            command: test/unit-tests.sh
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| command | Command to run tests | N/A | true |
| docker-compose-version | Docker compose version | 1.29.2 | false |
| entrypoint | Entrypoint | /bin/sh | false |
| file | Docker compose file | N/A | true |
| login | Docker login |  | false |
| password | Docker password |  | false |
| registry | Docker registry | N/A | true |
| service | Service run tests inside | N/A | true |
| workdir | Working directory | ./ | false |


## Outputs

| Name | Description |
|------|-------------|
<!-- markdownlint-restore -->

