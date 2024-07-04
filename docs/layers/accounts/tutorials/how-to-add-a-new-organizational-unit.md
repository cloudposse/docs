---
title: "Add a new Organizational Unit"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1468432446/How+to+add+a+new+Organizational+Unit
sidebar_position: 100
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/tutorials/how-to-add-a-new-organizational-unit.md
---

# How to add a new Organizational Unit

## Problem
We want to create a new Organizational Unit with an existing AWS Organization set up to Cloud Posse standards

## Solution

:::tip
TL;DR Update the `account` catalog

:::

Add the new OU to the `account` catalog and reapply the component.

:::info
The `account` component must be applied with the SuperAdmin user, which is typically found in 1Password.
For more on SuperAdmin, see[How to Create SuperAdmin user](/reference-architecture/setup/cold-start/how-to-create-superadmin-user)

:::
For example to add a new Organizational Unit called `example` with one account called `foo`, add the following to `stacks/catalog/account.yaml`:

```
components:
  terraform:
    account:
      vars:
          organizational_units:
            - name: example
              accounts:
                - name: example-foo
                  tenant: example
                  stage: foo
                  tags:
                    eks: false

```
Then reapply the `account` component:

:::caution
The `account` component is potentially dangerous! Double-check all changes planned by Terraform

:::

```
assume-role SuperAdmin atmos terraform plan account -s core-gbl-root
assume-role SuperAdmin atmos terraform apply account -s core-gbl-root
```

