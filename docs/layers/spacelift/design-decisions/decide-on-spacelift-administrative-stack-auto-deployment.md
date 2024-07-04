---
title: "Decide on Spacelift Administrative Stack Auto-deployment"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1171980545/REFARCH-410+-+Decide+on+Spacelift+Administrative+Stack+Auto-deployment
sidebar_position: 100
refarch_id: REFARCH-410
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-platform/decide-on-spacelift-administrative-stack-auto-deployment.md
---

# Decide on Spacelift Administrative Stack Auto-deployment

## Problem
Spacelift (and for that matter, pretty much any CI/CD platform including Atlantis) will only run workflows that have been configured to run on the platform (e.g. there is no auto-discovery of stacks). While systems like GitHub Actions will automatically run workflows in a branch or Pull Request from any repo, Spacelift by design does not do this for security reasons, since that would mean any rogue repo or branch could modify infrastructure.

In order for the stack to run in spacelift, the configuration needs to be merged into `main` and confirmed (e.g. applied). Frequently, users forget about this, so after merging to main the infrastructure stack is not confirmed and then they are left scratching their heads why their stack didn’t run.

## Context
There are 2 kinds of Spacelift stacks: administrative stacks and component stacks (which are created by an admin stack).

The “infrastructure” stack is an _administrative stack_ that deploys and manages component stacks. This means this stack has special permissions to manage spacelift itself, but actually no credentials to manage AWS (or other services). In the screenshot, you can see that the stack is _Administrative_ on the status line under Resources.

This admin stack is manually created in Spacelift (it’s how it knows about your infrastructure repository) and it runs the Terraform code in the `components/terraform/spacelift` component to create all your other component stacks.

When making changes or adding a new component to a stack configuration in Spacelift, those changes must be applied first by the administrative stack before Spacelift can do anything with it (e.g. show a terraform plan of this stack).

<img src="/assets/refarch/cleanshot-2021-11-24-at-14.59.56@2x-20211124-210413.png" height="849" width="1129" /><br/>

## Considered Options

### Option 1: Autodeploy Spacelift Administrative Stack

Usually, CloudPosse sets this admin stack to `autodeploy=true` for customers so that new stacks are provisioned when detected otherwise the risk is that the admin stack is unconfirmed and forgotten about.

:::note
Note that by turning on auto deploy on the admin stack, it does not turn auto deploy on the component stacks. We default component stacks to be manually confirmed before the changes are applied.

:::

#### Pros

- Adding stacks feels more natural. As soon as you merge the PR with the new stack, Spacelift will configure it without further intervention by users.

#### Cons

- Stacks can be accidentally deleted by misconfiguration (E.g. user error) in a PR. When that happens, the history of that stack will be lost in the Spacelift UI. The AWS stacks themselves are not affected at all. We are working with Spacelift to add a deletion protection flag to avoid this from happening.

### Option 2: Manually Confirm Spacelift Administrative Stack

:::caution
If `autodeploy=false` on the admin stack, then new stacks will have to be manually confirmed after each PR merge before any changes are planned, which is frequently confusing for developers.

:::

#### Pros

- The risk of accidentally deleting a stack configuration in the UI is reduced

#### Cons

- Users are frequently confused why their stack does not show any plans or why nothing is terraformed.

- Users forget to confirm the changes to the Spacelift configuration because this implementation detail is not obvious to them.

