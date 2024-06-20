---
title: "Proposed: Spacelift Admin Stack Architecture"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1267466264/Proposed%3A+Spacelift+Admin+Stack+Architecture
sidebar_position: 200
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/reference/adrs/proposed-spacelift-admin-stack-architecture.md
---

# Proposed: Spacelift Admin Stack Architecture
**Date**: **19 Oct 2021**

:::info Needs Update!

The content in this ADR may be out-of-date and needing an update. For questions, please reach out to Cloud Posse

- Cloud Posse refactored our Spacelift implementation with [PR #717](https://github.com/cloudposse/terraform-aws-components/pull/717) and since updated the documentation included with the components. [More on Spacelift](components/library/aws/spacelift/).

:::

## Status
**DRAFT**

## Problem
1. Human error - Stages that do not have spacelift access, will accidentally have spacelift enabled for stacks in those stages. This is due to human error which is an easy mistake to make.

2. High blast radius - Spacelift admin stacks have significant blast radius as we have a single admin stack that controls all of the infrastructure in an entire organization

3. Admin stack errors - Spacelift admin stack may error out in the middle of the apply due to one of the stacks currently in use, preventing the following stacks from modification. This requires rerunning the admin stack.

4. High priority fixes can be queued - Need to get a high priority fix out and if the change is in `globals.yaml` or similar import and we want the fix to be deployed to prod first, how would we prioritize that up the chain instead of waiting for all the queued stacks to be finished first. No sense of priority.

5. Same policies and configurations that’s associated with every spacelift stack

6. All stacks cannot be shown in Spacelift

## Context

## Considered Options

### Option 1: Single admin stack

Pros:

- Consistency

Cons:

- Significant blast radius (problem 2)

- Forces a single worker pool (problem 4)

- Same policies and configuration that’s associated with every spacelift stack (problem 5)

### Option 2: Multi admin stack

Segment on `<tenant>-<stage>`

We can use [var.context_filters](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation#input_context_filters) on the spacelift component to explicitly say that we only want to capture spacelift stacks for stages like `auto`, `corp`, `dev`, `staging`, etc.

Pros:

- Using context_filters, we can capture specific stages for specific admin stacks. e.g. admin stack for `auto` can use a filter for only `auto` stacks (solves problem 1)

- Limited blast radius (solves problem 2)

- Reduces admin stack issues (reduces problem 3)

- Option to use multiple worker pools so for high priority items you can have a separate worker pool for prod vs dev (solves problem 4)

- Allows policy and configuration on a per stage basis (solves problem 5)

Consequences

- To make admin stack creations easier, we would need to codify the spacelift admin stack and reuse the [stack submodule](https://github.com/cloudposse/terraform-spacelift-cloud-infrastructure-automation/tree/master/modules/stack)

### Option 3: Read-write only policies

Pros:

- Consistency

Cons:

- Have to ensure that security, audit, root, identity do not have spacelift stacks enabled (problem 6)

### Option 4: Read-write policies for some and Read for others

Option 2 (multiple admin stacks) could be a prereq for this however, with some terraform magic, we could add different policies for different accounts.

Pros:

- All stacks can be shown in spacelift (solves problem 6)

- Allows read-write policies for dev, qa, auto, corp, etc

- Allows read for security, audit, root, identity

Cons:

- If went with a single admin stack, this would require changes to the cloudposse spacelift module to change policies based on some input.

### Option 5: Single worker pool

Pros:

- Single worker pool so costs don’t have to be managed across multiple ASGs

Cons:

- High priority changes may be queued behind other changes (problem 4)

### Option 6: Multiple worker pools

This is currently solved in one of our customers using multiple admin stacks.

Option 2 (multiple admin stacks) could be a prereq for this however, with some terraform magic, we could add different policies for different accounts.

Pros:

- High priority changes can be delivered faster if changes need to go into prod first. Prod can have its own worker pool and non-prod can all share a separate pool.

Cons:

- Costs could get out of control if too many worker pools. More workers, higher cost.

- If went with a single admin stack, this would require changes to the cloudposse spacelift module to change worker pools based on some input.

### Option 7: Combination - Multi admin stacks, read&write policies for some and read policies for others, and multiple worker pools

We could do option 2, have multiple admin stacks to solve problems 1 to 5.

We could do option 4, have read/write policies for and read only for others to solve problem 6.

We could do option 6, multiple worker pools. One worker pool for prod (min 1, max 10) and one worker pool (min 1, max 10) for all others. This solves problem 4.

## Decision

**DECIDED**:
Loose decision for cplive

- Organize admin stacks around teams because

- overall we’re adopting a strategy where components are organized around teams where it makes sense e.g. opsgenie-team, datadog, and soon iam

- Teams are an easy construct for people to grok

- (optional) single spacelift worker pool

- ideally each admin stack associated with a dedicated worker pool

- worker pools can more easily be granted more narrowly scoped iam roles e.g. security stack mapped to security team with a security worker pool

- Spacelift is introducing spaces (end of july 2022) which map to teams which map to worker pools

## Consequences

-

-

-

## References

-


