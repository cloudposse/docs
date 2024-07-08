---
title: "Decide on VPC NAT Strategy"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1358069761/REFARCH-523+-+Decide+on+VPC+NAT+Strategy
sidebar_position: 100
refarch_id: REFARCH-523
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-infrastructure/decide-on-vpc-nat-strategy.md
---

# Decide on VPC NAT Strategy

**DRAFT**

## Context and Problem Statement

## Considered Options

### Option 1 - One VPC per Region, Per Platform Account with Dedicated NAT Gateways per AZ (Recommended)

:::tip Our Recommendation is to use Option 1 because it keeps the separation by stage and ensures all egress per stage
originates from a specific set of IPs

:::

<img src="/assets/refarch/image-20220712-201801.png" height="810" width="510" /><br/>

#### Pros

- Easily managed with terraform

- Easier for third parties to restrict IPs for ingress traffic

- Keep accounts symmetrical

#### Cons

- More expensive to operate as more NAT gateways are deployed (mitigated by reducing the number of gateways in lower
  stages)

### Option 2 - One VPC per Region, Per Platform Account with Centralized NAT Gateways per AZ in Network Account

<img src="/assets/refarch/image-20220712-201801.png" height="810" width="510" /><br/>

The Compliant Framework for Federal and DoD Workloads in AWS GovCloud (US) advocates for a strategy like this, whereby
in the Network (transit) account, there will be a DMZ with a Firewall.

<img src="/assets/refarch/image-20220624-172541.png" height="3783" width="4869" /><br/>

#### Pros

- Ideally suited for meeting specific compliance frameworks

#### Cons

- All traffic from all accounts egress through the same NAT IPs, making it hard for third-parties to restrict access
  (e.g. staging accounts can access third-party production endpoints)

- Shared NAT gateways are “singletons” used by the entire organization; changes to these gateways are not be rolled out
  by stage. Risky to make changes - in the critical path of everything.

### Option 3 - Shared VPCs with Dedicated NAT Gateways

#### Pros

- Less expensive

#### Cons

- All traffic from all accounts egress through the same NAT IPs, making it hard for third-parties to restrict access
  (e.g. staging accounts can access third-party production endpoints)

- Shared VPCs are “singletons” used by multiple workloads; changes to these VPCs are not be rolled out by stage. Risky
  to make changes.

## References

- **Compliant Framework for Federal and DoD Workloads in AWS GovCloud (US)**
  [https://aws.amazon.com/solutions/implementations/compliant-framework-for-federal-and-dod-workloads-in-aws-govcloud-us/](https://aws.amazon.com/solutions/implementations/compliant-framework-for-federal-and-dod-workloads-in-aws-govcloud-us/)

- Relates to
  [Decide on AWS Account VPC Subnet CIDR Strategy](/reference-architecture/fundamentals/design-decisions/foundational-infrastructure/decide-on-aws-account-vpc-subnet-cidr-strategy)
