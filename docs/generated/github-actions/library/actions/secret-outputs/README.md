---
title: secret-outputs
sidebar_label: secret-outputs
sidebar_class_name: command
description: |-
  This GitHub Action implement [workaround](https://nitratine.net/blog/post/how-to-pass-secrets-between-runners-in-github-actions/) for the problem 
  [`Combining job outputs with masking leads to empty output`](https://github.com/actions/runner/issues/1498).
  The problem was described in 
  [`GitHub Action documentation`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs) 
  - `Outputs containing secrets are redacted on the runner and not sent to GitHub Actions`.
tags:
  - github-action

custom_edit_url: https://github.com/cloudposse/github-action-secret-outputs/blob/main/README.yaml
---

# GitHub Action: `secret-outputs`
This GitHub Action implement [workaround](https://nitratine.net/blog/post/how-to-pass-secrets-between-runners-in-github-actions/) for the problem 
[`Combining job outputs with masking leads to empty output`](https://github.com/actions/runner/issues/1498).
The problem was described in 
[`GitHub Action documentation`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs) 
- `Outputs containing secrets are redacted on the runner and not sent to GitHub Actions`.






## Usage

```yaml
  name: github-action-secret-outputs
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - name: github-action-secret-outputs
          id: iam
          run: |
            echo "role=arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/admin" >> $GITHUB_OUTPUT

        - uses: cloudposse/github-action-secret-outputs@main
          id: role
          with:
            ## PASSWORD is a gpg passphrase stored in Github Secrets.
            secret: ${{ secrets.PASSWORD }}
            op: encode
            in: ${{ steps.iam.outputs.role }}
        
      outputs:
        role: ${{ steps.role.outputs.out }}

    usage:
      runs-on: ubuntu-latest
      needs: [context]
      steps:
        - uses: cloudposse/github-action-secret-outputs@main
          id: role
          with:
            ## PASSWORD is a gpg passphrase stored in Github Secrets.          
            secret: ${{ secrets.PASSWORD }}
            op: decode
            in: ${{ needs.context.outputs.role }}

        - name: github-action-secret-outputs
          uses: aws-actions/configure-aws-credentials@v1
          with:
            role-to-assume: ${{ steps.role.outputs.out }}
            aws-region: us-east-2
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| in | Input data | N/A | true |
| op | Operation to perform (encode or decode) | encode | true |
| secret | Secret to encrypt/decrypt data | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| out | Result of encryption/decryption |
<!-- markdownlint-restore -->

