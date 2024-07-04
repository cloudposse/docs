---
title: "Decide on Host OS Flavor for EKS"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176109972/REFARCH-49+-+Decide+on+Host+OS+Flavor+for+EKS
sidebar_position: 100
refarch_id: REFARCH-49
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-host-os-flavor-for-eks.md
---

# Decide on Host OS Flavor for EKS

## Problem
We need to pick the AMI which will be used by the EKS cluster nodes. There are a few options and the right one depends on your needs and organization’s requirements for compliance and packaging. It also relates to [Decide on Technical Benchmark Framework](/reference-architecture/fundamentals/design-decisions/foundational-benchmark-compliance/decide-on-technical-benchmark-framework) and [Decide on Strategy for Hardened Base AMIs](/reference-architecture/fundamentals/design-decisions/foundational-benchmark-compliance/decide-on-strategy-for-hardened-base-amis).

## Solution
EKS managed & unmanaged node groups support the ability to have custom AMIs. By default, we use Amazon Linux.

Where this might be insufficient is if your organization requires a vetted OS or specific tools for audits.

Since this is a reversible decision, so we can start with Amazon Linux and change later if needed.

### Option 1: Bottlerocket
Amazon’s Bottlerocket OS is a container-native OS built to be immutable and only supports non-root containers. It supports a Kubernetes Operator for automatically updating the cluster, in a way reminiscent of the `update_engine` of the CoreOS (defunct).

[https://aws.amazon.com/blogs/containers/amazon-eks-adds-native-support-for-bottlerocket-in-managed-node-groups/](https://aws.amazon.com/blogs/containers/amazon-eks-adds-native-support-for-bottlerocket-in-managed-node-groups/)

[https://aws.amazon.com/bottlerocket/](https://aws.amazon.com/bottlerocket/)

[https://github.com/bottlerocket-os/bottlerocket-update-operator](https://github.com/bottlerocket-os/bottlerocket-update-operator)

### Option 2: Amazon Linux
Our standard recommendation is to use Amazon Linux’s EKS optimized image which is the most battle-tested in the AWS landscape.

### Option 3: DIY
If we want to build custom AMIs, then we recommend using Packer with GitHub Action workflows to automatically build and push AMIs.

**REVERSIBLE**



