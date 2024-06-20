---
title: aws-region-reduction-map
sidebar_label: aws-region-reduction-map
sidebar_class_name: command
description: |-
  Converts AWS region names from full names to abbreviations
tags:
  - github-action
  - aws

custom_edit_url: https://github.com/cloudposse/github-action-aws-region-reduction-map/blob/main/README.yaml
---

# GitHub Action: `aws-region-reduction-map`
Converts AWS region names from full names to abbreviations




## Introduction

Converts AWS region names from full names to either
"fixed" (always 3 characters) or "short" (usually 4 or 5 characters)
abbreviations, following the same map as
https://github.com/cloudposse/terraform-aws-utils

Short abbreviations are generally the same as official AWS 
availability zone IDs.

Generally, AWS region names have 3 parts and the "fixed" abbreviation
is the first character of each part. Exceptions (due to collisions):
- Africa and China use second letter of first part.
- ap-south-1 is shortened to as0 to avoid conflict with ap-southeast-1
- cn-north-1 is shortened to nn0 to avoid conflict with cn-northwest-1

You should be able to list all regions with this command:
```shell
aws ec2 describe-regions --all-regions --query "Regions[].{Name:RegionName}" --output text
```
but actually it leaves out GovCloud and China
See https://github.com/jsonmaur/aws-regions for more complete list

|       long       | fixed |  short  |
|------------------|-------|---------|  
| `ap-east-1`      | `ae1` | `ape1`  |
| `ap-northeast-1` | `an1` | `apne1` |
| `ap-northeast-2` | `an2` | `apne2` |
| `ap-northeast-3` | `an3` | `apne3` |
| `ap-south-1`     | `as0` | `aps1`  |
| `ap-southeast-1` | `as1` | `apse1` |
| `ap-southeast-2` | `as2` | `apse2` |
| `ca-central-1`   | `cc1` | `cac1`  |
| `eu-central-1`   | `ec1` | `euc1`  |
| `eu-north-1`     | `en1` | `eun1`  |
| `eu-south-1`     | `es1` | `eus1`  |
| `eu-west-1`      | `ew1` | `euw1`  |
| `eu-west-2`      | `ew2` | `euw2`  |
| `eu-west-3`      | `ew3` | `euw3`  |
| `af-south-1`     | `fs1` | `afs1`  |
| `us-gov-east-1`  | `ge1` | `usge1` |
| `us-gov-west-1`  | `gw1` | `usgw1` |
| `me-south-1`     | `ms1` | `mes1`  |
| `cn-north-1`     | `nn0` | `cnn1`  |
| `cn-northwest-1` | `nn1` | `cnnw1` |
| `sa-east-1`      | `se1` | `sae1`  |
| `us-east-1`      | `ue1` | `use1`  |
| `us-east-2`      | `ue2` | `use2`  |
| `us-west-1`      | `uw1` | `usw1`  |
| `us-west-2`      | `uw2` | `usw2`  |



## Usage

### Convert AWS region (ex.: `us-west-2`) to fixed abbreviation - will be `uw2`.
```yaml
  name: github-action-aws-region-reduction-map
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-aws-region-reduction-map@main
          id: aws_map
          with:
            region: 'us-west-2'
            ## Format can be skipped - default format would be `fixed` if region is long 
            format: 'fixed'

      outputs:
        result: ${{ steps.aws_map.outputs.result }}
```

### Convert AWS region (ex.: `us-west-2`) to short abbreviation - will be `usw2`.
```yaml
  name: github-action-aws-region-reduction-map
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-aws-region-reduction-map@main
          id: aws_map
          with:
            region: 'us-west-2'
            format: 'short'

      outputs:
        result: ${{ steps.aws_map.outputs.result }}
```

### Convert short AWS region (ex.: `usw2`) to long abbreviation - will be `us-west-2`.
```yaml
  name: github-action-aws-region-reduction-map
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-aws-region-reduction-map@main
          id: aws_map
          with:
            region: 'usw2'
            format: 'long'

      outputs:
        result: ${{ steps.aws_map.outputs.result }}
```

### Convert fixed AWS region (ex.: `uw2`) to long abbreviation - will be `us-west-2`.
```yaml
  name: github-action-aws-region-reduction-map
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    context:
      runs-on: ubuntu-latest
      steps:
        - uses: cloudposse/github-action-aws-region-reduction-map@main
          id: aws_map
          with:
            region: 'uw2'
            format: 'long'

      outputs:
        result: ${{ steps.aws_map.outputs.result }}
```






<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| format | Format convert to. Valid values ('long', 'short', 'fixed'). <br/>If empty short and fixed inputs are converted to long, long inputs are converted to fixed. | N/A | false |
| region | Input region code | N/A | true |


## Outputs

| Name | Description |
|------|-------------|
| result | Converted AWS region |
<!-- markdownlint-restore -->

