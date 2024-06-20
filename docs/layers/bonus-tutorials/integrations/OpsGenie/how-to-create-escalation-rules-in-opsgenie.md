---
title: "Adding Escalation Rules"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1278377985/How+to+Create+Escalation+Rules+in+OpsGenie
sidebar_position: 103
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/how-to-guides/integrations/opsgenie/how-to-create-escalation-rules-in-opsgenie.md
---

# How to Create Escalation Rules in OpsGenie

## Problem
You want to control what to do when an alert isn’t acknowledged.

## Solution

:::tip
**TL;DR** This is controlled by escalation rules in the stack configuration of the `opsgenie-team`.

:::
An Escalation resource for a team is directly exposed via a map. Have a look at [escalations in terraform for exact variable names](https://registry.terraform.io/providers/opsgenie/opsgenie/latest/docs/resources/escalation)  and [How do escalations work in opsgenie](https://support.atlassian.com/opsgenie/docs/how-do-escalations-work-in-opsgenie/) to determine how you want to configure your escalations.

An example is below

```
components:
  terraform:
    opsgenie-team-my-team:
      component: opsgenie-team
      ...
        escalations:
          my-team_escalate_to_sre:
            enabled: true
            description: "Escalate to 'sre' team if 'my-team' team does not acknowledge"
            rule:
              condition: if-not-acked
              notify_type: all
              delay: 5
              recipients:
                - type: team
                  team_name: sre
            repeat:
              wait_interval: 10
              count: 2
              reset_recipient_states: false
              close_alert_after_all: false
```


