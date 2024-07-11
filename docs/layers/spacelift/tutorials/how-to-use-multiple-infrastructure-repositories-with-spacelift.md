---
title: "Multiple Infrastructure Repositories"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1182367758
sidebar_position: 100
---

# How to Use Multiple Infrastructure Repositories with Spacelift

## Problem

Using a single infrastructure repository makes a lot of sense for foundational infrastructure, but sometimes it would be nicer to colocate infrastructure code alongside other products. For example, a data science team might work out of a separate repository where they store all their airflow DAGs or snowflake queries. In that case, it might be nice to manage the terraform code outside of the infrastructure repository.

## Solution

:::tip
Our stack configurations can reference terraform components from any repository in the GitHub organization

:::

The Cloud Posse convention is to use the `infrastructure` repository as your centralized registry of stack configurations so you know where everything that’s deployed across your organization resides. It helps avoid code sprawl where you have hundreds of repositories and no record of how it’s managed. But just like any good registry, the stack configuration can point to other GitHub repositories that contain a terraform component. The great thing about this is that there’s centralized governance over what is managed by Spacelift via Rego policies, and decentralized location of the infrastructure code granting teams the autonomy to build and manage their own services.

This strategy is useful in combination with deploying infrastructure code for entirely different systems like Cloudflare or Snowflake via terraform.

### Example Component

In the following snippet, we’re deploying a component named `snowflake` defined in the `snowflake` repository under the `terraform` folder from the `main` branch.

```
components:
  terraform:
    snowflake:
      component: spacelift-stack
      settings:
        spacelift:
          workspace_enabled: true
          autodeploy: true
          repository: snowflake
          branch: main
          component_root: terraform
      vars:
        enabled: true
        name: snowflake
```

## Related

- [How to terraform non-AWS infrastructure?](/reference-architecture/how-to-guides/tutorials/how-to-terraform-non-aws-infrastructure)


