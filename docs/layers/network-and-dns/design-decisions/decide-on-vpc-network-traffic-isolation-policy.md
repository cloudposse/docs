---
title: "Decide on VPC Network Traffic Isolation Policy"
refarch_id: REFARCH-524
---

# Decide on VPC Network Traffic Isolation Policy

## Context and Problem Statement

Describe why we are making this decision or what problem we are solving.

## Considered Options

Both options support principles of least privilege.

### Option 1 - Use a Flat Network with two Subnets per AZ (Public, Private) (Recommended)

:::tip Our Recommendation is to use Option 1 because it is the easiest to administer and reduces the complexity of the
network architecture

:::

#### Pros

- Use Security Group ACLs to easily restrict service-to-service communication using Security Group IDs.

- Elastic network that doesn’t require advanced insights into the size and growth of the workloads

-

#### Cons

- Security Groups have limited flexibility across regions: e.g. Security Group ACLs only work with CIDRs across regions
  (and not by Security Group ID)

- Harder to monitor traffic between workloads

-

### Option 2 - Use a Custom Subnet Strategy Based on Workload

#### Pros

- More easily restrict network traffic across regions and data centers

- Follows principles of Least-privilege

- Also compatible with using Security Group ACLs for an additional layer of security

- Easier to monitor traffic between workloads

#### Cons

- Requires advanced planning to identify and allocate all workloads and IP space

- Harder to scale elastically

- Puts a large burden on network administrators

- Large route tables, complicated transit gateway rules

- Requires active monitoring to ensure subnets are not at capacity

## References

- Also relates to
  [Decide on AWS Account VPC Subnet CIDR Strategy](/learn/network/design-decisions/decide-on-aws-account-vpc-subnet-cidr-strategy)

- Also relates to [Decide on VPC NAT Strategy](/learn/network/design-decisions/decide-on-vpc-nat-strategy)
