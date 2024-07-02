---
title: "Decide on Datadog Log Forwarding Requirements"
confluence: https://cloudposse.atlassian.net/wiki/spaces/REFARCH/pages/1278738446/REFARCH-521+-+Decide+on+Datadog+Log+Forwarding+Requirements
sidebar_position: 100
refarch_id: REFARCH-521
custom_edit_url: https://github.com/cloudposse/refarch-scaffold/tree/main/docs/docs/fundamentals/design-decisions/decide-on-datadog-log-forwarding-requirements.md
---

# Decide on Datadog Log Forwarding Requirements

## Context and Problem Statement
Datadog supports log ingestion, but [it can be costly.](https://www.datadoghq.com/pricing/?product=log-management#log-management) Some companies prefer to use in-place tooling like Splunk or Sumologic instead.

## Considered Options

### Option 1  (Recommended) - Use Datadog

:::tip
Our Recommendation is to use Option 1 because you get a single pane of glass view into all operations

:::

### Option 2 - Other

#### Pros

- Tightly integrated with your existing systems

- Possible lower cost to operate that Datadog

#### Cons

- We cannot assist with the implementation aside from forwarding logs using something like `fluentd` or `fluentbit`


