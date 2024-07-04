---
title: "Create a New Team"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1277591559/How+to+Create+New+Teams+in+OpsGenie
sidebar_position: 101
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/opsgenie/how-to-create-new-teams-in-opsgenie.md
---

# How to Create New Teams in OpsGenie

## Problem
As a company grows so does its number of teams. We need a way to be easily able to configure a new team with alerting on particular resources.

## Solution
The [opsgenie-team](/components/library/aws/opsgenie-team/) component can be used as a virtual component to create a new team.

:::tip
**TL;DR**
Create a new opsgenie-team component. Then tag resources with the `team: <my-new-team-name>` to start sending alerts through datadog.

:::

### Prerequisites
- [How to Implement Incident Management with OpsGenie](/reference-architecture/how-to-guides/integrations/opsgenie)

- [How to Implement SRE with Datadog](/reference-architecture/how-to-guides/integrations/datadog)

- [opsgenie-team](/components/library/aws/opsgenie-team/)

### Basic Configuration

```
components:
  terraform:
    opsgenie-team-sre:
      component: opsgenie-team
      vars:
        enabled: true

        # Name of the team and the name of the team tag value
        # Teams must be globally unique
        name: sre
        description: "SRE team"

        # Services can only be owned by a single team, so we put the services with the team
        # Service names are globally unique or will conflict with other teams
        # Services may not map directly to github repos, as multiple microservices might make up one service
        services:
          frontend:
            description: "Front End Lorem Ipsum"
          backend:
            description: "Back End Lorem Ipsum"

        members:
          - user: erik@cloudposse.com
            role: admin

        integrations: {}
        routing_rules: {}
```

### Tagging
Resources should then be tagged with the `team:team` name tag. This would look like

```
components:
  terraform:
    aurora-postgres:
      vars:
        tags:
          team: sre
          service: aurora-postgres
```

