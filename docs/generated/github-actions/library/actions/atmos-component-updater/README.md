---
title: atmos-component-updater
sidebar_label: atmos-component-updater
sidebar_class_name: command
description: |-
  This is GitHub Action that can be used as a workflow for automatic updates via Pull Requests in your infrastructure repository according to versions in components sources.
tags:
  - github-action
  - atmos

custom_edit_url: https://github.com/cloudposse/github-action-atmos-component-updater/blob/main/README.yaml
---

# GitHub Action: `atmos-component-updater`
This is GitHub Action that can be used as a workflow for automatic updates via Pull Requests in your infrastructure repository according to versions in components sources.




## Introduction

This is GitHub Action that can be used as a workflow for automatic updates via Pull Requests in your infrastructure repository according to versions in components sources.

### Key Features:

- **Selective Component Processing:** Configure the action to `exclude` or `include` specific components using wildcards, ensuring that only relevant updates are processed.
- **PR Management:** Limit the number of PRs opened at a time, making it easier to manage large-scale updates without overwhelming the system. Automatically close old component-update PRs, so they don't pile up.
- **Material Changes Focus:** Automatically open pull requests only for components with significant changes, skipping minor updates to `component.yaml` files to reduce unnecessary PRs and maintain a streamlined system.
- **Informative PRs:** Link PRs to release notes for new components, providing easy access to relevant information, and use consistent naming for easy tracking.
- **Scheduled Updates:** Run the action on a cron schedule tailored to your organization's needs, ensuring regular and efficient updates.



## Usage

### Prerequisites

This GitHub Action once used in workflow needs permissions to create/update branches and open/close pull requests so the access token needs to be passed.

It can be done in two ways:
- create a dedicated Personal Access Token (PAT)
- use [`GITHUB_TOKEN`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret)

If you would like to use `GITHUB_TOKEN` make sure to set permissions in the workflow as follow:

```yaml
permissions:
  contents: write
  pull-requests: write
```

Also, make sure that you set to `Allow GitHub Actions to create and approve pull requests` on both organization and repository levels:
- `https://github.com/organizations/YOUR-ORG/settings/actions`
- `https://github.com/YOUR-ORG/YOUR-REPO/settings/actions`

### Workflow example

```yaml
  name: github-action-atmos-component-updater

  on:
    workflow_dispatch: {}

    schedule:
      - cron:  '0 8 * * 1'         # Execute every week on Monday at 08:00

  permissions:
    contents: write
    pull-requests: write

  jobs:
    update:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-atmos-component-updater
          uses: actions/checkout@v3
          with:
            fetch-depth: 0

        - name: github-action-atmos-component-updater
          uses: cloudposse/github-action-atmos-component-updater@v2
          with:
            github-access-token: ${{ secrets.GITHUB_TOKEN }}
            max-number-of-prs: 5
            include: |
              aws-*
              eks/*
              bastion
            exclude: aws-sso,aws-saml
```

### Using a Custom Atmos CLI Config Path (`atmos.yaml`)

