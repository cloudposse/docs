---
title: "Decide on Spacelift Worker Pool Architecture"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1182597207/REFARCH-475+-+Decide+on+Spacelift+Worker+Pool+Architecture
sidebar_position: 100
refarch_id: REFARCH-475
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-spacelift-worker-pool-architecture.md
---

# Decide on Spacelift Worker Pool Architecture

## Problem
In order to provision infrastructure, we need to sufficient IAM permissions (e.g. Service Accounts) for Terraform to modify infrastructure. If we give it too much power, very bad things can happen; if we don’t give it enough, then we have no way to run automation in an unattended fashion. In an ideal world, Spacelift would use the credentials of the person making the changes, but that is not the case and this is not a problem unique to Spacelift (e.g. Terraform Cloud, Atlantis, all work this way). Instead, Terraform runs with the permissions granted to the Spacelift runners and we use Rego policies to control what a user can or cannot do.

## Context
Spacelift can use workers run Terraform inside your VPCs much like GitHub Action runners. These workers are then provisioned with IAM service account profiles that determine what Spacelift can or cannot do.

:::caution
Spacelift Enterprise subscription (or trial) is required to use self-hosted workers. See [How to Sign Up for Spacelift](/reference-architecture/how-to-guides/integrations/spacelift) for details.

:::

## Considered Options

### **Option 1:** Use Spacelift to Manage _Almost_ Everything

:::tip
Our Recommendation is to use Option 3 because it exposes the organization to less risk by not permitting Spacelift to modify anything in these core system accounts, while still permitting drift detection and accounting of what’s been deployed using Spacelift.

:::

Configure IAM role for Spacelift with mostly read-only, view-only access in the root, security and audit accounts. Prevent any account deletion, cloud trail disablement, etc. We would need to more precisely define what capabilities we tolerate in these accounts.

#### Pros

- View everything provisioned by terraform under a single pane of glass, including outputs

- Automatic Drift detection

#### Cons

- Still need to manually run terraform in the accounts which have read-only permissions under Spacelift

### **Option 2:** Use Spacelift to Manage Non-root, Security and Audit Accounts

:::info
We typically deploy this configuration, but are leaning towards Option 1 instead.

:::

#### Pros

- Enhanced security posture restricts the damage that can be done to the organization

#### Cons

- Cannot use Spacelift for accounting purposes to reconcile what has been deployed in these accounts

- Cannot use Spacelift to release changes in these accounts

### **Option 3:** Use Spacelift to Manage Everything

#### Pros

- 💯 automation of all infrastructure via Spacelift and Terraform

- Total accountability for everything under management, including drift detection

#### Cons

- The instance profile on the Spacelift workers enables _God_ mode for the entire AWS organization. Anyone with access to the worker can do _anything_ in the organization, including traverse accounts or possibly delete accounts.

## References

- [Use Spacelift for GitOps with Terraform](/reference-architecture/reference/adrs/use-spacelift-for-gitops-with-terraform)

- [How to Sign Up for Spacelift](/reference-architecture/how-to-guides/integrations/spacelift)

- [spacelift-worker-pool](/components/library/aws/spacelift/worker-pool/) (component)

