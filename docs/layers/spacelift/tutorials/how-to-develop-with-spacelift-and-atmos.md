---
title: "Develop with Atmos"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1176010979/How+to+Develop+with+Spacelift+and+Atmos
sidebar_position: 100
---

# How to Develop with Spacelift and Atmos

## Problem
- Spacelift is great for day-2 operations, such as making changes to existing components and changing settings, but it’s not so great for the execution of workflow needed to bring up an entire stack or modify lots of components within a single Pull Request.

- Atmos is very convenient for development but doesn’t provide the team collaboration benefits, policy controls, audit trails & accounting that we get when we use Spacelift

- Iterating on development with Spacelift is a very slow feedback cycle (save work, commit, push, wait, repeat) compared to local development with `atmos`

- Performing state migrations (e.g. `terraform mv`) and state imports using Spacelift Tasks is great for auditability, but cumbersome/slow as a developer who can just run `atmos` locally in a terminal

- It’s complicated if you need to perform more than one operation affecting more than one component in a PR or commit that depends on other actions happening first

- If operations are performed in `atmos` on the command line, those changes are unavailable to Spacelift; concurrent development in both Spacelift and `atmos` will lead to conflicts in terraform state and rolling back to one or the other. Spacelift is always watching the `main` branch and drift detection will automatically propose a plan to remediate the drift. Changes made by atmos (e.g. from other branches) will appear as drift.

- Dependencies between components are enforced by a _best-effort_ using labels, but not guaranteed and don’t work in all situations and are not enforced in `atmos` (only Spacelift). See [How to Manage Explicit Component Dependencies with Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/how-to-manage-explicit-component-dependencies-with-spacelift)

- Destroying a component is not always easy (for good and bad reasons). See [How to Destroy a Component using `atmos` or Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/how-to-destroy-a-component-using-atmos-or-spacelift) for details.

- Spacelift doesn’t have a visual way of releasing/promoting a change across environments; the user must confirm the plan for each stack in the order they must be applied

## Prerequisites

Review why we [Use Spacelift for GitOps with Terraform](/reference-architecture/reference/adrs/use-spacelift-for-gitops-with-terraform) and [Atmos](/fundamentals/atmos) documentation.

## Workflow

:::caution
**Practice “Inbox Zero” with Spacelift**

Maintaining good Spacelift status for our stacks is **very important.** If we see stacks that are “Failed” or “Unconfirmed”, it is everyone's responsibility to ensure they are remediated in a tie mely manner. The longer plans go unconfirmed or remain in a failed state, the less confident we are about the state of the infrastructure and able to react to events as they happen.

:::

Here’s the general workflow when working with infrastructure:

<img src="/assets/refarch/cleanshot-2021-10-17-at-15.53.14@2x-20211017-205340.png" height="188" width="193" /><br/>

1. Apply your changes through Spacelift where/whenever possible.
(open PR → spacelift proposed run looks OK → approve & merge → spacelift plan, confirm, apply, party on)

2. When/where not possible to run via Spacelift: after applying manually, backfill changes into source control and trigger a spacelift run to ensure stack is successfully finished ASAP
(spacelift can also import out-of-band changes via Tasks!). Even better, if you put your manual changes as an "I'm going to do _this_" in your PR along with any TF to backfill, and use that as a proposed change record.

3. Use `dev` as the environment to test manual changes / or develop new modules, if not ready for spacelift before promoting to other envs
(dev → staging → prod)

The general workflow, however, doesn’t address all use-cases. Please review the various use-cases and follow the best practices for tackling each scenario.

## Use-cases

Here are the most common scenarios developers will encounter and how to approach them.

### Use-case #1: Developing a New Component

Document: How to develop a new component and add to a stack configuration

### Use-case #2: Modifying/Updating an Existing Component or Stack

Document: how to make changes (e.g. with PR) and see what the impact is of those changes

Document: how to debug with Spacelift when things go wrong

### Use-case #2: Destroying Components

[How to Destroy a Component using `atmos` or Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/how-to-destroy-a-component-using-atmos-or-spacelift)

How to use `spacelift_stack_destructor` with Spacelift. @Andriy Knysh

### Use-case #3: Creating/Destroying a Stack (e.g. Complete Environment)

Document: How to generally approach the creation or destruction of multiple components with dependencies on the order of operation

This is the use-case for workflows. Mostly it needs to be done on the command line using `atmos`.

## FAQ

## How to get access to Spacelift?

Access is frequently given by including the GitHub user in the GitHub org which then gives access to the org Spacelift using URL: `https://<githuborg>.app.spacelift.io`

Alternatively, for companies using SSO together with Spacelift, the Developer needs to be added to the appropriate group in the IdP.

## How to apply all the changes in my PR?

## How to set up Spacelift?

If you haven’t yet signed up for Spacelift, see [How to Sign Up for Spacelift](/reference-architecture/how-to-guides/integrations/spacelift).

Once the Spacelift account is set up, follow the

## How to Destroy a Spacelift stack and the components?

See [How to Destroy a Component using `atmos` or Spacelift](/reference-architecture/how-to-guides/integrations/spacelift/how-to-destroy-a-component-using-atmos-or-spacelift)


