---
title: "Adding Users to a Team"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1289027670/How+to+Add+Users+to+a+Team+in+OpsGenie
sidebar_position: 102
---

# How to Add Users to a Team in OpsGenie

## Problem
We often need to change who on a team responding to particular alerts.

### Prerequisites
Assuming you are using the [opsgenie-team](/components/library/aws/opsgenie-team/) component with `ignore_team_members` set to `false`

## Solution

:::tip
**TL;DR**

In your team’s YAML stack configuration, add users to the `members` array block.

:::
Example Configuration:

```
members:
  - user: erik@cloudposse.com
    role: admin
  - user: ben@cloudposse.com
```

```
components:
  terraform:
    opsgenie-team-sre:
      component: opsgenie-team
      settings:
        spacelift:
          workspace_enabled: true
      vars:
        enabled: true
        name: sre
        description: "SRE team"

        members:
          - user: erik@cloudposse.com
            role: admin
          - user: ben@cloudposse.com
```