If your [`atmos.yaml` file](https://atmos.tools/cli/configuration) is not located in the root of the infrastructure repository, you can specify the path to it using [`ATMOS_CLI_CONFIG_PATH` env variable](https://atmos.tools/cli/configuration/#environment-variables).

```yaml
  # ...
  - name: github-action-atmos-component-updater
    uses: cloudposse/github-action-atmos-component-updater@v2
    env:
      # Directory containing the `atmos.yaml` file
      ATMOS_CLI_CONFIG_PATH: ${{ github.workspace }}/rootfs/usr/local/etc/atmos/
    with:
      github-access-token: ${{ secrets.GITHUB_TOKEN }}
      max-number-of-prs: 5
```

### Customize Pull Request labels, title and body

```yaml
  # ...
  - name: github-action-atmos-component-updater
    uses: cloudposse/github-action-atmos-component-updater@v2
    with:
      github-access-token: ${{ secrets.GITHUB_TOKEN }}
      max-number-of-prs: 5
      pr-title: 'Update Atmos Component \`{{ component_name }}\` to {{ new_version }}'
      pr-body: |
        ## what
        Component \`{{ component_name }}\` was updated [{{ old_version }}]({{ old_version_link }}) → [{{ old_version }}]({{ old_version_link }}).

        ## references
        - [{{ source_name }}]({{ source_link }})
      pr-labels: |
        component-update
        automated
        atmos
```

**IMPORTANT:** The backtick symbols must be escaped in the GitHub Action parameters. This is because GitHub evaluates whatever is in the backticks and it will render as an empty string.

  #### For `title` template these placeholders are available:
  - `component_name`
  - `source_name`
  - `old_version`
  - `new_version`

  #### For `body` template these placeholders are available:
  - `component_name`
  - `source_name`
  - `source_link`
  - `old_version`
  - `new_version`
  - `old_version_link`
  - `new_version_link`
  - `old_component_release_link`
  - `new_component_release_link`

## FAQ

### The action cannot find any components

You may see that the action returns zero components:

```console
[06-03-2024 17:53:47] INFO    Found 0 components
[]
```

This is a common error when the workflow has not checked out the repository before calling this action. Add the following before calling this action.

```yaml
- name: github-action-atmos-component-updater
  uses: actions/checkout@v4
```

### The action cannot find the `component.yaml` file

You may see the action fail to find the `component.yaml` file for a given component as such:

```console
FileNotFoundError: [Errno 2] No such file or directory: 'components/terraform/account-map/component.yaml'
```

This is likely related to a missing or invalid `atmos.yaml` configuration file. Set `ATMOS_CLI_CONFIG_PATH` to the path to your Atmos configuration file.

```yaml
env:
  ATMOS_CLI_CONFIG_PATH: ${{ github.workspace }}/rootfs/usr/local/etc/atmos/
```

### The action does not have permission to create Pull Requests

Your action may fail with the following message:

```console
github.GithubException.GithubException: 403 {"message": "GitHub Actions is not permitted to create or approve pull requests.", "documentation_url": "https://docs.github.com/rest/pulls/pulls#create-a-pull-request"}
```

In order to create Pull Requests in your repository, we need to set the permissions for the workflow:

```yaml
permissions:
  contents: write
  pull-requests: write
```

_And_ you need to allow GitHub Actions to create and approve pulls requests in both the GitHub Organization and Repository:

1. `https://github.com/organizations/YOUR-ORG/settings/actions` > `Allow GitHub Actions to create and approve pull requests`
2. `https://github.com/YOUR-ORG/YOUR-REPO/settings/actions` > `Allow GitHub Actions to create and approve pull requests`






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| atmos-version | Atmos version to use for vendoring. Default 'latest' | latest | false |
| dry-run | Skip creation of remote branches and pull requests. Only print list of affected componented into file that is defined in 'outputs.affected-components-file' | false | false |
| exclude | Comma or new line separated list of component names to exclude. For example: 'vpc,eks/\*,rds'. By default no components are excluded. Default '' |  | false |
| github-access-token | GitHub Token used to perform git and GitHub operations | ${{ github.token }} | false |
| include | Comma or new line separated list of component names to include. For example: 'vpc,eks/\*,rds'. By default all components are included. Default '\*' | \* | false |
| infra-terraform-dirs | Comma or new line separated list of terraform directories in infra repo. For example 'components/terraform,components/terraform-old. Default 'components/terraform' | components/terraform | false |
| log-level | Log level for this action. Default 'INFO' | INFO | false |
| max-number-of-prs | Number of PRs to create. Maximum is 10. | 10 | false |
| pr-body-template | A string representing a Jinja2 formatted template to be used as the content of a Pull Request (PR) body. If not set template from `src/templates/pr\_body.j2.md` will be used |  | false |
| pr-labels | Comma or new line separated list of labels that will added on PR creation. Default: `component-update` | component-update | false |
| pr-title-template | A string representing a Jinja2 formatted template to be used as the content of a Pull Request (PR) title. If not, set template from `src/templates/pr\_title.j2.md` will be used |  | false |
| vendoring-enabled | Do not perform 'atmos vendor component-name' on components that wasn't vendored | true | false |


## Outputs

| Name | Description |
|------|-------------|
| affected | The affected components |
| has-affected-stacks | Whether there are affected components |
<!-- markdownlint-restore -->

