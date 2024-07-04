---
title: "Decide on AWS Organization Strategy"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176077606/REFARCH-471+-+Decide+on+AWS+Organization+Strategy
sidebar_position: 100
refarch_id: REFARCH-471
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/cold-start/decide-on-aws-organization-strategy.md
---

# Decide on AWS Organization Strategy

:::tip
Cloud Posse recommends starting with a **Net-New Organization**

:::

## Problem

- Only one AWS Control Tower can exist in an organization.

- AWS Control Tower cannot be managed with Terraform (as of 2021-10-29). Depending on the Scope of Work, Cloud Posse is usually responsible for provisioning accounts with terraform which requires all the same access as Control Tower.

- Member accounts can only be provisioned from the top-level root “organization” account

- The “root” account has a special `OrganizationalAccessRole` that can be used to administrate member accounts

- With only one root organization, a business has no way to model/test/experiment with organizational-level configuration, which is a massive liability for onboarding new staff engineers responsible for training and to manage an organization

## Solution

Here are some considerations for how we can work around the problems.

### Use Net-New Organization  (Recommended)

This process involves [How to Register Pristine AWS Root Account](/reference-architecture/setup/cold-start/how-to-register-pristine-aws-root-account) which will serve as a net-new AWS organization (e.g. top-level payer account). Use transit gateway or VPC peering between heritage accounts and new accounts.

This process ensures that there’s a clear delineation between the historical infrastructure and next-gen. We’ll treat the historical infrastructure as _tainted_, as in we do not know what was done with IaC; we’ll treat the next-gen accounts as pristine, hermetic environments where all changes are performed using IaC.

:::info
Companies with an AWS Enterprise Agreement (EA) can arrange for consolidated invoicing by speaking with their AWS Account Representative.

:::

:::caution
Reserved Instances and AWS Savings Plans cannot be shared across organizations.

:::

### Use Existing Organization

You will need to grant Cloud Posse Administrative permissions in the root account in order to perform terraform automation of organizational infrastructure (E.g. Accounts, SCPs, Cloud Trails, etc).

:::danger
Cloud Posse does not prefer to work with **Existing Organizations** due to the liability. Cloud Posse does not know your organization as well as you do, and in order for us to manage an organization with Terraform we need to be Organizational Admins.

:::

:::caution
Cloud Posse recommends using the **Model Organization** pattern if you wish to use an **Existing Organization**.

:::

### Use Model Organization

This pattern assumes we’ll provision a Net-New Organization that will be used for model purposes. It will not be used in a real production setting, but instead will be used as part of the engagement to enable Cloud Posse to set up all scaffolding.

This pattern builds on the **Net-New Organization** but anticipates the customer re-implementing the entire process in their own existing organization. This process takes longer, but ensures your team gets the maximum onboarding experience and validates the documentation end-to-end by running your team through the process.

:::caution
Cloud Posse cannot estimate the time it will take your team to follow the documentation and implement it in your existing organization.

:::

:::caution
Reserved Instances and AWS Savings Plans cannot be shared across organizations.

:::

:::danger
We do not recommend this pattern if Release Engineering is in scope with your engagement with Cloud Posse.

:::

