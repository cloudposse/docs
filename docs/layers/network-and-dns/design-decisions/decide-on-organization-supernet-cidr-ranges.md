---
title: "Decide on Organization Supernet CIDR Ranges"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1175388431/REFARCH-240+-+Decide+on+Organization+Supernet+CIDR+Ranges
sidebar_position: 100
refarch_id: REFARCH-240
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-infrastructure/decide-on-organization-supernet-cidr-ranges.md
---

# Decide on Organization Supernet CIDR Ranges

## Problem

- We need to record all existing and provisioned CIDR ranges as a system of record, as well as any additional context as necessary (E.g. what the CIDRs are used for).

- We need to decide on the all-encompassing CIDR for this organization for contiguous networks. It’s not a requirement, but a strong recommendation.

- All VPCs subnets should be carved out of this supernet. [Decide on AWS Account VPC Subnet CIDR Strategy](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-aws-account-vpc-subnet-cidr-strategy)

## Solution

- Document the CIDR ranges provisioned for all the accounts in ADR so we know what is in use today

- Add any other known CIDR ranges (e.g. from other accounts not under this AWS organization)

- Take into account any multi-cloud, multi-region strategies.

- [https://tidalmigrations.com/subnet-builder/](https://tidalmigrations.com/subnet-builder/)

### Example

<img src="/assets/refarch/e8e9b129-c0b7-4723-a1c6-bf5e5811eb6c-media-blob-url-true-id-66a8" height="836" width="901" /><br/>

## Pro Tip

Use the [https://tidalmigrations.com/subnet-builder/](https://tidalmigrations.com/subnet-builder/)  with an additional overlay from CleanshotX.

<img src="/assets/refarch/image-20211025-172520.png" height="258" width="868" /><br/>

