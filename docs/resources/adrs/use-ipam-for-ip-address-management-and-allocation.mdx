---
title: "Use IPAM for IP Address Management and Allocation"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1306296351/Use+IPAM+for+IP+Address+Management+and+Allocation
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/use-ipam-for-ip-address-management-and-allocation.md
---

# Use IPAM for IP Address Management and Allocation
**Date**: **29 Apr 2022**

:::warning Rejected!

The proposal in this ADR was rejected! For questions, please reach out to Cloud Posse.

- Too expensive without significant customer interest or value.

:::

## Status
**DRAFT**

## Problem

## Context
It’s not required to create subpools. Subpools are used when you need a logical grouping.

Management of Subnets of a VPC

-

Large enterprises want to do as much route aggregation as possible.

### Today
Today, without IPAM, for existing clients, we manage “pools” in terraform using straight subnet math:

- Pool: One supernet for the AWS organization

- Pool: Per account

- Pool: Per region VPC (with typically only one VPC per account, per region)

- Per availability zone

- public

- private

### Future
We propose managing pools in a similar manner, but introducing a pool for the OU.

- One supernet for the AWS organization

- Per OU

- Per region

- Per VPC (with typically only one VPC per account, per region) - final pool

- Per availability zone - all AZ subnets are siblings of each other, and children of the VPC

- public

- private

The more pools we create, the hard it is to leverage route aggregation.

### Use-case: Grant VPN Access in Zscaler to all non-production networks

### Use-case: Production VPC has reached 90% capacity in us-east-1 and need to add IPs

### Use-case: New production account added and needs VPCs in 2 regions

Proposal 1

```
components:
  terraform:
    # manage the organization's IPAM
    ipam:
      vars:
        organization_admin_account: network
        organization_pool_cidr: 10.0.0.0/8
        operating_regions:
            - name: ue1
              cidr: 10.0.0.0/12
            - name: ec1
              cidr: 10.16.0.0/12
            - name: ap1
              cidr: 10.32.0.0/12
        pools:
          - name: ue1-phi-data
            cidr_range: 10.0.0.0/13
            parent: ue1
          - name: ue1-non-phi-data
            cidr_range: 10.8.0.0/13
            parent: ue1
          - name: ec1-phi-data
            cidr_range: 10.16.0.0/13
            parent: ec1
          - name: ec1-non-phi-data
            cidr_range: 10.24.0.0/13
            parent: ec1
          - name: ap1-phi-data
            cidr_range: 10.32.0.0/13
            parent: ap1
          - name: ap1-non-phi-data
            cidr_range: 10.40.0.0/13
            parent: ap1

```

## Considered Options

### Option 1:

### Option 2:

### Option 3:

## Decision

**DECIDED**:

## Consequences

-

## References

-


