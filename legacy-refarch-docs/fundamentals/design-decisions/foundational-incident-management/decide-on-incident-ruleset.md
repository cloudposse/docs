---
title: "Decide on Incident Ruleset"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1271922722/REFARCH-519+-+Decide+on+Incident+Ruleset
sidebar_position: 100
refarch_id: REFARCH-519
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/foundational-incident-management/decide-on-incident-ruleset.md
---

# Decide on Incident Ruleset

## Context and Problem Statement

We need to decide the rules that make an alert an incident. This ruleset could be based on priority-level of the alert, message, or by tag.

Opsgenie can escalate an alert into an incident, this marks the alert as more severe and needs more attention than a standard alert. See [How to Implement Incident Management with OpsGenie](/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie) for more details on what an **Incident** is.

:::info
Picking a standard here provides a clear understanding to when an alert should become an incident, ideally this is not customized by each team.

:::

## Considered Options

### Option 1 - Priority Level Based (P1 & P2) (Recommended)

:::tip
Recommended because maps 1-1 with Datadog Severity and provides a clear understanding

:::

#### Pros

- Priority is a first-class field in Datadog and Opsgenie

- Directly maps to Datadog severity level in monitors.

- P1 & P2 Are considered Critical and High priority, allowing slight variation in the level of incidents.

- Dynamic based on the Monitoring Platform (e.g. Datadog can say if this alert happens 5x in 1 min, escalate priority)

### Option 2 - Priority Level Based (Other)

This could be only **P1** or any range.

#### Pros

- Directly maps to Datadog severity level in monitors.

- Dynamic based on the Monitoring Platform (e.g. Datadog can say if this alert happens 5x in 1 min, escalate priority)

### Option 3 - Tag Based

Tag based approach would mean any monitor that sends an alert with a tag `incident:true` becomes an incident.

#### Pros

- Dynamic based on the Monitoring Platform (e.g. Datadog can say if this alert happens 5x in 1 min, escalate priority)

#### Cons

- Incidents can now be defined in more than one way

- An extra field must be passed

- Puts definition of an incident on the monitoring platform.

## References

- [How to Implement Incident Management with OpsGenie](/reference-architecture/how-to-guides/tutorials/how-to-implement-incident-management-with-opsgenie)

- [How to Implement SRE with Datadog](/reference-architecture/how-to-guides/integrations/datadog)

- [REFARCH-519 - Decide on Default Priority to Incident Mappings](https://cloudposse.atlassian.net/browse/REFARCH-519)


