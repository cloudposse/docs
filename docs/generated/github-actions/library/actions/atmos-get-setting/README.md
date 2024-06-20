---
title: atmos-get-setting
sidebar_label: atmos-get-setting
sidebar_class_name: command
description: |-
  GitHub Action to retrieve a setting from [atmos](https://github.com/cloudposse/atmos) configuration.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-atmos-get-setting/blob/main/README.yaml
---

# GitHub Action: `atmos-get-setting`
GitHub Action to retrieve a setting from [atmos](https://github.com/cloudposse/atmos) configuration.




## Introduction

GitHub Action to retrieve settings from [atmos](https://github.com/cloudposse/atmos) configuration. There are two ways
to use this action. The first is to retrieve a single setting and to get its value returned via the `value` output.
The second is to retrieve multiple settings as an object returned via the `settings` output.



## Usage

```
# Example stacks/dev.yaml
components:
  terraform:
    foo:
      settings:
        roleArn: arn:aws:iam::000000000000:role/MyRole
        secretsArn: arn:aws:secretsmanager:us-east-1:000000000000:secret:MySecret-PlMes3
      vars:
        foo: bar
```

```yaml
  name: github-action-atmos-get-setting
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:

        # The following example will return a single setting value of
        # `arn:aws:secretsmanager:us-east-1:000000000000:secret:MySecret-PlMes3` in the `value` output:
        - name: github-action-atmos-get-setting
          uses: cloudposse/github-action-atmos-get-setting@main
          id: example
          with:
            component: foo
            stack: core-ue1-dev
            settings-path: settings.secrets-arn

        # The following example will return an object with the following structure in the `settings` output:
        # {"secretsArn":"arn:aws:secretsmanager:us-east-1:000000000000:secret:MySecret-PlMes3", "roleArn":"arn:aws:iam::000000000000:role/MyRole"}
        - name: github-action-atmos-get-setting
          uses: cloudposse/github-action-atmos-get-setting@main
          id: example
          with:
            settings: |
              - component: foo
                stack: core-ue1-dev
                settingsPath: settings.secrets-arn
                outputPath: secretsArn
              - component: foo
                stack: core-ue1-dev
                settingsPath: settings.secrets-arn
                outputPath: roleArn

```

## Migrating from `v0` to `v1`

Starting from `v1` the action is no longer restricted to retrieving the component config from only the `settings` section.
If you want the same behavior in `v1`  as in`v0`, you should add the `settings.` prefix to the value of the `settings-path` variable.
For example, in `v1` you would provide `settings.secrets-arn` as the value to the `settings-path`
```yaml
  - name: github-action-atmos-get-setting
    uses: cloudposse/github-action-atmos-get-setting@v1
    id: example
    with:
      component: foo
      stack: core-ue1-dev
      settings-path: settings.secrets-arn
```

Which would provide the same output as passing only `secrets-arn` in `v0`

```yaml
  - name: github-action-atmos-get-setting
    uses: cloudposse/github-action-atmos-get-setting@v0
    id: example
    with:
      component: foo
      stack: core-ue1-dev
      settings-path: secrets-arn
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| component | The atmos component extract the settings for. | N/A | false |
| settings | The settings to extract. | N/A | false |
| settings-path | The settings path using JSONPath expressions. | N/A | false |
| stack | The atmos stack extract the settings for. | N/A | false |


## Outputs

| Name | Description |
|------|-------------|
| settings | The settings values when multiple settings are returned. |
| value | The value of the setting when a single setting is returned. |
<!-- markdownlint-restore -->

