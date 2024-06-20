---
title: validate-codeowners
sidebar_label: validate-codeowners
sidebar_class_name: command
description: |-
  This is a Github Action to validate the `CODEOWNERS` file by running a series of checks against the `CODEOWNERS` file to ensure that it's valid and well-linted.

  Ensuring your repository's `CODEOWNERS` file is valid can be critical to the development process if, for instance, your project uses [branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches) conditions that rely on definitions in `CODEOWNERS`.
custom_edit_url: https://github.com/cloudposse/github-action-validate-codeowners/blob/main/README.yaml
---

# GitHub Action: `validate-codeowners`
This is a Github Action to validate the `CODEOWNERS` file by running a series of checks against the `CODEOWNERS` file to ensure that it's valid and well-linted.

Ensuring your repository's `CODEOWNERS` file is valid can be critical to the development process if, for instance, your project uses [branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches) conditions that rely on definitions in `CODEOWNERS`.






## Usage

Copy the `.github/workflows/validate-codeowners.yml` file from this repository into the `.github/workflows` folder of the repository to which you'd like to add Validate `CODEOWNERS` functionality, and ensure that you are using an appropriate token in the workflow file.
This will cause the validation functionality to execute whenever any event occurs on any pull request.

## Quick Start

Here's how to get started...
1. Copy the `.github/workflows/validate-codeowners.yml` file from this repository into the `.github/workflows` folder of the repository to which you'd like to add Validate CODEOWNERS functionality.
2. Replace `${{ secrets.CODEOWNERS_VALIDATOR_TOKEN_PUBLIC }}` with the name of a token whose permissions are in line with your target repo's requirements, according to the instructions [here](https://github.com/mszostok/codeowners-validator/blob/main/docs/gh-token.md).
3. (Optional) Update the `main` pin inside `validate-codeowners.yml` to a fixed version. Consult https://github.com/cloudposse/github-action-validate-codeowners/releases for a list of available versions.


## Examples

Here's a real world example:
- [`github-action-validate-codeowners`](https://github.com/cloudposse/github-action-validate-codeowners/.github/workflows/validate-codeowners.yml) - Cloud Posse's self-testing Validate CODEOWNERS GitHub Action



