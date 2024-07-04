---
title: "Define Multiple Regions"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1186365815
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-define-stacks-for-multiple-regions.md
---

# How to Define Stacks for Multiple Regions?

## Problem

We want to deploy a component or set of to multiple regions. The components might need specific settings depending on the region. We want to be as DRY as possible but not compromise on the customization of the configuration.

## Solution

First, make sure you’re familiar with [Stacks](/fundamentals/stacks) and [How to Use Imports and Catalogs in Stacks](/reference-architecture/how-to-guides/tutorials/how-to-use-imports-and-catalogs-in-stacks) with [Components](/components) Inheritance.

:::tip
Define one stack configuration for every region and simply import the catalog configuration with all components you want to re-use per region.

:::

Let’s say we want to deploy the [vpc](/components/library/aws/vpc/) into the AWS `us-east-1` and `us-west-2` regions in the `dev` account. We’ll want to customize the CIDR block, region, and availability zones used. Here’s how to do it...

1. Define a catalog entry for the common `vpc` configuration. This is where we can define our organizations best-practices for a VPC.

```
# stacks/catalog/vpc.yaml
components:
  terraform:
    vpc:
      backend:
        s3:
          workspace_key_prefix: vpc
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        subnet_type_tag_key: acme.net/subnet/type
        vpc_flow_logs_enabled: true
        #vpc_flow_logs_bucket_environment_name: uw2
        vpc_flow_logs_bucket_stage_name: audit
        vpc_flow_logs_bucket_tenant_name: mgmt
        vpc_flow_logs_traffic_type: ALL
```

2. Now define a stack configuration for the `us-east-1` region.

```
# stacks/ue1-dev.yaml
import:
- catalog/vpc

# Define the global variables for this region
vars:
  region: us-east-1
  environment: ue1

components:
  terraform:
    vpc:
      vars:
        cidr_block: 10.1.0.0/18
        vpc_flow_logs_bucket_environment_name: ue1
        availability_zones:
          - "us-east-1a"
          - "us-east-1b"
          - "us-east-1c"
```

3. Then repeat the process and define a stack configuration for the `us-west-2` region.

```
# stacks/uw2-dev.yaml
import:
- catalog/vpc

# Define the global variables for this region
vars:
  region: us-west-2
  environment: uw2

components:
  terraform:
    vpc:
      vars:
        cidr_block: 10.2.0.0/18
        vpc_flow_logs_bucket_environment_name: uw2
        availability_zones:
          - "us-west-2a"
          - "us-west-2b"
          - "us-west-2c"
```

Now use the standard [Atmos](/fundamentals/atmos) commands to plan and apply the stack configurations.

